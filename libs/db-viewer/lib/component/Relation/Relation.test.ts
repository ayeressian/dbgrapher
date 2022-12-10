import { render, type RenderResult } from "@testing-library/svelte";
import school from "../../../src/school";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Store } from "../../store/store";
import Relation from "./Relation.svelte";
import type { ComponentProps } from "svelte";

function getStore() {
  const store = new Store();
  store.schema.setSchema(school);
  store.table.getTableSize("school")?.set({
    width: 200,
    height: 300,
  });
  store.table.getTableSize("student")?.set({
    width: 200,
    height: 400,
  });
  return store;
}

describe(Relation.name, () => {
  let component: RenderResult<Relation>;

  const props: ComponentProps<Relation> = {
    fromTable: "school",
    toTable: "student",
    oneTo: true,
    toMany: false,
    fromColumn: "test1",
    toColumn: "test1",
    key: "1234",
    click: vi.fn(),
    contextMenu: vi.fn(),
    dblClick: vi.fn(),
  };

  const context = new Map();
  context.set("store", getStore());

  beforeEach(async () => {
    component = render(Relation, {
      props,
      //ignore the error, incorrect lib typing
      context,
    });
  });
  it("should render properly", () => {
    expect(component).toMatchSnapshot();
  });
});
