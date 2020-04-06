import { html, customElement, css, CSSResult, TemplateResult, LitElement, unsafeCSS } from 'lit-element';
import { actions as tableDialogAction } from '../../store/slices/create-dialog';
import store from '../../store/store';
import { subscribe } from '../../subscribe-store';
import { ColumnChangeEventDetail, ColumnRemoveEvent } from './columns';
import { FkColumnChangeEventDetail, FkColumnRemoveEvent } from './fk-columns';
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

@customElement('dbg-table-dialog')
export default class extends LitElement {

  #schema?: Schema;
  #currentTable?: TableSchema;
  #currentTableIndex?: number;
  #open = false;
  #isEdit = false;

  #tableDialogColumns?: TableDialogColumns;
  #tableDialogFkColumns?: TableDialogFkColumns;
  #form?: HTMLFormElement;

  static get styles(): CSSResult {
    return css`
      ${unsafeCSS(buttonCss)}
      ${unsafeCSS(formsCss)}
      .container {
        width: 770px;
      }
      .title {
        text-align: center;
      }
      .error {
        color: #cc0000;
      }
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
    this.#schema = deepCopy(store.getState().schema.present!);
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
    }
  };

  firstUpdated(): void {
    this.#form = this.shadowRoot!.querySelector('form')!;
    this.#tableDialogColumns = this.shadowRoot!.querySelector<TableDialogColumns>('dbg-table-dialog-columns')!;
    this.#tableDialogFkColumns = this.shadowRoot!.querySelector<TableDialogFkColumns>('dbg-table-dialog-fk-columns')!;
  }

  #addColumn = (): void => {
    this.#currentTable?.columns.push({
      name: '',
      type: '',
    });
    this.requestUpdate();
  };

  #removeColumn = (event: ColumnRemoveEvent): void => {
    this.#currentTable?.columns.splice(event.detail.index, 1);
    this.requestUpdate();
  };

  #removeFkColumn = (event: FkColumnRemoveEvent): void => {
    this.#currentTable?.columns.splice(event.detail.index, 1);
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
      <dbg-dialog ?show=${this.#open}>
        <div class="container">
          <h3 class="title">${this.#isEdit ? 'Edit Table': 'Create Table'}</h3>
          <form class="pure-form pure-form-stacked">
            <label>
              Name
              <input name='name' type='text' @input="${this.#onChangeTableName}" .value="${this.#currentTable?.name}" required/>
            </label>
            <dbg-table-dialog-columns
              schema="${JSON.stringify(this.#schema ?? {})}"
              tableIndex="${this.#currentTableIndex}"
              @dbg-add-column="${this.#addColumn}"
              @dbg-column-change="${this.#columnChange}"
              @dbg-remove-column="${this.#removeColumn}">
            </dbg-table-dialog-columns>
            <dbg-table-dialog-fk-columns
              schema="${JSON.stringify(this.#schema ?? {})}"
              tableIndex="${this.#currentTableIndex}"
              @dbg-add-fk-column="${this.#addFkColumn}"
              @dbg-fk-column-change="${this.#fkColumnChange}"
              @dbg-remove-fk-column="${this.#removeFkColumn}">
            </dbg-table-dialog-fk-columns>
            <div class="errors"></div>
            <div class="menu">
              <button class="pure-button" @click="${this.#save}">Save</button>
              <button class="pure-button" @click="${this.#cancel}">Cancel</button>
            </div>
          </form>
        </div>
      </dbg-dialog>`;
  }

  #onChangeTableName = (event: Event): void => {
    this.#currentTable!.name = (event.target! as HTMLInputElement).value;
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
      store.dispatch(loadSchemaActions.load());
      store.dispatch(tableDialogAction.close());
    }
  }
}