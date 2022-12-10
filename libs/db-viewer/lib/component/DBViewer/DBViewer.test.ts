import { fireEvent, render, type RenderResult } from "@testing-library/svelte";
import DBViewer from "./DBViewer.wc.svelte";
import school from "../../../src/school";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Store } from "lib/store/store";

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

describe(DBViewer.name, () => {
  let component: RenderResult<DBViewer>;

  const viewWidth = 800,
    viewHeight = 1000;

  global.ResizeObserver = vi.fn().mockImplementation((func) => {
    func([{ contentRect: { width: viewWidth, height: viewHeight } }]);
    return {
      observe: vi.fn(),
    };
  });

  vi.mock("../../wc-style-applier", () => {
    return {
      default: vi.fn(),
    };
  });

  beforeEach(async () => {
    const context = new Map();
    context.set("store", getStore());

    component = render(DBViewer, {
      //ignore the error, incorrect lib typing
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
    const clientX = 100,
      clientY = 200,
      deltaY = -20,
      cameraXResult = (clientX - (viewWidth * 0.3) / 2) * 0.2,
      cameraYResult = (clientY - (viewHeight * 0.3) / 2) * 0.2,
      viewWidthResult = viewWidth * 0.8,
      viewHeightResult = viewHeight * 0.8;

    beforeEach(() => {
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

      global.DOMPointReadOnly = class {
        x = clientX;
        y = clientY;
        matrixTransform() {
          return {
            x: this.x,
            y: this.y,
          };
        }
      } as any;

      svgElem = document.querySelector("svg") as SVGElement;
      fireEvent.wheel(svgElem, { clientX, clientY, deltaY, ctrlKey: true });
    });

    const viewBoxExpectation = (
      cameraXExpect: number,
      cameraYExpect: number,
      viewWidthExpect: number,
      viewHeightExpect: number
    ) => {
      const [cameraX, cameraY, viewWidthAfterZoom, viewHeightAfterZoom] = (
        svgElem.getAttribute("viewBox") as string
      )
        .split(" ")
        .map((item) => Number(item));
      expect(cameraX).toBeCloseTo(cameraXExpect);
      expect(cameraY).toBeCloseTo(cameraYExpect);
      expect(viewWidthAfterZoom).toBeCloseTo(viewWidthExpect, 5);
      expect(viewHeightAfterZoom).toBeCloseTo(viewHeightExpect, 5);
    };

    it("viewport should change properly", async () => {
      viewBoxExpectation(
        cameraXResult,
        cameraYResult,
        viewWidthResult,
        viewHeightResult
      );
    });

    describe.skip("zoom view second time", () => {
      const secondClientX = 200,
        secondClientY = 300,
        secondDeltaY = -10;

      beforeEach(() => {
        fireEvent.wheel(svgElem, {
          secondClientX,
          secondClientY,
          secondDeltaY,
          ctrlKey: true,
        });
      });

      it("viewport should change properly", async () => {
        viewBoxExpectation(
          cameraXResult + secondClientX * 0.1,
          cameraYResult + secondClientY * 0.1,
          viewWidth * 0.7,
          viewHeight * 0.7
        );
      });
    });
  });
});
