import {
  ColumnFkSchema,
  ColumnNoneFkSchema,
  TableSchema,
} from "db-viewer-component";
import toposort from "toposort";
import ConfirmationDialog from "./components/dialog/confirmation-dialog";
import { t } from "./localization";
import { union } from "lodash";
import UserCancelGeneration from "./user-cancel-generation";
import DbGrapherSchema, { DbType } from "./db-grapher-schema";

const topoLogicalSortTables = async (
  tables: TableSchema[]
): Promise<TableSchema[]> => {
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
      error instanceof Error &&
      error.message.includes("Cyclic dependency, node was")
    ) {
      if (
        await ConfirmationDialog.confirm(
          t((l) => l.confirmation.cyclicError.text),
          t((l) => l.confirmation.cyclicError.confirm)
        )
      ) {
        return tables;
      }
      throw new UserCancelGeneration();
    } else {
      throw error;
    }
  }
  const tSortResult = result.map((tableName) => tableMap.get(tableName)!);

  // union sort result with original tables to also have the tables that aren't represented in any relations
  return union(tSortResult, tables);
};

const getColumnName = (columnName: string, dBType: DbType): string => {
  switch (dBType) {
    case DbType.Mysql:
      return `\`${columnName}\``;
    case DbType.NotSelected:
      throw new Error("Can't generate column when DbType is NotSelected.");
    default:
      return `"${columnName}"`;
  }
};

export default async (schema: DbGrapherSchema): Promise<string> => {
  let sqlSchema = "";
  const sortedTables = await topoLogicalSortTables(schema.tables);
  sortedTables.forEach((table, index) => {
    let columnSql = "";
    table.columns.forEach((column, index) => {
      const fkColumn = column as ColumnFkSchema;
      const columnName = getColumnName(column.name, schema.dbGrapher.type);
      if (fkColumn.fk != null) {
        const table = schema.tables.find(
          (table) => table.name === fkColumn.fk!.table
        )!;
        const { type } = table.columns.find(
          (tableColumn) => tableColumn.name === fkColumn.fk!.column
        ) as ColumnNoneFkSchema;
        columnSql += `  ${columnName} ${type}`;
      } else {
        columnSql += `  ${columnName} ${(column as ColumnNoneFkSchema).type}`;
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
        const columnName = getColumnName(
          fkColumn.fk.column,
          schema.dbGrapher.type
        );
        columnSql += ` REFERENCES ${fkColumn.fk.table} (${columnName})`;
      }
      if (index < table.columns.length - 1) {
        columnSql += ",";
      }
      columnSql += "\n";
    });
    sqlSchema += `CREATE TABLE ${table.name}(\n${columnSql});\n`;
    if (index < schema.tables.length - 1) {
      sqlSchema += "\n";
    }
  });

  return sqlSchema;
};
