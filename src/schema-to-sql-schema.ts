import { Schema, ColumnFkSchema, ColumnNoneFkSchema } from "db-viewer-component";

export default (schema: Schema): string => {
  let sqlSchema = '';
  schema.tables.forEach((table, index) => {
    let columnSql = '';
    table.columns.forEach((column, index) => {
      if ((column as ColumnFkSchema).fk) {
        const table = schema.tables.find((table) => table.name === (column as ColumnFkSchema)!.fk!.table)!;
        const type = (table.columns.find(tableColumn => tableColumn.name === (column as ColumnFkSchema).fk?.column) as ColumnNoneFkSchema).type;
        columnSql += '  ' + column.name + ' ' + type;
      } else {
        columnSql += '  ' + column.name + ' ' + (column as ColumnNoneFkSchema).type;
      }
      if (column.uq === true) {
        columnSql += ' UNIQUE';
      }
      if (column.nn === true) {
        columnSql += ' NOT NULL';
      }
      if (column.pk === true) {
        columnSql += ' PRIMARY KEY';
      }
      if ((column as ColumnFkSchema).fk != null) {
        columnSql += ' REFERENCES ' + (column as ColumnFkSchema)!.fk!.table + '(' + (column as ColumnFkSchema)!.fk!.column + ')';
      }
      if (index < table.columns.length -1) {
        columnSql += ',';
      }
      columnSql += '\n';
    });
    sqlSchema += 'CREATE TABLE ' + table.name + '(\n' + columnSql + ');\n';
    if (index < schema.tables.length -1) {
      sqlSchema += '\n';
    }
  });

  return sqlSchema;
};
