import { cleanup, render, type RenderResult } from "@testing-library/svelte";
import Relation from "./Relation.svelte";
import { setSchema } from "../../store/schema";
import school from "../../../src/school";
import { beforeEach, describe, expect, it } from "vitest";
import { getTableSize } from "lib/store/table";

const setTimeoutAsync = (timer = 0) =>
  new Promise((resolve) => setTimeout(resolve, timer));

describe(Relation.name, () => {
  let component: RenderResult;

  beforeEach(async () => {
    setSchema(school);
    getTableSize("school")?.set({
      width: 200,
      height: 300,
    });
		getTableSize("student")?.set({
      width: 200,
      height: 400,
    });
    cleanup();
    component = render(Relation, {
      fromTable: "school",
      toTable: "student",
      oneTo: true,
      toMany: false,
    });
  });
  it("should render properly", () => {
    expect(component).toMatchSnapshot();
  });
});
