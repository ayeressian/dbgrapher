/* eslint-disable @typescript-eslint/no-empty-function */
import type { ColumnSchema } from "../../schema";
import { render, type RenderResult } from "@testing-library/svelte";
import Column, { Highlight } from "./Column.svelte";
import { beforeEach, describe, expect, it } from "vitest";

describe(Column.name, () => {
  let component: RenderResult<Column>;

  beforeEach(async () => {
    const columnSchema: ColumnSchema = {
      name: "test",
      type: "int",
    };
    component = render(Column, {
      column: columnSchema,
      columnEnter: () => {},
      columnLeave: () => {},
      highlight: Highlight.None,
    });
  });
  it("should render properly", () => {
    expect(component).toMatchSnapshot();
  });
});
