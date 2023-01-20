import { degToRad, to3FixedNumber } from "../../math-util";
import { oneStart, RELATION_PADDING, zeroStart } from "./relation-util";
import { describe, expect, it } from "vitest";

describe("realtion util", () => {
  describe("oneStart", () => {
    it("should return correct svg path string", async () => {
      const result = oneStart(degToRad(90), { x: 0, y: 0 });
      const resultFormat =
        /^M ([+-]?[0-9]+\.?[0-9]*|\.[0-9]+) ([+-]?[0-9]+\.?[0-9]*|\.[0-9]+) L ([+-]?[0-9]+\.?[0-9]*|\.[0-9]+) ([+-]?[0-9]+\.?[0-9]*|\.[0-9]+)$/;
      const match = result.match(resultFormat);
      expect(match).not.toBeNull();
      if (match) {
        expect(to3FixedNumber(Number(match[1]))).toEqual(RELATION_PADDING / 2);
        expect(to3FixedNumber(Number(match[2]))).toEqual(RELATION_PADDING);
        expect(to3FixedNumber(Number(match[3]))).toEqual(-RELATION_PADDING / 2);
        expect(to3FixedNumber(Number(match[4]))).toEqual(RELATION_PADDING);
      }
    });
  });

  describe("zeroStart", () => {
    it("should return correct svg path string", async () => {
      const start = { x: 0, y: 0 };
      const result = zeroStart(degToRad(90), start);
      const resultFormat =
        /^M ([+-]?[0-9]+\.?[0-9]*|\.[0-9]+) ([+-]?[0-9]+\.?[0-9]*|\.[0-9]+) a 1,1 0 1,0 ([+-]?[0-9]+\.?[0-9]*|\.[0-9]+),0 a 1,1 0 1,0 ([+-]?[0-9]+\.?[0-9]*|\.[0-9]+),0$/;
      const match = result.match(resultFormat);
      expect(match).not.toBeNull();
      if (match) {
        expect(to3FixedNumber(Number(match[1]))).toEqual(-RELATION_PADDING);
        expect(to3FixedNumber(Number(match[2]))).toEqual(RELATION_PADDING);
        expect(to3FixedNumber(Number(match[3]))).toEqual(RELATION_PADDING * 2);
        expect(to3FixedNumber(Number(match[4]))).toEqual(-RELATION_PADDING * 2);
      }
    });
    it.skip("should update start point", async () => {
      const start = { x: 0, y: 0 };
      zeroStart(degToRad(90), start);
      expect(start).toEqual({ x: 0, y: RELATION_PADDING / 2 });
    });
  });
});
