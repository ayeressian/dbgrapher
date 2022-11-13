import type { RectSize } from "../../store/schema";
import type Point from "../../point";

export type TableData = {
  name: string;
  pos: Point;
  size: RectSize;
};

export type RelationData = {
  fromTable: string;
  toTable: string;
  fromColumn: string;
  toColumn: string;
};

export type ZoomData = {
  newZoom: number;
  oldZoom: number;
  target: Point;
};

export default TableData;

export class TableClickEvent extends CustomEvent<TableData> {
  constructor(tableData: TableData) {
    super("tableClick", { detail: tableData });
  }
}

export class TableDblClickEvent extends CustomEvent<TableData> {
  constructor(tableData: TableData) {
    super("tableDblClick", { detail: tableData });
  }
}

export class TableContextMenuEvent extends CustomEvent<TableData> {
  constructor(tableData: TableData) {
    super("tableContextMenu", { detail: tableData });
  }
}

export class RelationClickEvent extends CustomEvent<RelationData> {
  constructor(relationData: RelationData) {
    super("relationClick", { detail: relationData });
  }
}

export class RelationDblClickEvent extends CustomEvent<RelationData> {
  constructor(relationData: RelationData) {
    super("relationDblClick", { detail: relationData });
  }
}

export class RelationContextMenuEvent extends CustomEvent<RelationData> {
  constructor(relationData: RelationData) {
    super("relationContextMenu", { detail: relationData });
  }
}

export class ViewportClickEvent extends CustomEvent<Point> {
  constructor(point: Point) {
    super("viewportClick", { detail: point });
  }
}

export class TableMoveEvent extends CustomEvent<TableData> {
  constructor(tableData: TableData) {
    super("tableMove", { detail: tableData });
  }
}

export class TableMoveEndEvent extends CustomEvent<TableData> {
  constructor(tableData: TableData) {
    super("tableMoveEnd", { detail: tableData });
  }
}

export class ZoomEvent extends CustomEvent<ZoomData> {
  constructor(zoomData: ZoomData) {
    super("zoom", {
      detail: zoomData,
    });
  }
}

export interface DbViewerEventMap extends HTMLElementEventMap {
  tableClick: TableClickEvent;
  tableDblClick: TableDblClickEvent;
  tableContextMenu: TableContextMenuEvent;
  relationClick: RelationClickEvent;
  relationDblClick: RelationDblClickEvent;
  relationContextMenu: RelationContextMenuEvent;
  viewportClick: ViewportClickEvent;
  tableMove: TableMoveEvent;
  tableMoveEnd: TableMoveEndEvent;
  zoom: ZoomEvent;
}
