import type Point from "lib/point";
import { get, type Writable } from "svelte/store";

class Pan {
  private prevMouseCordX!: number;
  private prevMouseCordY!: number;

  constructor(
    private viewPosStore: Writable<Point>,
    private zoomStore: Writable<number>,
    private onPanStart?: () => void,
    private onPanEnd?: () => void
  ) {}

  private noneTableAndMinmapEvent(event: Event): boolean {
    return !event.composedPath().some((item) => {
      const htmlElement = item as HTMLElement;
      return (
        htmlElement.classList?.contains("minimap") ||
        htmlElement.tagName === "TABLE"
      );
    });
  }

  private onMouseMove = (event: MouseEvent) => {
    event.preventDefault();
    if (this.noneTableAndMinmapEvent(event)) {
      const deltaX = event.clientX - this.prevMouseCordX;
      const deltaY = event.clientY - this.prevMouseCordY;
      this.prevMouseCordY = event.clientY;
      this.prevMouseCordX = event.clientX;
      const zoom = get(this.zoomStore);
      this.viewPosStore.update((point: Point) => {
        point.x -= deltaX * zoom;
        point.y -= deltaY * zoom;
        return point;
      });
    }
  };

  onMousedown = (event: MouseEvent) => {
    if (event.button === 0 && this.noneTableAndMinmapEvent(event)) {
      this.onPanStart && this.onPanStart();
      this.prevMouseCordX = event.clientX;
      this.prevMouseCordY = event.clientY;
      (event.target as SVGSVGElement).addEventListener(
        "mousemove",
        this.onMouseMove
      );
    }
  };

  onMouseup = (event: MouseEvent) => {
    this.onPanEnd && this.onPanEnd();
    (event.target as SVGSVGElement).removeEventListener(
      "mousemove",
      this.onMouseMove
    );
  };
}

export default Pan;
