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

@customElement('dbg-table-dialog')
export default class extends LitElement {

  #schema?: ISchema;
  #currentTable?: ITableSchema;
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

  #onOpen = (tableName?: string) => {
    this.#schema = JSON.parse(JSON.stringify(store.getState().schema!));
    if (tableName) {
      this.#isEdit = true;
      this.#currentTableIndex = this.#schema!.tables.findIndex(({name}) => name === tableName)!;
      this.#currentTable = this.#schema!.tables[this.#currentTableIndex];
    } else {
      this.#isEdit = false;
      this.#currentTable = {
        name: '',
        columns: []
      };
      this.#schema?.tables.unshift(this.#currentTable);
      this.#currentTableIndex = 0; 
    }
  };

  firstUpdated() {
    this.#form = this.shadowRoot!.querySelector('form')!;
    this.#tableDialogColumns = this.shadowRoot!.querySelector<TableDialogColumns>('dbg-table-dialog-columns')!;
    this.#tableDialogFkColumns = this.shadowRoot!.querySelector<TableDialogFkColumns>('dbg-table-dialog-fk-columns')!;
  }

  #addColumn = () => {
    this.#currentTable?.columns.push({
      name: '',
      type: '',
    });
    this.requestUpdate();
  };

  #removeColumn = (event: ColumnRemoveEvent) => {
    this.#currentTable?.columns.splice(event.detail.index, 1);
    this.requestUpdate();
  };

  #removeFkColumn = (event: FkColumnRemoveEvent) => {
    this.#currentTable?.columns.splice(event.detail.index, 1);
    this.requestUpdate();
  };

  #addFkColumn = () => {
    this.#currentTable?.columns.push({
      name: '',
      fk: {
        table: '',
        column: '',
      },
    });
    this.requestUpdate();
  };

  #fkColumnChange = (event: CustomEvent<FkColumnChangeEventDetail>) => {
    (this.#currentTable!.columns[event.detail.index] as IColumnFkSchema) = event.detail.column;
    this.requestUpdate();
  };

  #columnChange = (event: CustomEvent<ColumnChangeEventDetail>) => {
    (this.#currentTable!.columns[event.detail.index] as IColumnNoneFkSchema) = event.detail.column;
    this.requestUpdate();
  };

  connectedCallback() {
    super.connectedCallback();
    subscribe(state => state.dialog.tableDialog, ({open, tableName}) => {
      this.#open = open;
      if (open) {
        this.#onOpen(tableName);
      }
      this.requestUpdate();
    });
  }

  #validate = () => {
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

  #onChangeTableName = (event: Event) => {
    this.#currentTable!.name = (event.target! as HTMLInputElement).value;
    this.requestUpdate();
  }

  #cancel = (event: Event) => {
    event.preventDefault();
    store.dispatch(tableDialogAction.close());
  }

  #save = (event: Event) => {
    event.preventDefault();
    if (this.#validate()) {
      store.dispatch(tableDialogAction.close());
    }
  }
}