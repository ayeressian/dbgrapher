import {
  html,
  css,
  CSSResultGroup,
  TemplateResult,
  unsafeCSS,
  PropertyValues,
} from "lit";
import { actions as tableDialogAction } from "../../../store/slices/dialog/table-dialog";
import store from "../../../store/store";
import { FkColumnChangeEventDetail } from "./fk-columns";
import TableDialogColumns from "./columns";
import TableDialogFkColumns from "./fk-columns";
import buttonCss from "purecss/build/buttons-min.css";
import formsCss from "purecss/build/forms-min.css";
import { actions as schemaActions } from "../../../store/slices/schema";
import { actions as loadSchemaActions } from "../../../store/slices/load-schema";
import { cloneDeep } from "lodash";
import { actions as dbViewerModeAction } from "../../../store/slices/db-viewer-mode";
import { Schema, TableSchema, ColumnFkSchema } from "db-viewer-component";
import { Point } from "db-viewer-component";
import { getDriveProvider } from "../../../drive/factory";
import { produce } from "immer";
import { ColumnOpsEvent, ColumnChangeEvent } from "./common-columns";
import { DBGElement } from "../../dbg-element";
import { t } from "../../../localization";
import DbGrapherSchema from "../../../db-grapher-schema";
import { customElement, state } from "lit/decorators";

@customElement("dbg-table-dialog")
export default class extends DBGElement {
  @state()
  private open = false;

  @state()
  private schema!: DbGrapherSchema;

  #currentTableIndex!: number;
  #isEdit = false;
  #nameInput!: HTMLInputElement;
  #tableDialogColumns!: TableDialogColumns;
  #tableDialogFkColumns!: TableDialogFkColumns;
  #form!: HTMLFormElement;
  #originalTableName = "";

  static get styles(): CSSResultGroup {
    return css`
      ${unsafeCSS(buttonCss)}
      ${unsafeCSS(formsCss)}
      .menu {
        display: flex;
        justify-content: center;
        padding-left: 0;
      }
      .menu button {
        margin-left: 10px;
      }
    `;
  }

  #onOpen = (tableName?: string, pos?: Point): void => {
    this.schema = cloneDeep(store.getState().schema.present);
    if (tableName) {
      this.#isEdit = true;
      this.#currentTableIndex = this.schema.tables.findIndex(
        ({ name }) => name === tableName
      )!;
      this.#originalTableName = tableName;
    } else {
      this.#isEdit = false;
      this.schema = produce(this.schema, (schema) => {
        const currentTable = {
          pos,
          name: "",
          columns: [],
        };
        schema.tables.unshift(currentTable);
      });

      this.#currentTableIndex = 0;
      this.#originalTableName = "";
    }
  };

  async update(changedProperties: PropertyValues): Promise<void> {
    super.update(changedProperties);
    if (changedProperties.has("open") && this.open) {
      await this.updateComplete;
      this.#form = this.shadowRoot!.querySelector("form")!;
      this.#tableDialogColumns = this.shadowRoot!.querySelector<TableDialogColumns>(
        "dbg-table-dialog-columns"
      )!;
      this.#tableDialogFkColumns = this.shadowRoot!.querySelector<TableDialogFkColumns>(
        "dbg-table-dialog-fk-columns"
      )!;
      this.#nameInput = this.shadowRoot!.querySelector<HTMLInputElement>(
        '[name="name"]'
      ) as HTMLInputElement;
      this.#nameInput.focus();
    }
  }

  #addColumn = (): void => {
    this.schema = produce(this.schema, (schema) => {
      const currentTableColumns = this.#getCurrentTable(schema).columns;
      let lastNonFkColumnIndex = 0;
      for (let i = 0; i < currentTableColumns.length; ++i) {
        if ((currentTableColumns[i] as ColumnFkSchema).fk == null) {
          ++lastNonFkColumnIndex;
        }
      }
      currentTableColumns.splice(lastNonFkColumnIndex, 0, {
        name: "",
        type: "",
      });
    });
  };

  #getFkTables = (
    index: number,
    targetTable: TableSchema,
    schema: Schema
  ): { table: TableSchema; columnIndex: number }[] => {
    const targetTableColumns = targetTable.columns;

    const fkTables: { table: TableSchema; columnIndex: number }[] = [];
    schema.tables.forEach((table) => {
      table.columns.filter((column, columnIndex) => {
        if (
          (column as ColumnFkSchema)?.fk?.table === targetTable.name &&
          targetTableColumns[index].name ===
            (column as ColumnFkSchema)?.fk!.column
        ) {
          fkTables.push({ table, columnIndex });
        }
      });
    });
    return fkTables;
  };

  #removeColumn = (event: ColumnOpsEvent): void => {
    const index = event.detail.index;
    this.schema = produce(this.schema, (schema) => {
      const fkTables = this.#getFkTables(
        index,
        this.#getCurrentTable()!,
        schema
      );
      if (
        fkTables.length > 0 &&
        window.confirm(
          t((l) => l.dialog.table.warningRecursive, {
            tableColumn: fkTables
              .map(
                (item) =>
                  `${item.table.name}.${
                    item.table.columns[item.columnIndex].name
                  }`
              )
              .join(", "),
          })
        )
      ) {
        while (fkTables.length > 0) {
          const item = fkTables.shift()!;
          fkTables.push(
            ...this.#getFkTables(item.columnIndex, item.table, schema)
          );
          item.table.columns.splice(item.columnIndex, 1);
        }
      }

      this.#getCurrentTable(schema)?.columns.splice(index, 1);
    });
  };

  #moveUpColumn = (event: ColumnOpsEvent, isFk: boolean): void => {
    const index = event.detail.index;
    this.schema = produce(this.schema, (schema) => {
      const currentTableColumns = this.#getCurrentTable(schema).columns;
      const columnToBeMoved = currentTableColumns[index];
      for (let i = index - 1; i >= 0; --i) {
        if (
          isFk
            ? (currentTableColumns[i] as ColumnFkSchema).fk
            : !(currentTableColumns[i] as ColumnFkSchema).fk
        ) {
          currentTableColumns.splice(index, 1);
          currentTableColumns.splice(i, 0, columnToBeMoved);
          break;
        }
      }
    });
  };

  #moveDownColumn = (event: ColumnOpsEvent, isFk: boolean): void => {
    const index = event.detail.index;
    this.schema = produce(this.schema, (schema) => {
      const currentTableColumns = this.#getCurrentTable(schema).columns;
      const columnToBeMoved = currentTableColumns[index];
      for (let i = index + 1; i < currentTableColumns.length; ++i) {
        if (
          isFk
            ? (currentTableColumns[i] as ColumnFkSchema).fk
            : !(currentTableColumns[i] as ColumnFkSchema).fk
        ) {
          currentTableColumns.splice(index, 1);
          currentTableColumns.splice(i, 0, columnToBeMoved);
          break;
        }
      }
    });
  };

  #addFkColumn = (): void => {
    this.schema = produce(this.schema, (schema) => {
      this.#getCurrentTable(schema)?.columns.push({
        name: "",
        fk: {
          table: "",
          column: "",
        },
      });
    });
  };

  #fkColumnChange = (event: CustomEvent<FkColumnChangeEventDetail>): void => {
    this.schema = produce(this.schema, (schema) => {
      this.#getCurrentTable(schema)!.columns[event.detail.index] =
        event.detail.column;
    });

    this.updateComplete.then(() => {
      this.#tableDialogColumns.validateColumnNames();
      this.#tableDialogFkColumns.validateColumnNames();
    });
  };

  #getCurrentTable = (schema = this.schema): TableSchema =>
    schema.tables[this.#currentTableIndex]!;

  #columnChange = (event: ColumnChangeEvent): void => {
    const changeColumn = event.detail.column;
    this.schema = produce(this.schema, (schema) => {
      const currentTable = this.#getCurrentTable(schema);
      this.#fixFkColumnNames(changeColumn.name, event.detail.prevName, schema);
      currentTable.columns[event.detail.index] = event.detail.column;
    });

    this.updateComplete.then(() => {
      this.#tableDialogColumns.validateColumnNames();
      this.#tableDialogFkColumns.validateColumnNames();
    });
  };

  connectedCallback(): void {
    super.connectedCallback();

    this.subscribe(
      (state) => state.dialog.tableDialog,
      ({ open, tableName }, state) => {
        this.open = open;
        if (open) {
          this.#onOpen(tableName, state.dialog.tableDialog.cords);
        }
      }
    );
  }

  #validate = (): boolean => {
    return (
      this.#form.reportValidity() &&
      this.#tableDialogColumns.reportValidity() &&
      this.#tableDialogFkColumns.reportValidity()
    );
  };

  render(): TemplateResult {
    if (!this.open) return html``;
    return html` <dbg-dialog
      ?show=${true}
      showClose
      centerTitle="${this.#isEdit ? "Edit Table" : "Create Table"}"
      @dbg-on-close="${this.#cancel}"
      @dbg-on-escape="${this.#cancel}"
      data-testid="table-dialog"
    >
      <div slot="body">
        <form class="pure-form pure-form-stacked">
          <label>
            ${t((l) => l.dialog.table.labelName)}
            <input
              name="name"
              data-testid="table-name"
              type="text"
              @input="${this.#onChangeTableName}"
              .value="${this.#getCurrentTable()?.name}"
              required
            />
          </label>
          <dbg-table-dialog-columns
            .schema="${this.schema ?? {}}"
            tableIndex="${this.#currentTableIndex}"
            @dbg-add-column="${this.#addColumn}"
            @dbg-column-change="${this.#columnChange}"
            @dbg-remove-column="${this.#removeColumn}"
            @dbg-move-up-column="${(event: ColumnOpsEvent): void =>
              this.#moveUpColumn(event, false)}"
            @dbg-move-down-column="${(event: ColumnOpsEvent): void =>
              this.#moveDownColumn(event, false)}"
          >
          </dbg-table-dialog-columns>
          <dbg-table-dialog-fk-columns
            .schema="${this.schema ?? {}}"
            tableIndex="${this.#currentTableIndex}"
            @dbg-add-fk-column="${this.#addFkColumn}"
            @dbg-fk-column-change="${this.#fkColumnChange}"
            @dbg-remove-column="${this.#removeColumn}"
            @dbg-move-up-column="${(event: ColumnOpsEvent): void =>
              this.#moveUpColumn(event, true)}"
            @dbg-move-down-column="${(event: ColumnOpsEvent): void =>
              this.#moveDownColumn(event, true)}"
          >
          </dbg-table-dialog-fk-columns>
          <div class="menu">
            <button
              class="pure-button"
              @click="${this.#save}"
              data-testid="save-btn"
            >
              ${t((l) => l.dialog.table.saveBtn)}
            </button>
            <button
              class="pure-button"
              @click="${this.#cancel}"
              data-testid="cancel-btn"
            >
              ${t((l) => l.dialog.table.cancelBtn)}
            </button>
          </div>
        </form>
      </div>
    </dbg-dialog>`;
  }

  #onChangeTableName = (event: InputEvent): void => {
    const element = event.target! as HTMLInputElement;
    this.schema = produce(this.schema, (schema) => {
      this.#getCurrentTable(schema)!.name = element.value;
    });
    const currentTable = this.#getCurrentTable();
    if (
      this.schema.tables.find(
        (table, index) =>
          table.name === currentTable.name && index !== this.#currentTableIndex
      )
    ) {
      element.setCustomValidity(
        t((l) => l.dialog.table.errorSameNameTable, {
          name: currentTable.name,
        })
      );
    } else {
      element.setCustomValidity("");
      const tableName = (event.target as HTMLInputElement).value;
      this.#fixFkTableNames(tableName);
      this.#originalTableName = tableName;
    }
  };

  #cancel = (event: Event): void => {
    event.preventDefault();
    if (store.getState().dialog.tableDialog.open) {
      store.dispatch(tableDialogAction.close());
      store.dispatch(dbViewerModeAction.none());
    }
  };

  #save = (event: Event): void => {
    event.preventDefault();
    if (this.#validate()) {
      store.dispatch(dbViewerModeAction.none());
      store.dispatch(schemaActions.set(this.schema));
      store.dispatch(loadSchemaActions.loadViewportUnchange());
      void getDriveProvider().updateFile();
      store.dispatch(tableDialogAction.close());
    }
  };

  #fixFkTableNames = (tableName: string): void => {
    this.schema = produce(this.schema, (schema) => {
      schema.tables.forEach((table) => {
        table.columns.forEach((column) => {
          const columnFk = column as ColumnFkSchema;
          if (columnFk.fk && columnFk.fk.table === this.#originalTableName) {
            columnFk.fk.table = tableName;
            if (
              columnFk.name ===
              `fk_${this.#originalTableName}_${columnFk.fk.column}`
            ) {
              columnFk.name = `fk_${tableName}_${columnFk.fk.column}`;
            }
          }
        });
      });
    });
  };

  #fixFkColumnNames = (
    columnName: string,
    originalColumnName: string,
    schema: Schema
  ): void => {
    schema.tables.forEach((table) => {
      table.columns.forEach((column) => {
        const columnFk = column as ColumnFkSchema;
        if (
          columnFk.fk &&
          columnFk.fk.table === this.#originalTableName &&
          columnFk.fk.column === originalColumnName
        ) {
          columnFk.fk.column = columnName;
          if (
            columnFk.name ===
            `fk_${this.#originalTableName}_${originalColumnName}`
          ) {
            columnFk.name = `fk_${this.#originalTableName}_${
              columnFk.fk.column
            }`;
          }
        }
      });
    });
  };
}
