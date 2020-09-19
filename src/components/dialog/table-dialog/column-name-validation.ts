import { Schema } from "db-viewer-component";
import { t } from "../../../localization";

export default (
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
