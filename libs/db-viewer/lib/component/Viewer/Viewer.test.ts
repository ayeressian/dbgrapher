import { fireEvent, render, type RenderResult } from "@testing-library/svelte";
import Viewer from "./Viewer.svelte";
import school from "../../../src/school";
import { beforeEach, describe, expect, it, SpyInstance, vi } from "vitest";
import { Store } from "../../store/store";
import * as zoomImport from "../../zoom";
import { Point } from "../DBViewer/DBViewer";
import { RectSize } from "lib/store/schema";

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
  store.view.viewSize.set({
    width: 800,
    height: 1000,
  });
  return store;
}

describe(Viewer.name, () => {
  let component: RenderResult<Viewer>;

  const viewWidth = 800,
    viewHeight = 1000;

  global.ResizeObserver = vi.fn().mockImplementation((func) => {
    return {
      observe: () => {
        func([
          { borderBoxSize: [{ inlineSize: viewWidth, blockSize: viewHeight }] },
        ]);
      },
    };
  });

  Object.defineProperty(global.SVGSVGElement.prototype, "createSVGPoint", {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      x: 0,
      y: 0,
      matrixTransform: vi.fn().mockImplementation(() => ({
        x: 0,
        y: 0,
      })),
    })),
  });

  beforeEach(async () => {
    const context = new Map();
    context.set("store", getStore());

    component = render(Viewer, {
      props: {
        eventDispatcher: {
          onZoom: vi.fn(),
        },
      },
      context,
    });
  });

  it("should render properly", () => {
    expect(component).toMatchSnapshot();
  });

  describe("scroll view", () => {
    let svgElem: SVGElement;
    const deltaX = 100,
      deltaY = 200;
    beforeEach(() => {
      svgElem = document.querySelector("svg") as SVGElement;
      fireEvent.wheel(svgElem, { deltaX, deltaY });
    });
    it("viewport should change", () => {
      expect(svgElem.getAttribute("viewBox")).toEqual(
        `${deltaX} ${deltaY} ${viewWidth} ${viewHeight}`
      );
    });
  });

  describe("zoom view", () => {
    let svgElem: SVGElement;
    const clientX = 300,
      clientY = 400,
      deltaY = -2;

    let ZoomClass: SpyInstance<
      [
        amount: number,
        target: Point,
        oldZoom: number,
        viewSize: RectSize,
        viewPos: Point
      ],
      zoomImport.default
    >;

    beforeEach(async () => {
      Object.defineProperty(
        global.SVGGraphicsElement.prototype,
        "getScreenCTM",
        {
          writable: true,
          value: vi.fn().mockReturnValue({
            inverse: vi.fn(),
          }),
        }
      );

      Object.defineProperty(global.SVGSVGElement.prototype, "createSVGPoint", {
        writable: true,
        value: vi.fn().mockImplementation(() => ({
          x: clientX,
          y: clientY,
          matrixTransform: vi.fn().mockImplementation(() => ({
            x: clientX,
            y: clientY,
          })),
        })),
      });
      const OriginalZoom = zoomImport.default;

      ZoomClass = vi.spyOn(zoomImport, "default");
      ZoomClass.mockImplementation(
        (
          amount: number,
          target: Point,
          oldZoom: number,
          viewSize: RectSize,
          viewPos: Point
        ) => {
          return new OriginalZoom(amount, target, oldZoom, viewSize, viewPos);
        }
      );

      svgElem = document.querySelector("svg") as SVGElement;
      await fireEvent.wheel(svgElem, {
        clientX,
        clientY,
        deltaY,
        ctrlKey: true,
      });
    });

    it("zoom should be called", async () => {
      expect(ZoomClass).toHaveBeenCalledWith(
        -0.02,
        { x: clientX, y: clientY },
        1,
        { width: 800, height: 1000 },
        { x: 100, y: 200 }
      );
    });
  });
});
