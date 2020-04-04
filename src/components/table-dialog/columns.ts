import { customElement, LitElement, TemplateResult, html, property, CSSResult, css } from 'lit-element';
import commonTableStyles from './common-columns-styles';
import Schema, { ColumnNoneFkSchema, ColumnFkSchema } from 'db-viewer-component';

export interface ColumnChangeEventDetail {
  column: ColumnNoneFkSchema;
  index: number;
}

export interface ColumnRemoveDetail {
  index: number;
}

export type ColumnRemoveEvent = CustomEvent<ColumnRemoveDetail>;

@customElement('dbg-table-dialog-columns')
export default class extends LitElement {
  @property( { type : Object } ) schema?: Schema;
  @property( { type : Number } ) tableIndex?: number;

  #form?: HTMLFormElement;
  
  static get styles(): CSSResult {
    return css`
      table {
        width: 660px;
      }
      ${commonTableStyles}
        
    `;
  }

  #onColumnChange = (index: number, column: ColumnNoneFkSchema) => {
    const detail: ColumnChangeEventDetail = {
      column,
      index,
    };
    const event = new CustomEvent('dbg-column-change', { detail });
    this.dispatchEvent(event);
  }

  #renderColumn = (column: ColumnNoneFkSchema, index: number): TemplateResult => {
    const onColumnChange = (type: keyof ColumnNoneFkSchema) => (event: InputEvent) => {
      const element = event.target as HTMLInputElement;
      switch(type){
        case 'nn':
        case 'uq':
        case 'pk':
          column[type] = element.checked;
          break;
        default:
          column[type] = element.value;
          break;
      }
      
      this.#onColumnChange(index, column);
    };
    return html`
      <tr>
        <td>
          <input
            @input="${onColumnChange('name')}"
            .value="${column.name}"
            required
          />
        </td>
        <td>
          <input
            @input="${onColumnChange('type')}"
            .value="${column.type}"
            required
          />
        </td>
        <td>
          <input
            type='checkbox'
            @change="${onColumnChange('pk')}"
            .checked="${column.pk}"
          />
        </td>
        <td>
          <input
            type='checkbox'
            @change="${onColumnChange('uq')}"
            .checked="${column.uq}"
          />
        </td>
        <td>
          <input
            type='checkbox'
            @change="${onColumnChange('nn')}"
            .checked="${column.nn}"
          />
        </td>
        <td>
          <button class="pure-button" @click="${(event: Event) => this.#removeColumn(event, index)}">Remove</button>
        </td>
      </tr>
    `;
  }

  #getCurrentTableColumns = () => {
    const currentTable = this.schema?.tables?.[this.tableIndex!];
    return currentTable?.columns.map((column, index) => ({column, index})).filter(item => !(item.column as ColumnFkSchema).fk) ?? [];
  };

  #renderColumns = (): TemplateResult => {
    const currentTableColumns = this.#getCurrentTableColumns();
    let result;
    if (currentTableColumns.length > 0) {
      result = html`${currentTableColumns.map(({column, index}) => this.#renderColumn(column as ColumnNoneFkSchema, index))}`;
    } else {
      result = html`<tr><td class="no-column" colspan="6">No columns to show</td></tr>`
    }
    return html`${result}`;
  }

  firstUpdated() {
    this.#form = this.shadowRoot!.querySelector('form')!;
  }

  validate() {
    return this.#form!.reportValidity();
  }
  
  render(): TemplateResult {
    return html`
      <div class="container">
        <form class="pure-form">
          <div class="title">
            Columns
          </div>
          <div class="table-container">
            <table class="pure-table pure-table-horizontal">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>PK</th>
                  <th>UQ</th>
                  <th>NN</th>
                  <th/>
                </tr>
              </thead>
              <tbody>${this.#renderColumns()}</tbody>
            </table>
          </div>
          <button class="pure-button add-column" @click="${this.#addColumn}">Add column</button>
        </form>
      </div>`;
  }

  #addColumn = async (event: Event) => {
    event.preventDefault();
    const newEvent = new CustomEvent('dbg-add-column');
    this.dispatchEvent(newEvent);
  }

  #removeColumn = (event: Event, index: number) => {
    event.preventDefault();

    const detail: ColumnRemoveDetail = {
      index,
    };
    const newEvent = new CustomEvent('dbg-remove-column', { detail });
    this.dispatchEvent(newEvent);
  };
}