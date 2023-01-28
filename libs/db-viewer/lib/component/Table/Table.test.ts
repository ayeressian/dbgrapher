import schoolSchema from "../../../src/school";
import {
  render,
  type RenderResult,
  fireEvent,
  act,
} from "@testing-library/svelte";
import Table from "./Table.svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type Point from "../../point";
import { Store } from "../../store/store";
import { get, type Writable } from "svelte/store";

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
  let store: Store;
  beforeEach(async () => {
    const context = new Map();
    store = getStore();
    context.set("store", store);
    global.ResizeObserver = vi.fn().mockImplementation((func) => {
      return {
        observe: () => {
          func([{ borderBoxSize: [{ inlineSize: 100, blockSize: 100 }] }]);
        },
      };
    });
    component = render(Table, {
      props: {
        name: "school",
        click: vi.fn(),
        contextMenu: vi.fn(),
        dblClick: vi.fn(),
        mouseDown: vi.fn(),
        tableMoveEnd: vi.fn(),
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
      schoolSchemaPos = get(
        store.table.getTablePos("school") as Writable<Point>
      );
      const schoolGElem = component.getByTestId("table-school")
        .parentElement as HTMLElement;
      const mouseDown = new MouseEvent("mousedown", {
        clientX: initCord.x,
        clientY: initCord.y,
      });
      await act(() => fireEvent(schoolGElem, mouseDown));
      // await fireEvent(schoolGElem, mouseDown);
      // await wait(1000);
      const mouseMove = new MouseEvent("mousemove", {
        clientX: moveCord.x,
        clientY: moveCord.y,
      });
      await act(() => fireEvent(document, mouseMove));
      const mouseUp = new MouseEvent("mouseup");
      await act(() => fireEvent(document, mouseUp));
    });

    it.skip("should have correct cordinates", () => {
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
