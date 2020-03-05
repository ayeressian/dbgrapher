import { customElement, LitElement, TemplateResult, html, property } from 'lit-element';

export interface ColumnChangeEventDetail<T extends keyof IColumnNoneFkSchema = keyof IColumnNoneFkSchema> {
  type: T;
  value: IColumnNoneFkSchema[T];
  index: number;
}
@customElement('dbg-table-dialog-columns')
export default class extends LitElement {
  @property( { type : Object } ) schema?: ISchema;
  @property( { type : Number } ) tableIndex?: number;

  private onColumnChange = (type: keyof IColumnNoneFkSchema, index: number, column: IColumnNoneFkSchema) => {
    const detail: ColumnChangeEventDetail = {
      type,
      value: column[type],
      index,
    };
    const event = new CustomEvent('dbg-fk-column-change', { detail });
    this.dispatchEvent(event);
  }

  private renderColumn = (column: IColumnNoneFkSchema, index: number): TemplateResult => {
    const onColumnChange = (type: keyof IColumnNoneFkSchema) => () => this.onColumnChange(type, index, column);
    return html`
      <tr>
        <td>
          <input
            name="${column.name}"
            @change="${onColumnChange('name')}"
            value="${column.name}"
          />
        </td>
        <td>
          <input
            name="${column.type}"
            @change="${onColumnChange('type')}"
            value="${column.type}"
          />
        </td>
        <td>
          <input
            name="${column.pk}"
            type='checkbox'
            @change="${onColumnChange('pk')}"
            value="${column.pk}"
          />
        </td>
        <td>
          <input
            name="${column.uq}"
            type='checkbox'
            @change="${onColumnChange('uq')}"
            value="${column.pk}"
          />
        </td>
        <td>
          <input
            name="${column.nn}"
            type='checkbox'
            @change="${onColumnChange('nn')}"
            value="${column.nn}"
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
    const event = new CustomEvent('dbg-add-fk-column');
    this.dispatchEvent(event);
  }
}