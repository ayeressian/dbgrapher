import { ColumnFkSchema, Schema } from "db-viewer";
import { t } from "../../../localization";

const columnNameValidation = (
  schema: Schema,
  tableIndex: number,
  element: HTMLInputElement,
  index: number
): void => {
  if (
    schema.tables[tableIndex].columns.find(
      (column, columnIndex) =>
        column.name === element.value && index !== columnIndex
    )
  ) {
    element.setCustomValidity(
      t((l) => l.dialog.table.duplicateNameError, { name: element.value })
    );
  } else {
    element.setCustomValidity("");
  }
};

export const validateColumnNames = (
  shadowRoot: ShadowRoot,
  schema: Schema,
  tableIndex: number,
  fkOffset = 0
): void => {
  (
    [...shadowRoot.querySelectorAll(".column-name")] as HTMLInputElement[]
  ).forEach((element, index) => {
    columnNameValidation(schema, tableIndex, element, fkOffset + index);
  });
};

export const validateColumnNamesFromFk = (
  shadowRoot: ShadowRoot,
  schema: Schema,
  tableIndex: number
): void => {
  const fkOffset = schema.tables[tableIndex].columns.reduce((acc, column) => {
    if ((column as ColumnFkSchema).fk == null) return acc + 1;
    return acc;
  }, 0);
  validateColumnNames(shadowRoot, schema, tableIndex, fkOffset);
};
