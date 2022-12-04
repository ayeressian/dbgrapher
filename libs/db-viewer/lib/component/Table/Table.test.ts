/* eslint-disable @typescript-eslint/no-empty-function */
import schoolSchema from "../../../src/school";
import { setSchema } from "../../store/schema";
import {
  render,
  type RenderResult,
  fireEvent,
  cleanup,
} from "@testing-library/svelte";
import Table from "./Table.svelte";
import { beforeEach, describe, expect, it } from "vitest";
import type Point from "../../point";

describe(Table.name, () => {
  let component: RenderResult<Table>;

  beforeEach(async () => {
    setSchema(schoolSchema);
    cleanup();
    component = render(Table, {
      name: "school",
      click: () => {},
      contextMenu: () => {},
      dblClick: () => {},
      mouseDown: () => {},
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
      await fireEvent(schoolGElem, mouseDown);
      const mouseMove = new MouseEvent("mousemove", {
        clientX: moveCord.x,
        clientY: moveCord.y,
      });
      await fireEvent(document, mouseMove);
      const mouseUp = new MouseEvent("mouseup");
      await fireEvent(document, mouseUp);
    });

    it("should have correct cordinates", () => {
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
