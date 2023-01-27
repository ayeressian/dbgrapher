import { isColumnFk } from "../schema";
import { derived, get, type Readable } from "svelte/store";
import type { Store } from "./store";

type Relation = {
  key: string;
  fromTable: string;
  toTable: string;
  fromColumn: string;
  toColumn: string;
  oneTo: boolean;
  toMany: boolean;
};

export class RelationStore {
  relations?: Readable<Relation[]>;

  constructor(private store: Store) {
    this.relations = derived(store.schema.schema, ($schema) => {
      const relations: Relation[] = [];
      let index = 0;
      $schema.tables.forEach((table) => {
        table.columns.forEach((column) => {
          if (isColumnFk(column)) {
            relations.push({
              key: `${table.name}_${column.name}_${column.fk.table}_${column.fk.column}`,
              toTable: table.name,
              fromTable: column.fk.table,
              toColumn: column.name,
              fromColumn: column.fk.column,
              oneTo: !!column.nn,
              toMany: !column.uq,
            });
            ++index;
          }
        });
      });
      return relations;
    });
  }

  getRelations(fromTable: string, toTable: string) {
    const realtionsVal = get(this.relations!);
    const r = realtionsVal.filter(
      (relation) =>
        relation.fromTable === fromTable && relation.toTable === toTable
    );
    return r;
  }
}
