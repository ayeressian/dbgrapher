import { TemplateResult, html, CSSResultGroup, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  styles as commonStyles,
  ColumnChangeEventDetail,
  removeColumn,
  moveUpColumn,
  moveDownColumn,
} from "./common-columns";
import {
  ColumnNoneFkSchema,
  ColumnFkSchema,
  Schema,
  ColumnSchema,
} from "db-viewer-component";
import produce from "immer";
import { DBGElement } from "../../dbg-element";
import getDbTypes from "../../../db-types";
import { validateColumnNames } from "./column-name-validation";
import { classMap } from "lit/directives/class-map";

@customElement("dbg-table-dialog-columns")
export default class TableDialogColumns extends DBGElement {
  @property({ type: Object }) schema!: Schema;
  @property({ type: Number }) tableIndex!: number;

  #form!: HTMLFormElement;

  static get styles(): CSSResultGroup {
    return css`
      table {
        width: 760px;
      }
      ${commonStyles}
    `;
  }

  #onColumnChange = (
    index: number,
    column: ColumnNoneFkSchema,
    prevName: string
  ): void => {
    const detail: ColumnChangeEventDetail = {
      column,
      index,
      prevName,
    };
    const event = new CustomEvent("dbg-column-change", { detail });
    this.dispatchEvent(event);
  };

  validateColumnNames = (): void => {
    validateColumnNames(this.shadowRoot!, this.schema, this.tableIndex);
  };

  #renderColumn = (
    column: ColumnNoneFkSchema,
    index: number,
    nonFkIndex: number,
    nonFkColumnsSize: number
  ): TemplateResult => {
    const onColumnChange = (type: keyof ColumnNoneFkSchema) => (
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
            element.dataset.prev;
            columnDraft[type] = element.value;
            break;
          default:
            columnDraft[type] = element.value;
            break;
        }
      });
      const currentTable = this.schema.tables[this.tableIndex];
      this.#onColumnChange(index, newColumn, currentTable.columns[index].name);
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
            list="types"
            @input="${onColumnChange("type")}"
            .value="${column.type}"
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
          <div
            class="remove-icon"
            @click="${(): void => removeColumn.bind(this)(index)}"
            title="Remove row"
          ></div>
        </td>
        <td>
          <div
            class="move-up-icon ${classMap({ disabled: nonFkIndex === 0 })}"
            @click="${(): void => moveUpColumn.bind(this)(index, nonFkIndex)}"
            title="Move row up"
          ></div>
        </td>
        <td>
          <div
            class="move-down-icon ${classMap({
              disabled: nonFkIndex === nonFkColumnsSize - 1,
            })}"
            @click="${(): void =>
              moveDownColumn.bind(this)(index, nonFkIndex, nonFkColumnsSize)}"
            title="Move row down"
          ></div>
        </td>
      </tr>
    `;
  };

  #getCurrentTableColumns = (): { column: ColumnSchema; index: number }[] => {
    const currentTable = this.schema.tables[this.tableIndex];
    return (
      currentTable.columns
        .map((column, index) => ({ column, index }))
        .filter((item) => !(item.column as ColumnFkSchema).fk) ?? []
    );
  };

  #renderColumns = (): TemplateResult => {
    const currentTableColumns = this.#getCurrentTableColumns();
    let result;
    if (currentTableColumns.length > 0) {
      result = html`${currentTableColumns.map(({ column, index }, nonFkIndex) =>
        this.#renderColumn(
          column as ColumnNoneFkSchema,
          index,
          nonFkIndex,
          currentTableColumns.length
        )
      )}`;
    } else {
      result = html`<tr>
        <td class="no-column" colspan="8">No columns to show</td>
      </tr>`;
    }
    return html`${result}`;
  };

  firstUpdated(): void {
    this.#form = this.shadowRoot!.querySelector("form")!;
  }

  reportValidity(): boolean {
    return this.#form.reportValidity();
  }

  #getDbTypeDataList = (): TemplateResult => {
    const dbTypes = getDbTypes();
    return html`<datalist id="types">
      ${dbTypes.map((dbType) => html`<option value=${dbType} />`)}
    </datalist>`;
  };

  render(): TemplateResult {
    return html` <div class="container">
      <form class="pure-form">
        <div class="title">Columns</div>
        ${this.#getDbTypeDataList()}
        <div class="table-container">
          <table class="pure-table pure-table-horizontal">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th title="Primary key">PK</th>
                <th title="Unique">UQ</th>
                <th title="Not null">NN</th>
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
          Add column
        </button>
      </form>
    </div>`;
  }

  #addColumn = async (event: Event): Promise<void> => {
    event.preventDefault();
    const newEvent = new CustomEvent("dbg-add-column");
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
}
