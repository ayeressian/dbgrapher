import { rotateCord } from "../../math-util";
import type Point from "../../point";

export const RELATION_PADDING = 10;

export const oneEnd = (angle: number, end: Point): string => {
  const lineStart = rotateCord(
    {
      x: -RELATION_PADDING + end.x,
      y: -RELATION_PADDING / 2 + end.y,
    },
    angle,
    end
  );

  const lineEnd = rotateCord(
    {
      x: -RELATION_PADDING + end.x,
      y: RELATION_PADDING / 2 + end.y,
    },
    angle,
    end
  );

  return `M ${lineStart.x} ${lineStart.y} L ${lineEnd.x} ${lineEnd.y}`;
};

export const manyEnd = (angle: number, end: Point): string => {
  const lineStart = rotateCord(
    {
      x: -RELATION_PADDING + end.x,
      y: end.y,
    },
    angle,
    end
  );

  const firstLineEnd = rotateCord(
    {
      x: end.x,
      y: RELATION_PADDING / 2 + end.y,
    },
    angle,
    end
  );

  const secondLineEnd = rotateCord(
    {
      x: end.x,
      y: -RELATION_PADDING / 2 + end.y,
    },
    angle,
    end
  );

  return `M ${lineStart.x} ${lineStart.y} L ${firstLineEnd.x} ${firstLineEnd.y} M ${lineStart.x} ${lineStart.y} L ${secondLineEnd.x} ${secondLineEnd.y}`;
};

export const oneStart = (angle: number, start: Point): string => {
  const lineStart = rotateCord(
    {
      x: RELATION_PADDING + start.x,
      y: -RELATION_PADDING / 2 + start.y,
    },
    angle,
    start
  );

  const lineEnd = rotateCord(
    {
      x: RELATION_PADDING + start.x,
      y: RELATION_PADDING / 2 + start.y,
    },
    angle,
    start
  );

  return `M ${lineStart.x} ${lineStart.y} L ${lineEnd.x} ${lineEnd.y}`;
};

export const zeroStart = (angle: number, start: Point): string => {
  const circleCord = rotateCord(
    {
      x: RELATION_PADDING + start.x,
      y: start.y,
    },
    angle,
    start
  );

  const newStart = rotateCord(
    {
      x: RELATION_PADDING * 2,
      y: 0,
    },
    angle
  );

  start.x = newStart.x + start.x;
  start.y = newStart.y + start.y;

  return (
    `M ${circleCord.x - RELATION_PADDING} ${circleCord.y}` +
    ` a 1,1 0 1,0 ${RELATION_PADDING * 2},0 a 1,1 0 1,0 ${
      -RELATION_PADDING * 2
    },0`
  );
};
