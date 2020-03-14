import { html, customElement, css, CSSResult, TemplateResult, LitElement, unsafeCSS } from 'lit-element';
import { actions as tableDialogAction } from '../../store/slices/create-dialog';
import store from '../../store/store';
import { subscribe } from '../../subscribe-store';
import { ColumnChangeEventDetail, ColumnRemoveEvent } from './columns';
import { FkColumnChangeEventDetail, FkColumnRemoveEvent } from './fk-columns';
import TableDialogColumns from './columns';
import TableDialogFkColumns from './fk-columns';
import bulma from 'bulma/bulma.sass';

@customElement('dbg-table-dialog')
export default class extends LitElement {

  #schema?: ISchema;
  #currentTable?: ITableSchema;
  #open = false;

  #tableDialogColumns?: TableDialogColumns;
  #tableDialogFkColumns?: TableDialogFkColumns;
  #form?: HTMLFormElement;

  static get styles(): CSSResult {
    return css`
      ${unsafeCSS(bulma)}
      .error {
        color: #cc0000;
      }
      .menu {
        display: flex;
        justify-content: center;
        padding-left: 0;
      }
    `;
  }

  #onOpen = () => {
    this.#schema = JSON.parse(JSON.stringify(store.getState().schema!));
    this.#currentTable = {
      name: '',
      columns: []
    };
    this.#schema?.tables.unshift(this.#currentTable);
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
    subscribe(state => state.dialog.tableDialog, open => {
      this.#open = open;
      if (open) {
        this.#onOpen();  
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
        <form>
          <h3>Create Table</h3>
          <div>
            <label>
              Name:
              <input name='name' type='text' @input="${this.#onChangeTableName}" required/>
            </label>
          </div>
          <dbg-table-dialog-columns
            schema="${JSON.stringify(this.#schema)}"
            tableIndex="${0}"
            @dbg-add-column="${this.#addColumn}"
            @dbg-column-change="${this.#columnChange}"
            @dbg-remove-column="${this.#removeColumn}">
          </dbg-table-dialog-columns>
          <dbg-table-dialog-fk-columns
            schema="${JSON.stringify(this.#schema)}"
            tableIndex="${0}"
            @dbg-add-fk-column="${this.#addFkColumn}"
            @dbg-fk-column-change="${this.#fkColumnChange}"
            @dbg-remove-fk-column="${this.#removeFkColumn}">
          </dbg-table-dialog-fk-columns>
          <div class="errors" />
          <div class="menu">
            <button class="button" @click="${this.#cancel}">Cancel</button>
            <button class="button" @click="${this.#save}">Create</button>
          </div>
        </form>
      </dbg-dialog>`;
  }

  #onChangeTableName = (event: Event) => {
    this.#currentTable!.name = (event.target! as HTMLInputElement).value;
    this.requestUpdate();
  }

  #cancel = () => {
    store.dispatch(tableDialogAction.close());
  }

  #save = (event: Event) => {
    event.preventDefault();
    if (this.#validate()) {
      store.dispatch(tableDialogAction.close());
    }
  }
}