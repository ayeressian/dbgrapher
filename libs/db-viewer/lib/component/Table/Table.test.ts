/* eslint-disable @typescript-eslint/no-non-null-assertion */
import schoolSchema from "../../../src/school";
import {
  render,
  type RenderResult,
  fireEvent,
  screen,
} from "@testing-library/svelte";
import Table from "./Table.svelte";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type Point from "../../point";
import { Store } from "../../store/store";

function getStore() {
  const store = new Store();
  store.schema.setSchema(schoolSchema);
  store.table.getTableSize("school")?.set({
    width: 200,
    height: 300,
  });
  store.view.viewSize.set({
    width: 800,
    height: 1000,
  });
  return store;
}

describe(Table.name, () => {
  let component: RenderResult<Table>;

  beforeAll(() => {
    global.ResizeObserver = vi.fn().mockImplementation((func) => {
      func([{ contentRect: { width: 800, height: 1000 } }]);
      return {
        observe: vi.fn(),
      };
    });
  });

  beforeEach(async () => {
    const context = new Map();
    context.set("store", getStore());
    component = render(Table, {
      props: {
        name: "school",
        click: vi.fn(),
        contextMenu: vi.fn(),
        dblClick: vi.fn(),
        mouseDown: vi.fn(),
      },
      //ignore the error, incorrect lib typing
      context,
    });
  });
  it("should render properly", () => {
    expect(component).toMatchSnapshot();
  });

  describe("when table is being moved", () => {
    const initCord = {
      x: 200,
      y: 300,
    };

    const moveCord = {
      x: 500,
      y: 600,
    };

    let schoolSchemaPos: Point;

    beforeEach(async () => {
      schoolSchemaPos = schoolSchema.tables.find(
        (table) => table.name === "school"
      )!.pos;
      const schoolGElem = component.getByTestId("table-school").parentElement!;
      const mouseDown = new MouseEvent("mousedown", {
        clientX: initCord.x,
        clientY: initCord.y,
      });
      screen.debug();
      await fireEvent(schoolGElem, mouseDown);
      const mouseMove = new MouseEvent("mousemove", {
        clientX: moveCord.x,
        clientY: moveCord.y,
      });
      await fireEvent(document, mouseMove);
      const mouseUp = new MouseEvent("mouseup");
      await fireEvent(document, mouseUp);
      setTimeout(() => {
        screen.debug();
      }, 1000);
    });

    it.only("should have correct cordinates", () => {
      const schoolElem = component.getByTestId("table-school");
      expect(schoolElem.getAttribute("x")).toEqual(
        String(schoolSchemaPos.x + moveCord.x - initCord.x)
      );
      expect(schoolElem.getAttribute("y")).toEqual(
        String(schoolSchemaPos.y + moveCord.y - initCord.y)
      );
    });
  });
});
