import {
  Schema,
  ColumnFkSchema,
  ColumnNoneFkSchema,
  TableSchema,
} from "db-viewer-component";
import toposort from "toposort";
import ConfirmationDialog from "./components/dialog/confirmation-dialog";

const topoLogicalSortTables = async (
  tables: TableSchema[]
): Promise<TableSchema[] | undefined> => {
  const keyVal: [string, TableSchema][] = tables.map((table) => [
    table.name,
    table,
  ]);
  const tableMap = new Map(keyVal);
  const graph: [string, string][] = [];
  for (const table of tables) {
    for (const column of table.columns) {
      const fkColumn = column as ColumnFkSchema;
      if (fkColumn.fk) {
        graph.push([fkColumn.fk.table, table.name]);
      }
    }
  }
  let result;
  try {
    result = toposort(graph);
  } catch (error) {
    if (
      await ConfirmationDialog.confirm(
        "There is a cyclic relationship chain in your schema. Using generated SQL file with the RDBMS might cause error.",
        "Continue"
      )
    ) {
      return tables;
    } else {
      return;
    }
  }
  return result.map((tableName) => tableMap.get(tableName)!);
};

export default async (schema: Schema): Promise<string | undefined> => {
  let sqlSchema = "";
  const sortedTables = await topoLogicalSortTables(schema.tables);
  if (sortedTables == null) return;
  sortedTables.forEach((table, index) => {
    let columnSql = "";
    table.columns.forEach((column, index) => {
      const fkColumn = column as ColumnFkSchema;
      if (fkColumn.fk != null) {
        const table = schema.tables.find(
          (table) => table.name === fkColumn.fk!.table
        )!;
        const type = (table.columns.find(
          (tableColumn) => tableColumn.name === fkColumn.fk!.column
        ) as ColumnNoneFkSchema).type;
        columnSql += "  " + column.name + " " + type;
      } else {
        columnSql +=
          "  " + column.name + " " + (column as ColumnNoneFkSchema).type;
      }
      if (column.uq === true) {
        columnSql += " UNIQUE";
      }
      if (column.nn === true) {
        columnSql += " NOT NULL";
      }
      if (column.pk === true) {
        columnSql += " PRIMARY KEY";
      }
      if (fkColumn.fk != null) {
        columnSql +=
          " REFERENCES " + fkColumn.fk.table + "(" + fkColumn.fk.column + ")";
      }
      if (index < table.columns.length - 1) {
        columnSql += ",";
      }
      columnSql += "\n";
    });
    sqlSchema += "CREATE TABLE " + table.name + "(\n" + columnSql + ");\n";
    if (index < schema.tables.length - 1) {
      sqlSchema += "\n";
    }
  });

  return sqlSchema;
};
