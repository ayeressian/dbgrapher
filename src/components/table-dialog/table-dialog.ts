import { html, customElement, css, CSSResult, TemplateResult, LitElement } from 'lit-element';
import { actions as tableDialogAction } from '../../store/slices/create-dialog';
import store from '../../store/store';
import { subscribe } from '../../subscribe-store';
import { ColumnChangeEventDetail } from './columns';
import { FkColumnChangeEventDetail } from './fk-columns';
import TableDialogColumns from './columns';
import TableDialogFkColumns from './fk-columns';

@customElement('dbg-table-dialog')
export default class extends LitElement {

  private schema?: ISchema;
  private currentTable?: ITableSchema;
  private open = false;

  private tableDialogColumns?: TableDialogColumns;
  private tableDialogFkColumns?: TableDialogFkColumns;
  private form?: HTMLFormElement;

  static get styles(): CSSResult {
    return css`
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

  private onOpen() {
    this.schema = JSON.parse(JSON.stringify(store.getState().schema!));
    this.currentTable = {
      name: '',
      columns: []
    };
    this.schema?.tables.unshift(this.currentTable);
  }

  firstUpdated() {
    this.form = this.shadowRoot!.querySelector('form')!;
    this.tableDialogColumns = this.shadowRoot!.querySelector<TableDialogColumns>('dbg-table-dialog-columns')!;
    this.tableDialogFkColumns = this.shadowRoot!.querySelector<TableDialogFkColumns>('dbg-table-dialog-fk-columns')!;
  }

  private addColumn = () => {
    this.currentTable?.columns.push({
      name: '',
      type: '',
    });
    this.requestUpdate();
  };

  private addFkColumn = () => {
    this.currentTable?.columns.push({
      name: '',
      fk: {
        table: '',
        column: '',
      },
    });
    this.requestUpdate();
  };

  private fkColumnChange = (event: CustomEvent<FkColumnChangeEventDetail>) => {
    (this.currentTable!.columns[event.detail.index] as IColumnFkSchema) = event.detail.column;
    this.requestUpdate();
  };

  private columnChange = (event: CustomEvent<ColumnChangeEventDetail>) => {
    (this.currentTable!.columns[event.detail.index] as IColumnNoneFkSchema) = event.detail.column;
    this.requestUpdate();
  };

  connectedCallback() {
    super.connectedCallback();
    subscribe(state => state.dialog.tableDialog, open => {
      this.open = open;
      if (open) {
        this.onOpen();  
      }
      this.requestUpdate();
    });
  }

  private validate() {
    return this.form!.reportValidity() &&
      this.tableDialogColumns!.validate() &&
      this.tableDialogFkColumns!.validate();
  }

  render(): TemplateResult {
    return html`
      <dbg-dialog ?show=${this.open}>
        <form>
          <h3>Create Table</h3>
          <div>
            <label>
              Name:
              <input name='name' type='text' @input="${this.onChangeTableName}" required/>
            </label>
          </div>
          <dbg-table-dialog-columns
            schema="${JSON.stringify(this.schema)}"
            tableIndex="${0}"
            @dbg-add-column="${this.addColumn}"
            @dbg-column-change="${this.columnChange}">
          </dbg-table-dialog-columns>
          <dbg-table-dialog-fk-columns
            schema="${JSON.stringify(this.schema)}"
            tableIndex="${0}"
            @dbg-add-fk-column="${this.addFkColumn}"
            @dbg-fk-column-change="${this.fkColumnChange}">
          </dbg-table-dialog-fk-columns>
          <div class="errors" />
          <div class="menu">
            <button @click="${this.cancel}">Cancel</button>
            <button @click="${this.save}">Create</button>
          </div>
        </form>
      </dbg-dialog>`;
  }

  private onChangeTableName = (event: Event) => {
    this.currentTable!.name = (event.target! as HTMLInputElement).value;
    this.requestUpdate();
  }

  private cancel = () => {
    store.dispatch(tableDialogAction.close());
  }

  private save = (event: Event) => {
    event.preventDefault();
    if (this.validate()) {
      store.dispatch(tableDialogAction.close());
    }
  }
}