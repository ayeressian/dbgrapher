import type Point from "../point";
import type { RectSize } from "./schema";
import type { Viewport } from "./view";

type Args = {
  viewport: Viewport;
  viewSizeAfterZoom: RectSize;
  tablePoses: Point[];
  currentPos: Point;
  viewBoundSize: RectSize;
};

const centerByTablesWeight = ({
  tablePoses,
  viewBoundSize,
}: Pick<Args, "tablePoses" | "viewBoundSize">): Point => {
  const tablePosesLength = [...tablePoses.values()].length;
  const totalSum = tablePoses.reduce(
    (acc, tablePos) => {
      acc.xTotal += tablePos.x;
      acc.yTotal += tablePos.y;
      return acc;
    },
    { xTotal: 0, yTotal: 0 }
  );

  return {
    x: totalSum.xTotal / tablePosesLength - viewBoundSize.width / 2,
    y: totalSum.yTotal / tablePosesLength - viewBoundSize.height / 2,
  };
};

const centerByTables = ({
  tablePoses,
  viewSizeAfterZoom,
}: Pick<Args, "tablePoses" | "viewSizeAfterZoom">): Point => {
  const posXes = tablePoses.map((item) => item.x);
  const posYes = tablePoses.map((item) => item.y);
  const minXPos = Math.min(...posXes);
  const maxXPos = Math.max(...posXes);
  const minYPos = Math.min(...posYes);
  const maxYPos = Math.max(...posYes);

  return {
    x: (minXPos + maxXPos) / 2 - viewSizeAfterZoom.width / 2,
    y: (minYPos + maxYPos) / 2 - viewSizeAfterZoom.height / 2,
  };
};

export const setViewPosByViewport = (args: Args): Point => {
  switch (args.viewport) {
    case "centerByTablesWeight":
      return centerByTablesWeight(args);
    case "centerByTables":
      return centerByTables(args);
    case "center":
      return {
        x: 0,
        y: 0,
      };
    case "noChange":
      return args.currentPos;
  }
};
