import type Point from "./point";

export interface FkSchema {
  table: string;
  column: string;
}
export interface ColumnNoneFkSchema {
  name: string;
  type: string;
  pk?: boolean;
  uq?: boolean;
  nn?: boolean;
}

export declare interface ColumnFkSchema
  extends Omit<ColumnNoneFkSchema, "type"> {
  fk: FkSchema;
}

export type ColumnSchema = ColumnFkSchema | ColumnNoneFkSchema;

export interface TableSchema {
  name: string;
  pos: Point;
  columns: ColumnSchema[];
}

export interface AnnotationSchema {
  pos: Point;
  title?: string;
  text?: string;
  color?: string;
  width: number;
  height: number;
}

export interface Schema {
  tables: TableSchema[];
  annotations?: AnnotationSchema[];
  arrangement?: TableArrang;
  viewport?: Viewport;
  viewWidth?: number;
  viewHeight?: number;
}

export const enum Viewport {
  noChange = "noChange",
  centerByTablesWeight = "centerByTablesWeight",
  center = "center",
  centerByTables = "centerByTables",
}

export enum TableArrang {
  spiral = "spiral",
  default = "default",
}

export const isColumnFk = (column: ColumnSchema): column is ColumnFkSchema => {
  return (column as ColumnFkSchema).fk !== undefined;
};
