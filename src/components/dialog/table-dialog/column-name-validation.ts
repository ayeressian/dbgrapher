import { Schema } from "db-viewer-component";

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
      `There is already a column with the name "${element.value}".`
    );
  } else {
    element.setCustomValidity("");
  }
};
