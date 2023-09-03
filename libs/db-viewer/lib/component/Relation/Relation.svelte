<script lang="ts">
  import { rotateCord, segmentAngleRadRelativeToXAxis } from "../../math-util";
  import type Point from "../../point";

  import { manyEnd, oneEnd, oneStart, zeroStart } from "./relation-util";
  import IntersectionCalculation from "./intersection-calculator";
  import { getContext } from "svelte";
  import type { Store } from "../../store/store";
  import type { RelationData } from "../DBViewer/event";
  import type { RectSize } from "../../store/schema";

  export let fromTable: string;
  export let toTable: string;
  export let fromColumn: string;
  export let toColumn: string;
  export let oneTo: boolean;
  export let toMany: boolean;
  export let key: string;

  type EventCallback = (tableData: RelationData) => void;

  export let click: EventCallback;
  export let dblClick: EventCallback;
  export let contextMenu: EventCallback;

  const DISTANCE_BETWEEN_ADJASENT_RELATIONS = 20;

  const store = getContext<Store>("store");

  const fromTablePos = store.table.getTablePos(fromTable);
  const toTablePos = store.table.getTablePos(toTable);
  const fromTableSize = store.table.getTableSize(fromTable);
  const toTableSize = store.table.getTableSize(toTable);

  const adjacentRelations = store.relation.getRelations(fromTable, toTable);
  const adjacentOposRelations = store.relation.getRelations(toTable, fromTable);

  const indexFromAdjacent = adjacentRelations
    .sort((relation1, relation2) => relation1.key.localeCompare(relation2.key))
    .findIndex((relation) => relation.key === key);

  const totalRelationLength =
    adjacentRelations.length + adjacentOposRelations.length;

  const multipleSegmentLength =
    (totalRelationLength - 1) * DISTANCE_BETWEEN_ADJASENT_RELATIONS;

  let start: Point | null, end: Point | null;

  let startD = "";
  let endD = "";

  const drawStart = (angle: number, start: Point) => {
    startD = oneTo ? oneStart(angle, start) : zeroStart(angle, start);
  };

  const drawEnd = (angle: number, end: Point) => {
    endD = toMany ? manyEnd(angle, end) : oneEnd(angle, end);
  };

  const multipleSegmentPoints = (
    angle: number,
    fromTablePos: Point,
    toTablePos: Point
  ) => {
    const multipleSegmentAngle = angle + Math.PI / 2;
    let multipleSegmentPoint1Start = {
      x: fromTablePos.x - multipleSegmentLength / 2,
      y: fromTablePos.y,
    };
    let multipleSegmentPoint1End = {
      x: fromTablePos.x + multipleSegmentLength / 2,
      y: fromTablePos.y,
    };

    multipleSegmentPoint1Start = rotateCord(
      multipleSegmentPoint1Start,
      multipleSegmentAngle,
      fromTablePos
    );
    multipleSegmentPoint1End = rotateCord(
      multipleSegmentPoint1End,
      multipleSegmentAngle,
      fromTablePos
    );

    let multipleSegmentPoint2Start = {
      x: toTablePos.x - multipleSegmentLength / 2,
      y: toTablePos.y,
    };
    let multipleSegmentPoint2End = {
      x: toTablePos.x + multipleSegmentLength / 2,
      y: toTablePos.y,
    };

    multipleSegmentPoint2Start = rotateCord(
      multipleSegmentPoint2Start,
      multipleSegmentAngle,
      toTablePos
    );
    multipleSegmentPoint2End = rotateCord(
      multipleSegmentPoint2End,
      multipleSegmentAngle,
      toTablePos
    );

    return {
      multipleSegmentPoint1Start,
      multipleSegmentPoint1End,
      multipleSegmentPoint2Start,
      multipleSegmentPoint2End,
    };
  };

  const getMultiLineStart = (
    angle: number,
    fromTablePos: Point,
    toTablePos: Point
  ) => {
    const {
      multipleSegmentPoint1Start,
      multipleSegmentPoint1End,
      multipleSegmentPoint2Start,
      multipleSegmentPoint2End,
    } = multipleSegmentPoints(angle, fromTablePos, toTablePos);

    const deltaX = multipleSegmentPoint1End.x - multipleSegmentPoint1Start.x;
    const deltaY = multipleSegmentPoint1End.y - multipleSegmentPoint1Start.y;
    const lineStart = {
      x:
        multipleSegmentPoint1Start.x +
        (deltaX / (totalRelationLength - 1)) * indexFromAdjacent,
      y:
        multipleSegmentPoint1Start.y +
        (deltaY / (totalRelationLength - 1)) * indexFromAdjacent,
    };

    const deltaEndX = multipleSegmentPoint2End.x - multipleSegmentPoint2Start.x;
    const deltaEndY = multipleSegmentPoint2End.y - multipleSegmentPoint2Start.y;
    const lineEnd = {
      x:
        multipleSegmentPoint2Start.x +
        (deltaEndX / (totalRelationLength - 1)) * indexFromAdjacent,
      y:
        multipleSegmentPoint2Start.y +
        (deltaEndY / (totalRelationLength - 1)) * indexFromAdjacent,
    };

    return { lineStart, lineEnd };
  };

  const setStartAndEnd = (
    fromTableSize?: RectSize,
    toTableSize?: RectSize,
    fromTablePos?: Point,
    toTablePos?: Point
  ) => {
    if (
      fromTableSize?.height &&
      toTableSize?.height &&
      fromTableSize?.width &&
      toTableSize?.width &&
      fromTablePos &&
      toTablePos &&
      toTable !== fromTable
    ) {
      const angle = segmentAngleRadRelativeToXAxis(fromTablePos, toTablePos);
      let lineStart: Point;
      let lineEnd: Point;
      if (totalRelationLength === 1) {
        lineStart = fromTablePos;
        lineEnd = toTablePos;
      } else {
        ({ lineStart, lineEnd } = getMultiLineStart(
          angle,
          fromTablePos,
          toTablePos
        ));
      }

      start = new IntersectionCalculation(
        fromTablePos,
        fromTableSize,
        lineStart,
        lineEnd
      ).call();

      end = new IntersectionCalculation(
        toTablePos,
        toTableSize,
        lineStart,
        lineEnd
      ).call();

      if (start) {
        drawStart(angle, start);
      }
      if (end) {
        drawEnd(angle, end);
      }
    }
  };

  $: {
    setStartAndEnd($fromTableSize, $toTableSize, $fromTablePos, $toTablePos);
  }

  const onMouseEnter = () => {
    store.table.setTableFromHighlight(fromTable, fromColumn);
    store.table.setTableToHighlight(toTable, toColumn);
  };

  const onMouseLeave = () => {
    store.table.setTableFromHighlight(fromTable, "");
    store.table.setTableToHighlight(toTable, "");
  };

  const toHighlight = store.table.getTableFromHighlight(fromTable);

  const getRelationData = () => ({
    fromTable,
    toTable,
    fromColumn,
    toColumn,
  });

  const dblClickInternal = () => dblClick(getRelationData());
  const clickInternal = () => click(getRelationData());
  const contextMenuInternal = () => contextMenu(getRelationData());
</script>

<style>
  path {
    stroke-width: 1;
    stroke: var(--relation-color, #666);
    fill: none;
  }

  .highlight {
    stroke-width: 12;
    stroke: transparent;
  }

  .highlight-path {
    stroke-width: 2;
    stroke: var(--relation-color-highlight, black);
  }
</style>

{#if start != null && end != null}
  <path
    d="M {start.x} {start.y} L {end.x} {end.y} {startD} {endD}"
    class:highlight-path={$toHighlight === fromColumn}
  />
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <path
    on:dblclick={dblClickInternal}
    on:click={clickInternal}
    on:contextmenu={contextMenuInternal}
    on:mouseenter={onMouseEnter}
    on:mouseleave={onMouseLeave}
    d="M {start.x} {start.y} L {end.x} {end.y} {startD} {endD}"
    class="highlight"
  />
{/if}
