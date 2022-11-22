import type { RectSize } from "../../store/schema";
import { segmentIntersection } from "../../math-util";
import type Point from "../../point";

export default class IntersectionCalculation {
  private halfWidth: number;
  private halfHight: number;

  constructor(
    private tablePos: Point,
    tableSize: RectSize,
    private point1: Point,
    private point2: Point
  ) {
    this.halfWidth = tableSize.width / 2;
    this.halfHight = tableSize.height / 2;
  }

  call() {
    return (
      this.intersectFromTop() ||
      this.intersectFromBottom() ||
      this.intersectFromLeft() ||
      this.intersectFromRight()
    );
  }

  private intersectFromRight() {
    return segmentIntersection(
      {
        x: this.tablePos.x - this.halfWidth,
        y: this.tablePos.y - this.halfHight,
      },
      {
        x: this.tablePos.x - this.halfWidth,
        y: this.tablePos.y + this.halfHight,
      },
      this.point1,
      this.point2
    );
  }

  private intersectFromLeft() {
    return segmentIntersection(
      {
        x: this.tablePos.x + this.halfWidth,
        y: this.tablePos.y - this.halfHight,
      },
      {
        x: this.tablePos.x + this.halfWidth,
        y: this.tablePos.y + this.halfHight,
      },
      this.point1,
      this.point2
    );
  }

  private intersectFromBottom() {
    return segmentIntersection(
      {
        x: this.tablePos.x - this.halfWidth,
        y: this.tablePos.y + this.halfHight,
      },
      {
        x: this.tablePos.x + this.halfWidth,
        y: this.tablePos.y + this.halfHight,
      },
      this.point1,
      this.point2
    );
  }

  private intersectFromTop() {
    return segmentIntersection(
      {
        x: this.tablePos.x - this.halfWidth,
        y: this.tablePos.y - this.halfHight,
      },
      {
        x: this.tablePos.x + this.halfWidth,
        y: this.tablePos.y - this.halfHight,
      },
      this.point1,
      this.point2
    );
  }
}
