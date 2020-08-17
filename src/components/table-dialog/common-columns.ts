import { css, unsafeCSS } from "lit-element";
import formsCss from "purecss/build/forms-min.css";
import buttonCss from "purecss/build/buttons-min.css";
import tableCss from "purecss/build/tables-min.css";
import removeSvg from "../../../asset/remove.svg";
import moveUpSvg from "../../../asset/move-up.svg";
import moveDownSvg from "../../../asset/move-down.svg";
import { ColumnSchema } from "db-viewer-component";
import TableDialogColumns from "./columns";
import TableDialogFkColumns from "./fk-columns";

export const styles = css`
  ${unsafeCSS(formsCss)}
  ${unsafeCSS(buttonCss)}
  ${unsafeCSS(tableCss)}

  .add-column {
    margin-top: 10px;
  }

  td.no-column {
    text-align: center;
    color: #AAA;
  }

  .container {
    margin-top: 30px;
  }

  .title {
    margin-bottom: 10px;
  }

  .table-container {
    max-height: 200px;
    overflow-x: hidden;
    overflow-y: auto;
    display: inline-block;
  }

  .table-container table th {
    background-color: #E0E0E0;
    position: sticky;
    top: 0;
  }

  .table-container table {
    border-collapse: collapse;
  }

  .add-column {
    display: block;
  }

  table tbody td:last-child {
    width: 32px;
  }

  .remove-icon {
    width: 32px;
    height: 32px;
    background-image: url(${unsafeCSS(removeSvg)});
    background-size: cover;
  }

  .move-up-icon {
    width: 32px;
    height: 32px;
    background-image: url(${unsafeCSS(moveUpSvg)});
    background-size: cover;
  }

  .move-down-icon {
    width: 32px;
    height: 32px;
    background-image: url(${unsafeCSS(moveDownSvg)});
    background-size: cover;
  }
}`;

export interface ColumnOpsDetail {
  index: number;
}

export type ColumnOpsEvent = CustomEvent<ColumnOpsDetail>;

export interface ColumnChangeEventDetail {
  column: ColumnSchema;
  index: number;
  prevName: string;
}

export type ColumnChangeEvent = CustomEvent<ColumnChangeEventDetail>;

export function removeColumn(
  this: TableDialogColumns | TableDialogFkColumns,
  index: number
): void {
  const detail: ColumnOpsDetail = {
    index,
  };
  const newEvent = new CustomEvent("dbg-remove-column", { detail });
  this.dispatchEvent(newEvent);
}

export function moveUpColumn(
  this: TableDialogColumns | TableDialogFkColumns,
  index: number
): void {
  const detail: ColumnOpsDetail = {
    index,
  };
  const newEvent = new CustomEvent("dbg-move-up-column", { detail });
  this.dispatchEvent(newEvent);
}

export function moveDownColumn(
  this: TableDialogColumns | TableDialogFkColumns,
  index: number
): void {
  const detail: ColumnOpsDetail = {
    index,
  };
  const newEvent = new CustomEvent("dbg-move-down-column", { detail });
  this.dispatchEvent(newEvent);
}
