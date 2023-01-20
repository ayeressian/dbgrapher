import { describe, expect, it } from "vitest";
import Zoom from "./zoom";

describe("when calling zoom", () => {
  it("returns correct result", () => {
    const result = new Zoom(
      0.2,
      { x: 20, y: 20 },
      1,
      { width: 800, height: 600 },
      { x: 100, y: 100 }
    ).call();
    expect(result).to.toStrictEqual({
      pos: {
        x: 96,
        y: 96,
      },
      zoom: 1.2,
    });
  });
});
