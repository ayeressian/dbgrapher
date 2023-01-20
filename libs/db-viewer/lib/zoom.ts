import type Point from "lib/point";
import type { RectSize } from "lib/store/schema";

const MAXIMUM_ZOOM = 0.4;
const MINIMUM_ZOOM = 4;

class Zoom {
  constructor(
    private amount: number,
    private target: Point,
    private oldZoom: number,
    private viewSize: RectSize,
    private viewPos: Point
  ) {}

  private zoom() {
    let newZoom = this.oldZoom + this.amount;
    newZoom = Math.max(newZoom, MAXIMUM_ZOOM);
    newZoom = Math.min(newZoom, MINIMUM_ZOOM);

    return newZoom;
  }

  private viewPosAfterZoom(newZoom: number) {
    const newWidth = this.viewSize.width * newZoom;
    const oldWidth = this.viewSize.width * this.oldZoom;

    const newHeight = this.viewSize.height * newZoom;
    const oldHeight = this.viewSize.height * this.oldZoom;

    const widthDelta = oldWidth - newWidth;
    const heightDelta = oldHeight - newHeight;

    return {
      x: this.viewPos.x + (widthDelta * this.target.x) / this.viewSize.width,
      y: this.viewPos.y + (heightDelta * this.target.y) / this.viewSize.height,
    };
  }

  call() {
    const newZoom = this.zoom();
    const pos = this.viewPosAfterZoom(newZoom);
    return {
      zoom: newZoom,
      pos,
    };
  }
}

export default Zoom;
