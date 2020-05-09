import { html, customElement, TemplateResult, LitElement } from 'lit-element';
import { actions as schemaAction } from '../store/slices/schema';
import { actions as fileOpenAction } from '../store/slices/file-open-dialog';
import { actions as setSchemaAction } from '../store/slices/load-schema';
import store from '../store/store';
import { download } from '../util';
import { Schema } from 'db-viewer-component';
import schemaToSqlSchema from '../schema-to-sql-schema';
import { picker as drivePicker } from '../drive';

@customElement('dbg-top-menu-wrapper')
export default class extends LitElement {
  render(): TemplateResult {
    return html`<dbg-top-menu .config="${store.getState().topMenuConfig}" @item-selected="${this.#itemSelected}"></dbg-top-menu>`;
  }

  #getCurrentSchema = (): Schema => {
    return store.getState().schema.present;
  };

  #downloadAsSQLSchema = (): void => {
    const schema = this.#getCurrentSchema();
    const result = schemaToSqlSchema(schema);
    download(result, 'schema.sql', 'text/plain');
  };

  #itemSelected = (event: CustomEvent): void => {
    switch(event.detail.id) {
      case 'new':
        store.dispatch(schemaAction.initiate());
        store.dispatch(setSchemaAction.load());
        break;
      case 'open':
        store.dispatch(fileOpenAction.open());
        break;
      case 'downloadSchema':
        download(JSON.stringify(store.getState().schema.present), 'schema.json', 'application/json');
        break;
      case 'exportSql':
        this.#downloadAsSQLSchema();
        break;
      case 'openGoogleDrive':
        drivePicker();
        break;
      case 'reportIssue':
        {
          const win = window.open('https://github.com/ayeressian/dbgrapher/issues', '_blank');
          win!.focus();
        }
        break;
      case 'gitHub':
        {
          const win = window.open('https://github.com/ayeressian/dbgrapher', '_blank');
          win!.focus();
        }
        break;
      //TODO
    }
  }
}