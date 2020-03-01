import { html, customElement, css, CSSResult, TemplateResult, LitElement } from 'lit-element';
import { actions as tableDialogAction } from '../store/slices/create-dialog';
import store from '../store/store';
import { subscribe } from '../subscribe-store';

@customElement('dbg-table-dialog')
export default class extends LitElement {

  private schema?: ISchema;
  private currentTable?: ITableSchema;
  private open = false;

  static get styles(): CSSResult {
    return css`
      .error {
        color: '#cc0000';
      }
      .menu {
        display: 'flex';
        justify-content: 'center';
        padding-left: 0;
      }
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    subscribe(state => state.dialog.tableDialog, open => {
      this.open = open;
      if (open) {
        this.schema = JSON.parse(JSON.stringify(store.getState().schema!));

        this.currentTable = {
          name: '',
          columns: []
        };

        this.schema?.tables.unshift(this.currentTable);
      }
      this.requestUpdate();
    });
  }

  render(): TemplateResult {
    return this.open? html`
      <dbg-dialog show>
        <h3>Create Table</h3>
        <div>
          <label>
            Name:
            <input name='name' type='text' @change="${this.onChangeTableName}" />
          </label>
        </div>
        <div class="errors" />
        <div class="menu">
          <button @click="${this.cancel}">Cancel</button>
          <button @click="${this.save}">Create</button>
        </div>
      </dbg-dialog>
    `: html``;
  }

  private onChangeTableName = (event: Event) => {
    this.currentTable!.name = (event.target! as HTMLInputElement).value;
  }

  private cancel = () => {
    store.dispatch(tableDialogAction.close());
  }

  private save = () => {
    store.dispatch(tableDialogAction.close());
  }
}