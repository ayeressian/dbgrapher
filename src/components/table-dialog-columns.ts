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
    debugger;
    const event = new CustomEvent('dbg-column-change', { detail });
    this.dispatchEvent(event);
  }

  private renderColumn = (column: IColumnNoneFkSchema, index: number): TemplateResult => {
    const onColumnChange = () => () => this.onColumnChange(index, column);
    return html`
      <tr>
        <td>
          <input
            name="${column.name}"
            @input="${onColumnChange()}"
            .value="${column.name}"
          />
        </td>
        <td>
          <input
            name="${column.type}"
            @input="${onColumnChange()}"
            .value="${column.type}"
          />
        </td>
        <td>
          <input
            name="${column.pk}"
            type='checkbox'
            @change="${onColumnChange()}"
            .value="${column.pk}"
          />
        </td>
        <td>
          <input
            name="${column.uq}"
            type='checkbox'
            @change="${onColumnChange()}"
            .value="${column.pk}"
          />
        </td>
        <td>
          <input
            name="${column.nn}"
            type='checkbox'
            @change="${onColumnChange()}"
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