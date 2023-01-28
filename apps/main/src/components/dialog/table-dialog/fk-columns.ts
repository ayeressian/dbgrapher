import { TemplateResult, html, CSSResultGroup, css } from "lit";
import {
  styles as commonStyles,
  removeColumn,
  moveUpColumn,
  moveDownColumn,
} from "./common-columns";
import { OnSelectEvent } from "../../select";
import { ColumnFkSchema, ColumnSchema, Schema } from "db-viewer";
import produce from "immer";
import { DBGElement } from "../../dbg-element";
import Select from "../../select";
import { validateColumnNamesFromFk } from "./column-name-validation";
import { classMap } from "lit/directives/class-map.js";
import { customElement, property } from "lit/decorators.js";

export interface FkColumnChangeEventDetail {
  column: ColumnFkSchema;
  index: number;
  prevName: string;
}

const isColumnFk = (column: ColumnSchema): column is ColumnFkSchema => {
  return (column as ColumnFkSchema).fk !== undefined;
};

@customElement("dbg-table-dialog-fk-columns")
export default class TableDialogFkColumns extends DBGElement {
  @property({ type: Object }) schema!: Schema;
  @property({ type: Number }) tableIndex!: number;

  #form!: HTMLFormElement;

  static get styles(): CSSResultGroup {
    return css`
      table {
        width: 870px;
      }
      ${commonStyles}
    `;
  }

  #onColumnChange = (
    index: number,
    column: ColumnFkSchema,
    prevName: string
  ): void => {
    const detail: FkColumnChangeEventDetail = {
      column,
      index,
      prevName,
    };
    const event = new CustomEvent("dbg-fk-column-change", { detail });
    this.dispatchEvent(event);
  };

  #renderColumn = (
    column: ColumnFkSchema,
    index: number,
    fkIndex: number,
    fkColumnsSize: number
  ): TemplateResult => {
    const currentTableName =
      this.schema.tables[this.tableIndex].columns[index].name;
    const onColumnChange =
      (type: keyof Omit<ColumnFkSchema, "fk">) =>
      (event: InputEvent): void => {
        const newColumn = produce(column, (columnDraft) => {
          const element = event.target as HTMLInputElement;
          switch (type) {
            case "nn":
            case "uq":
            case "pk":
              columnDraft[type] = element.checked;
              break;
            case "name":
              columnDraft[type] = element.value;
              break;
          }
        });
        this.#onColumnChange(index, newColumn, currentTableName);
      };
    const onFkTableSelect = (event: OnSelectEvent): void => {
      const newColumn = produce(column, (columnDraft) => {
        columnDraft.fk.table = event.detail.value;
        columnDraft.fk.column =
          this.#getFkColumns(columnDraft.fk.table)[0]?.name ?? "";
      });
      this.#onColumnChange(index, newColumn, currentTableName);
    };
    const onFkColumnSelect = (event: OnSelectEvent): void => {
      const newColumn = produce(column, (columnDraft) => {
        columnDraft.fk.column = event.detail.value;
        columnDraft.fk.table = (
          this.getShadowRoot().querySelector(
            `#table-select-${index}`
          ) as HTMLInputElement
        ).value;
      });
      this.#onColumnChange(index, newColumn, currentTableName);
    };
    return html`
      <tr>
        <td>
          <input
            class="column-name"
            @input="${onColumnChange("name")}"
            .value="${column.name}"
            required
          />
        </td>
        <td>
          <input
            type="checkbox"
            @change="${onColumnChange("pk")}"
            .checked="${!!column.pk}"
          />
        </td>
        <td>
          <input
            type="checkbox"
            @change="${onColumnChange("uq")}"
            .checked="${!!column.uq}"
          />
        </td>
        <td>
          <input
            type="checkbox"
            @change="${onColumnChange("nn")}"
            .checked="${!!column.nn}"
          />
        </td>
        <td>
          <dbg-select
            required
            id="table-select-${index}"
            value="${column.fk?.table ?? ""}"
            .options="${this.schema?.tables.map(({ name }) => name)}"
            @dbg-on-select="${onFkTableSelect}"
          ></dbg-select>
        </td>
        <td>
          <dbg-select
            required
            value="${column.fk?.column ?? ""}"
            .options="${this.#getFkColumns(column.fk.table).map(
              ({ name }) => name
            )}"
            @dbg-on-select="${onFkColumnSelect}"
          ></dbg-select>
        </td>
        <td>
          <div
            class="remove-icon"
            @click="${(): void => removeColumn.bind(this)(index)}"
            title="Remove row"
          ></div>
        </td>
        <td>
          <div
            class="move-up-icon ${classMap({ disabled: fkIndex === 0 })}"
            @click="${(): void => moveUpColumn.bind(this)(index, fkIndex)}"
            title="Move row up"
          ></div>
        </td>
        <td>
          <div
            class="move-down-icon ${classMap({
              disabled: fkIndex === fkColumnsSize - 1,
            })}"
            @click="${(): void =>
              moveDownColumn.bind(this)(index, fkIndex, fkColumnsSize)}"
            title="Move row down"
          ></div>
        </td>
      </tr>
    `;
  };

  #getCurrentTableFkColumns = (): {
    column: ColumnFkSchema;
    index: number;
  }[] => {
    const currentTable = this.schema?.tables?.[this.tableIndex];
    const result = currentTable?.columns
      .map((column, index) => ({ column, index }))
      .filter(({ column }) => isColumnFk(column));

    return result as {
      column: ColumnFkSchema;
      index: number;
    }[];
  };

  #renderColumns = (): TemplateResult => {
    const currentTableColumns = this.#getCurrentTableFkColumns();
    let result;
    if (currentTableColumns.length > 0) {
      result = html`${currentTableColumns.map(({ column, index }, fkIndex) =>
        this.#renderColumn(column, index, fkIndex, currentTableColumns.length)
      )}`;
    } else {
      result = html`<tr>
        <td class="no-column" colspan="9">No fk columns to show</td>
      </tr>`;
    }
    return result;
  };

  firstUpdated(): void {
    this.#form = this.getShadowRoot().querySelector("form") as HTMLFormElement;
  }

  validateColumnNames = (): void => {
    validateColumnNamesFromFk(
      this.getShadowRoot(),
      this.schema,
      this.tableIndex
    );
  };

  reportValidity(): boolean {
    const selects = [
      ...this.getShadowRoot().querySelectorAll("dbg-select"),
    ] as Select[];
    const validSelects = selects.reduce((acc, item) => {
      if (!item.reportValidity()) return false;
      return acc;
    }, true);
    return this.#form.reportValidity() && validSelects;
  }

  render(): TemplateResult {
    return html` <div class="container">
      <form class="pure-form">
        <div class="title">Foreign Key Columns</div>
        <div class="table-container">
          <table class="pure-table pure-table-horizontal">
            <thead>
              <tr>
                <th>Name</th>
                <th title="Primary key">PK</th>
                <th title="Unique">UQ</th>
                <th title="Not null">NN</th>
                <th>Foreign Table</th>
                <th>Foreign Column</th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${this.#renderColumns()}
            </tbody>
          </table>
        </div>
        <button class="pure-button add-column" @click="${this.#addColumn}">
          Add foreign key
        </button>
      </form>
    </div>`;
  }

  #focusOnNewlyAddedColumn = async () => {
    await this.updateComplete;
    await this.updateComplete;
    const lastNameInput = this.getShadowRoot().querySelector(
      "tbody tr:last-child td:first-child input"
    ) as HTMLInputElement;
    lastNameInput.focus();
  };

  #addColumn = async (event: Event): Promise<void> => {
    event.preventDefault();
    const newEvent = new CustomEvent("dbg-add-fk-column");
    this.dispatchEvent(newEvent);

    await this.#focusOnNewlyAddedColumn();
  };

  #getFkColumns = (tableName: string): ColumnFkSchema[] => {
    const table =
      this.schema?.tables.find((table) => table.name === tableName) ??
      this.schema?.tables[this.tableIndex];
    const result = (table?.columns.filter((column) => {
      const { pk, uq, nn } = column;
      return pk || (nn && uq);
    }) ?? []) as ColumnFkSchema[];
    return result;
  };
}
