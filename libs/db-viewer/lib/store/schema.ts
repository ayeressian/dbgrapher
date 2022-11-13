import { get, writable } from "svelte/store";
import type { Schema } from "../schema";
import type { Store } from "./store";
import type { Viewport } from "./view";

export type RectSize = {
  width: number;
  height: number;
};

export class SchemaStore {
  private store: Store;
  schema = writable<Schema>({ tables: [] });
  // allTableSizesSetStore: Readable<boolean>;

  constructor(store: Store) {
    this.store = store;
  }

  getSchema(): Schema {
    const schema = get(this.schema);
    this.store.table.updateTablePoses(schema.tables);
    return schema;
  }

  setSchema(schema: Schema, viewport: Viewport = "center") {
    schema = JSON.parse(JSON.stringify(schema));
    this.store?.view.viewportStore.set(viewport);
    const tableStore = this.store.table;
    tableStore.tableSizes.clear();
    tableStore.tablePoses.clear();
    tableStore.tableToHighlight.clear();
    tableStore.tableFromHighlight.clear();
    schema.tables.forEach((table) => {
      const tableSizeWritable = writable<RectSize>();
      tableStore.tableSizes.set(table.name, tableSizeWritable);
      const tablePosWritable = writable(table.pos);
      tableStore.tablePoses.set(table.name, tablePosWritable);
      tablePosWritable.subscribe(this.store.view.getUpdateViewBound());
      tableStore.tableToHighlight.set(table.name, writable(""));
      tableStore.tableFromHighlight.set(table.name, writable(""));
    });
    this.schema.set({ tables: [] });
    setTimeout(() => this.schema.set(schema));

    // allTableSizesSetStore = derived(
    //   [...tableSizes.values()],
    //   (tableSizes) => {
    //     return tableSizes.every((tableSize) => {
    //       return tableSize.height > 0 && tableSize.width > 0;
    //     });
    //   }
    // );
  }
}
