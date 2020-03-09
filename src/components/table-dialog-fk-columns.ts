import { customElement, LitElement, TemplateResult, html, property } from 'lit-element';

export interface FkColumnChangeEventDetail {
  column: IColumnFkSchema;
  index: number;
}

@customElement('dbg-table-dialog-fk-columns')
export default class extends LitElement {
  @property( { type : Object } ) schema?: ISchema;
  @property( { type : Number } ) tableIndex?: number;

  private onColumnChange = (index: number, column: IColumnFkSchema) => {
    const detail: FkColumnChangeEventDetail = {
      column,
      index,
    };
    const event = new CustomEvent('dbg-fk-column-change', { detail });
    this.dispatchEvent(event);
  }

  private renderColumn = (column: IColumnFkSchema, index: number): TemplateResult => {
    const onColumnChange = (type: keyof Omit<IColumnFkSchema, 'fk'>) => (event: InputEvent) => {
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
    const onFkTableSelect = (event: InputEvent) => {
      const element = (event.target as HTMLSelectElement);
      column.fk!.table = element.options[element.selectedIndex].value;
      this.onColumnChange(index, column);
      this.requestUpdate();
    };
    const onFkColumnSelect = (event: InputEvent) => {
      const element = (event.target as HTMLSelectElement);
      column.fk!.column = element.options[element.selectedIndex].value;
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
        <td>
          <select
            @change="${onFkTableSelect}"
            .value="${column.fk?.table}"
          >
            ${this.schema?.tables.map(({ name }) => html`<option value=${name}>${name}</option>`)}
          </select>
        </td>
        <td>
          <select
            @change="${onFkColumnSelect}"
            .value="${column.fk?.column}"
          >
            ${this.getFkColumns(column.fk!.table).map(({name}) => html`<option value="${name}">${name}</option>`)}
          </select>
        </td>
      </tr>
    `;
  }

  private renderColumns = (): TemplateResult => {
    const currentTable = this.schema?.tables[this.tableIndex!];
    const result: TemplateResult[] = [];
    currentTable?.columns.forEach((column, index) => {
      if ((column as IColumnFkSchema).fk) {
        result.push(this.renderColumn(column, index));
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
              <th>Foreign Key Columns</th>
            </tr>
            <tr>
              <th>Name</th>
              <th>PK</th>
              <th>UQ</th>
              <th>NN</th>
              <th>Foreign Table</th>
              <th>Foreign Column</th>
            </tr>
          </thead>
          <tbody>${this.renderColumns()}</tbody>
        </table>
        <button @click="${this.addColumn}">Add relation</button>
      </div>`;
  }

  private addColumn = () => {
    const event = new CustomEvent('dbg-add-fk-column');
    this.dispatchEvent(event);
  }

  private getFkColumns = (tableName: string) => {
    const table = this.schema?.tables.find(table => table.name === tableName) ?? this.schema?.tables[this.tableIndex!];
    return table?.columns.filter(({pk, uq, nn}) => pk || (nn && uq)) || [];
  };
}