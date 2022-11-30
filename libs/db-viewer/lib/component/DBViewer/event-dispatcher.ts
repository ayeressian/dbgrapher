import type Point from "lib/point";
import type DbViewer from "./DBViewer";
import {
  RelationClickEvent,
  RelationContextMenuEvent,
  RelationDblClickEvent,
  TableClickEvent,
  TableContextMenuEvent,
  TableDblClickEvent,
  ViewportClickEvent,
  ZoomEvent,
  type RelationData,
  type TableData,
  type ZoomData,
} from "./event";

export default class EventDispatcher {
  constructor(private dbViewer: DbViewer) {}
  onTableClick = (tableData: TableData) => {
    this.dbViewer.dispatchEvent(new TableClickEvent(tableData));
  };

  onTableDblClick = (tableData: TableData) => {
    this.dbViewer.dispatchEvent(new TableDblClickEvent(tableData));
  };

  onTableContextMenu = (tableData: TableData) => {
    this.dbViewer.dispatchEvent(new TableContextMenuEvent(tableData));
  };

  onRelationClick = (realtionData: RelationData) => {
    this.dbViewer.dispatchEvent(new RelationClickEvent(realtionData));
  };

  onRelationDblClick = (realtionData: RelationData) => {
    this.dbViewer.dispatchEvent(new RelationDblClickEvent(realtionData));
  };

  onRelationContextMenu = (realtionData: RelationData) => {
    this.dbViewer.dispatchEvent(new RelationContextMenuEvent(realtionData));
  };

  onViewportClick = (point: Point) => {
    this.dbViewer.dispatchEvent(new ViewportClickEvent(point));
  };

  onZoom = (zoomData: ZoomData) => {
    this.dbViewer.dispatchEvent(new ZoomEvent(zoomData));
  };
}
