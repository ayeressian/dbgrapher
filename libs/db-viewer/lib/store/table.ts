import type Point from "../point";
import { get, type Writable } from "svelte/store";
import type { RectSize } from "./schema";
import type { TableSchema } from "lib/schema";

type TableSize = RectSize;

export class TableStore {
  tableSizes = new Map<string, Writable<TableSize>>();
  tablePoses = new Map<string, Writable<Point>>();
  tableFromHighlight = new Map<string, Writable<string>>();
  tableToHighlight = new Map<string, Writable<string>>();

  getTableSize(tableName: string) {
    return this.tableSizes.get(tableName);
  }
  getTablePos(tableName: string) {
    return this.tablePoses.get(tableName);
  }
  getTableFromHighlight(tableName: string) {
    return this.tableFromHighlight.get(tableName);
  }
  getTableToHighlight(tableName: string) {
    return this.tableToHighlight.get(tableName);
  }
  setTableFromHighlight(tableName: string, column: string) {
    this.tableFromHighlight.get(tableName)?.set(column);
  }
  setTableToHighlight(tableName: string, column: string) {
    this.tableToHighlight.get(tableName)?.set(column);
  }

  updateTablePoses(tableSchemas: TableSchema[]) {
    tableSchemas.forEach((tableSchema) => {
      const pos = this.getTablePos(tableSchema.name) as Writable<Point>;
      tableSchema.pos = get(pos);
    });
  }
}
