import {
  customElement,
  LitElement,
  TemplateResult,
  html,
  property,
  CSSResult,
  css,
} from "lit-element";
import {
  styles as commonStyles,
  removeColumn,
  moveUpColumn,
  moveDownColumn,
} from "./common-columns";
import { OnSelectEvent } from "../select";
import { ColumnFkSchema, ColumnSchema } from "db-viewer-component";
import { Schema } from "db-viewer-component";
import columnNameValidation from "./column-name-validation";
import produce from "immer";

export interface FkColumnChangeEventDetail {
  column: ColumnFkSchema;
  index: number;
  prevName: string;
}

@customElement("dbg-table-dialog-fk-columns")
export default class TableDialogFkColumns extends LitElement {
  @property({ type: Object }) schema!: Schema;
  @property({ type: Number }) tableIndex!: number;

  #form?: HTMLFormElement;

  static get styles(): CSSResult {
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

  #renderColumn = (column: ColumnFkSchema, index: number): TemplateResult => {
    const currentTableName = this.schema.tables[this.tableIndex].columns[index]
      .name;
    const onColumnChange = (type: keyof Omit<ColumnFkSchema, "fk">) => (
      event: InputEvent
    ): void => {
      const newColumn = produce(column, (columnDraft) => {
        const element = event.target as HTMLInputElement;
        switch (type) {
          case "nn":
          case "uq":
          case "pk":
            columnDraft[type] = element.checked;
            break;
          case "name":
            columnNameValidation(this.schema, this.tableIndex, element, index);
            columnDraft[type] = element.value;
            break;
        }
      });
      this.#onColumnChange(index, newColumn, currentTableName);
    };
    const onFkTableSelect = (event: OnSelectEvent): void => {
      const newColumn = produce(column, (columnDraft) => {
        columnDraft.fk!.table = event.detail.value;
        columnDraft.fk!.column =
          this.#getFkColumns(columnDraft.fk!.table)[0]?.name ?? "";
      });
      this.#onColumnChange(index, newColumn, currentTableName);
    };
    const onFkColumnSelect = (event: OnSelectEvent): void => {
      const newColumn = produce(column, (columnDraft) => {
        columnDraft.fk!.column = event.detail.value;
        columnDraft.fk!.table = (this.shadowRoot!.querySelector(
          `#table-select-${index}`
        ) as HTMLInputElement).value;
      });
      this.#onColumnChange(index, newColumn, currentTableName);
    };
    return html`
      <tr>
        <td>
          <input
            @input="${onColumnChange("name")}"
            .value="${column.name}"
            required
          />
        </td>
        <td>
          <input
            type="checkbox"
            @change="${onColumnChange("pk")}"
            .checked="${column.pk}"
          />
        </td>
        <td>
          <input
            type="checkbox"
            @change="${onColumnChange("uq")}"
            .checked="${column.uq}"
          />
        </td>
        <td>
          <input
            type="checkbox"
            @change="${onColumnChange("nn")}"
            .checked="${column.nn}"
          />
        </td>
        <td>
          <dbg-select
            id="table-select-${index}"
            value="${column.fk?.table}"
            options="${JSON.stringify(
              this.schema?.tables.map(({ name }) => name)
            )}"
            @dbg-on-select="${onFkTableSelect}"
          ></dbg-select>
        </td>
        <td>
          <dbg-select
            value="${column.fk?.column}"
            options="${JSON.stringify(
              this.#getFkColumns(column.fk!.table).map(({ name }) => name)
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
            class="move-up-icon"
            @click="${(): void => moveUpColumn.bind(this)(index)}"
            title="Move row up"
          ></div>
        </td>
        <td>
          <div
            class="move-down-icon"
            @click="${(): void => moveDownColumn.bind(this)(index)}"
            title="Move row down"
          ></div>
        </td>
      </tr>
    `;
  };

  #getCurrentTableFkColumns = (): { column: ColumnSchema; index: number }[] => {
    const currentTable = this.schema?.tables?.[this.tableIndex];
    return (
      currentTable?.columns
        .map((column, index) => ({ column, index }))
        .filter((item) => (item.column as ColumnFkSchema).fk) ?? []
    );
  };

  #renderColumns = (): TemplateResult => {
    const currentTableColumns = this.#getCurrentTableFkColumns();
    let result;
    if (currentTableColumns.length > 0) {
      result = html`${currentTableColumns.map(({ column, index }) =>
        this.#renderColumn(column, index)
      )}`;
    } else {
      result = html`<tr>
        <td class="no-column" colspan="9">No fk columns to show</td>
      </tr>`;
    }
    return result;
  };

  firstUpdated(): void {
    this.#form = this.shadowRoot!.querySelector("form")!;
  }

  validate(): boolean {
    return this.#form!.reportValidity();
  }

  render(): TemplateResult {
    return html` <div class="container">
      <form class="pure-form">
        <div class="title">
          Foreign Key Columns
        </div>
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
                <th />
                <th />
                <th />
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

  #addColumn = async (event: Event): Promise<void> => {
    event.preventDefault();
    const newEvent = new CustomEvent("dbg-add-fk-column");
    this.dispatchEvent(newEvent);

    //Focus on newly added column name
    await this.updateComplete;
    await this.updateComplete.then(() => {
      const lastNameInput = this.shadowRoot!.querySelector(
        "tbody tr:last-child td:first-child input"
      ) as HTMLInputElement;
      lastNameInput.focus();
    });
  };

  #getFkColumns = (tableName: string): ColumnFkSchema[] => {
    const table =
      this.schema?.tables.find((table) => table.name === tableName) ??
      this.schema?.tables[this.tableIndex];
    return (
      table?.columns.filter((column) => {
        const { pk, uq, nn } = column;
        const { fk } = column as ColumnFkSchema;
        return (pk || (nn && uq)) && fk == null;
      }) || []
    );
  };
}
