import { customElement, LitElement, TemplateResult, html, property } from 'lit-element';

@customElement('dbg-table-dialog-columns')
export default class extends LitElement {
  @property( { type : Object } ) schema?: ISchema;
  @property( { type : Number } ) tableIndex?: number;

  private renderColumn = (column: IColumnNoneFkSchema): TemplateResult => {
    return html`
      <tr>
        <td>
          <input
            name="${column.name}"
            onChange={onColChangeLocal('name', index)}
            value={column.name}
          />
        </td>
        <td>
          <input
            name="${column.type}"
            onChange={onColChangeLocal('type', index)}
            value={(column as IColumnNoneFkSchema).type}
          />
        </td>
        <td>
          <input
            name="${column.pk}"
            type='checkbox'
            onChange={onColChangeLocal('pk', index)}
            checked={column.pk}
          />
        </td>
        <td>
          <input
            name="${column.uq}"
            type='checkbox'
            onChange={onColChangeLocal('uq', index)}
            checked={column.uq}
          />
        </td>
        <td>
          <input
            name="${column.nn}
            type='checkbox'
            onChange={onColChangeLocal('nn', index)}
            checked={column.nn}
          />
        </td>
      </tr>
    `;
  }

  private renderColumns = (): TemplateResult => {
    const currentTable = this.schema?.tables[this.tabIndex];
    const noneFkColumns = (currentTable?.columns ?? []).filter((column): column is IColumnNoneFkSchema => !(column as IColumnFkSchema).fk);
    
    return html`${noneFkColumns.map(column => this.renderColumn(column))}`;
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

  }
}