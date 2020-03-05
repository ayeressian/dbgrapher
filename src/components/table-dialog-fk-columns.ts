import { customElement, LitElement, TemplateResult, html, property } from 'lit-element';

export interface FkColumnChangeEventDetail {
  type: ColChangeEventTypes;
  value: IColumnNoneFkSchema[keyof IColumnNoneFkSchema];
  index: number;
}

type ColChangeEventTypes  = keyof Omit<IColumnFkSchema, 'fk'> | 'fkTable' | 'fkColumn';
@customElement('dbg-table-dialog-fk-columns')
export default class extends LitElement {
  @property( { type : Object } ) schema?: ISchema;
  @property( { type : Number } ) tableIndex?: number;

  private onColumnChange = (type: ColChangeEventTypes, index: number, column: IColumnFkSchema) => {
    let detail: FkColumnChangeEventDetail;
    if (['fkTable', 'fkColumn'].includes(type)) {
      detail = {
        type,
        value: column.fk![type === 'fkTable' ? 'table': 'column'],
        index,
      };
    } else {
      detail = {
        type,
        value: column[type as keyof Omit<IColumnFkSchema, 'fk'>],
        index,
      };
    }
    const event = new CustomEvent('dbg-fk-column-change', { detail });
    this.dispatchEvent(event);
  }

  private renderColumn = (column: IColumnFkSchema, index: number): TemplateResult => {
    
    const onColumnChange = (type: ColChangeEventTypes) => () => this.onColumnChange(type, index, column);
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
            value="${column.uq}"
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
        <td>
          <select
            name="${column.fk?.table}"
            value="${column.fk?.table}"
            @change="${onColumnChange('fkTable')}"
          >
            "${this.schema?.tables.map(({ name }) => {
              return html`<option value=${name}>
                ${name}
              </option>`
            })}"
          </select>
        </td>
        <td>
          <!--<select
            name="${column.fk?.column}"
            onChange={onColChangeLocal('fkColumn', index)}
            value="${column.fk?.column}"
          >
            {getRefColumns(index).map(({ name }, refColumnIndex) => (
              <option key={refColumnIndex} value={name}>
                {name}
              </option>
            ))}
          </select>-->
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
}