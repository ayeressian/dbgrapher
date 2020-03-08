import { customElement, LitElement, TemplateResult, html, property } from 'lit-element';

export interface ColumnChangeEventDetail {
  column: IColumnNoneFkSchema;
  index: number;
}
@customElement('dbg-table-dialog-columns')
export default class extends LitElement {
  @property( { type : Object } ) schema?: ISchema;
  @property( { type : Number } ) tableIndex?: number;

  private onColumnChange = (index: number, column: IColumnNoneFkSchema) => {
    const detail: ColumnChangeEventDetail = {
      column,
      index,
    };
    const event = new CustomEvent('dbg-column-change', { detail });
    this.dispatchEvent(event);
  }

  private renderColumn = (column: IColumnNoneFkSchema, index: number): TemplateResult => {
    const onColumnChange = (type: keyof IColumnNoneFkSchema) => (event: InputEvent) => {
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
      
      this.onColumnChange(index, column);
    };
    return html`
      <tr>
        <td>
          <input
            @input="${onColumnChange('name')}"
            .value="${column.name}"
          />
        </td>
        <td>
          <input
            @input="${onColumnChange('type')}"
            .value="${column.type}"
          />
        </td>
        <td>
          <input
            type='checkbox'
            @change="${onColumnChange('pk')}"
            .value="${column.pk}"
          />
        </td>
        <td>
          <input
            type='checkbox'
            @change="${onColumnChange('uq')}"
            .value="${column.uq}"
          />
        </td>
        <td>
          <input
            type='checkbox'
            @change="${onColumnChange('nn')}"
            .value="${column.nn}"
          />
        </td>
      </tr>
    `;
  }

  private renderColumns = (): TemplateResult => {
    const currentTable = this.schema?.tables[this.tableIndex!];
    const result: TemplateResult[] = [];
    currentTable?.columns.forEach((column, index) => {
      if (!(column as IColumnFkSchema).fk) {
        result.push(this.renderColumn(column as IColumnNoneFkSchema, index));
      }
    });
    return html`${result}`;
  }
  
  render(): TemplateResult {
    return html`
      <div>
        <table class="table">
          <thead>
            <tr>
              <th>Columns</th>
            </tr>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>PK</th>
              <th>UQ</th>
              <th>NN</th>
              <th/>
            </tr>
          </thead>
          <tbody>${this.renderColumns()}</tbody>
        </table>
        <button @click="${this.addColumn}">Add column</button>
      </div>`;
  }

  private addColumn = () => {
    const event = new CustomEvent('dbg-add-column');
    this.dispatchEvent(event);
  }
}