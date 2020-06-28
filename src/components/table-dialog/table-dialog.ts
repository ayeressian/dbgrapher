import { html, customElement, css, CSSResult, TemplateResult, LitElement, unsafeCSS } from 'lit-element';
import { actions as tableDialogAction } from '../../store/slices/dialog/table-dialog';
import store from '../../store/store';
import { subscribe } from '../../subscribe-store';
import { ColumnChangeEventDetail, ColumnRemoveEvent } from './columns';
import { FkColumnChangeEventDetail } from './fk-columns';
import TableDialogColumns from './columns';
import TableDialogFkColumns from './fk-columns';
import buttonCss from 'purecss/build/buttons-min.css';
import formsCss from 'purecss/build/forms-min.css';
import { actions as schemaActions} from '../../store/slices/schema';
import { actions as loadSchemaActions} from '../../store/slices/load-schema';
import { deepCopy } from '../../util';
import { actions as dbViewerModeAction } from '../../store/slices/db-viewer-mode';
import { ColumnNoneFkSchema, Schema, TableSchema, ColumnFkSchema } from 'db-viewer-component';
import { Point } from 'db-viewer-component';
import { update as updateDrive } from '../../drive/google-drive/google-drive';

@customElement('dbg-table-dialog')
export default class extends LitElement {

  #schema?: Schema;
  #currentTable?: TableSchema;
  #currentTableIndex?: number;
  #open = false;
  #isEdit = false;
  #nameInput?: HTMLInputElement;
  #tableDialogColumns?: TableDialogColumns;
  #tableDialogFkColumns?: TableDialogFkColumns;
  #form?: HTMLFormElement;

  static get styles(): CSSResult {
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

  #onOpen = (tableName?: string, cords?: Point): void => {
    this.#schema = deepCopy(store.getState().schema.present);
    if (tableName) {
      this.#isEdit = true;
      this.#currentTableIndex = this.#schema.tables.findIndex(({name}) => name === tableName)!;
      this.#currentTable = this.#schema.tables[this.#currentTableIndex];
    } else {
      this.#isEdit = false;
      this.#currentTable = {
        name: '',
        columns: [],
        pos: cords,
      };
      this.#schema?.tables.unshift(this.#currentTable);
      this.#currentTableIndex = 0;

      // Fix for the case when old previous table data still persist after opening new dialog
      this.requestUpdate().then(() => {
        this.#tableDialogColumns?.requestUpdate();
        this.#tableDialogFkColumns?.requestUpdate();
        this.#nameInput?.focus();
      });
    }
  };

  firstUpdated(): void {
    this.#form = this.shadowRoot!.querySelector('form')!;
    this.#tableDialogColumns = this.shadowRoot!.querySelector<TableDialogColumns>('dbg-table-dialog-columns')!;
    this.#tableDialogFkColumns = this.shadowRoot!.querySelector<TableDialogFkColumns>('dbg-table-dialog-fk-columns')!;
    this.#nameInput = this.shadowRoot!.querySelector<HTMLInputElement>('[name="name"]') as HTMLInputElement;
  }

  #addColumn = (): void => {
    this.#currentTable?.columns.push({
      name: '',
      type: '',
    });
    this.requestUpdate();
  };

  #getFkTables = (index: number, targetTable: TableSchema): {table: TableSchema; columnIndex: number}[]  => {
    const targetTableColumns = targetTable.columns;
    
    const fkTables: {table: TableSchema; columnIndex: number}[] = [];
    this.#schema!.tables.forEach((table) => {
      table.columns.filter((column, columnIndex) => {
        if ((column as ColumnFkSchema)?.fk?.table === targetTable.name
          && targetTableColumns[index].name === (column as ColumnFkSchema)?.fk!.column) {
          fkTables.push({table, columnIndex});
        }
      });
    });
    return fkTables;
  };

  #removeColumn = (event: ColumnRemoveEvent): void => {
    const index = event.detail.index;
    const fkTables = this.#getFkTables(index, this.#currentTable!);
    if (fkTables.length > 0 && window.confirm(`Removing this column will result in recursive deletion of the following columns in tables that have fk constraint to this column.\n ${fkTables.map(item => `${item.table.name}.${item.table.columns[item.columnIndex].name}`)}`)) {
      while (fkTables.length > 0) {
        const item = fkTables.shift()!;
        fkTables.push(...this.#getFkTables(item.columnIndex, item.table));
        item.table.columns.splice(item.columnIndex, 1);
      }
    }
    this.#currentTable?.columns.splice(index, 1);
    this.requestUpdate();
  };

  #addFkColumn = (): void => {
    this.#currentTable?.columns.push({
      name: '',
      fk: {
        table: '',
        column: '',
      },
    });
    this.requestUpdate();
  };

  #fkColumnChange = (event: CustomEvent<FkColumnChangeEventDetail>): void => {
    (this.#currentTable!.columns[event.detail.index] as ColumnFkSchema) = event.detail.column;
    this.requestUpdate();
  };

  #columnChange = (event: CustomEvent<ColumnChangeEventDetail>): void => {
    (this.#currentTable!.columns[event.detail.index] as ColumnNoneFkSchema) = event.detail.column;
    this.requestUpdate();
  };

  connectedCallback(): void {
    super.connectedCallback();

    subscribe(state => state.dialog.tableDialog, ({open, tableName}, state) => {
      this.#open = open;
      if (open) {
        this.#onOpen(tableName, state.dialog.tableDialog.cords);
      }
      this.requestUpdate();
    });
  }

  #validate = (): boolean => {
    return this.#form!.reportValidity() &&
      this.#tableDialogColumns!.validate() &&
      this.#tableDialogFkColumns!.validate();
  }

  render(): TemplateResult {
    return html`
      <dbg-dialog ?show=${this.#open} showClose title="${this.#isEdit ? 'Edit Table': 'Create Table'}" @dbg-on-close="${this.#cancel}" @dbg-on-escape="${this.#cancel}">
        <div slot="body">
          <form class="pure-form pure-form-stacked">
            <label>
              Name
              <input name='name' data-testid="table-name" type='text' @input="${this.#onChangeTableName}" .value="${this.#currentTable?.name}" required/>
            </label>
            <dbg-table-dialog-columns
              .schema="${this.#schema ?? {}}"
              tableIndex="${this.#currentTableIndex}"
              @dbg-add-column="${this.#addColumn}"
              @dbg-column-change="${this.#columnChange}"
              @dbg-remove-column="${this.#removeColumn}">
            </dbg-table-dialog-columns>
            <dbg-table-dialog-fk-columns
              .schema="${this.#schema ?? {}}"
              tableIndex="${this.#currentTableIndex}"
              @dbg-add-fk-column="${this.#addFkColumn}"
              @dbg-fk-column-change="${this.#fkColumnChange}"
              @dbg-remove-fk-column="${this.#removeColumn}">
            </dbg-table-dialog-fk-columns>
            <div class="menu">
              <button class="pure-button" @click="${this.#save}" data-testid="save-btn">Save</button>
              <button class="pure-button" @click="${this.#cancel}" data-testid="cancel-btn">Cancel</button>
            </div>
          </form>
        </div>
      </dbg-dialog>`;
  }

  #onChangeTableName = (event: Event): void => {
    const element = (event.target! as HTMLInputElement);
    this.#currentTable!.name = element.value;
    if (this.#schema!.tables.find((table, index) => table.name === this.#currentTable!.name && index !== this.#currentTableIndex)) {
      element.setCustomValidity(`There is already a table with the name "${this.#currentTable!.name}".`);
    } else {
      element.setCustomValidity('');
    }
    this.requestUpdate();
  }

  #cancel = (event: Event): void => {
    event.preventDefault();
    store.dispatch(tableDialogAction.close());
    store.dispatch(dbViewerModeAction.none());
  }

  #save = (event: Event): void => {    
    event.preventDefault();
    if (this.#validate()) {
      store.dispatch(dbViewerModeAction.none());
      store.dispatch(schemaActions.set(this.#schema!));
      store.dispatch(loadSchemaActions.loadViewportUnchange());
      updateDrive();
      store.dispatch(tableDialogAction.close());
    }
  }
}