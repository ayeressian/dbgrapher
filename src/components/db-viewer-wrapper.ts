import { html, customElement, css, CSSResult, TemplateResult, LitElement } from 'lit-element';
import { actions as setSchemaAction } from '../store/slices/load-schema';
import { actions as schemaAction } from '../store/slices/schema';
import { actions as tableDialogAction } from '../store/slices/create-dialog';
import { actions as dbViewerModeAction } from '../store/slices/db-viewer-mode';
import store from '../store/store';
import { IDbViewerMode } from '../store/slices/db-viewer-mode-interface';
import { subscribe } from '../subscribe-store';
import { isMac } from '../util';
import DbViewer, { TableClickEvent, TableDblClickEvent, ViewportClickEvent } from 'db-viewer-component';

@customElement('dbg-db-viewer')
export default class DbWrapper extends LitElement {
  #resolveLoaded?: Function;
  #loaded: Promise<null> = new Promise((resolve) => this.#resolveLoaded = resolve);
  #dbViewer?: DbViewer;
  #relationFirstTableName?: string; 

  static get styles(): CSSResult {
    return css`
      :host {
        overflow: auto;
        width: 100%;
        height: 100%;
      }
    `;
  }

  #onTableDblClick = (event: TableDblClickEvent) => {
    store.dispatch(tableDialogAction.openEdit(event.detail.name));
  };

  #tableCreateListener = (event: ViewportClickEvent) => {
    store.dispatch(tableDialogAction.openCreate(event.detail));
  };

  #relationFirstClickListener = (event: TableClickEvent) => {
    this.#dbViewer!.removeEventListener('tableClick', this.#relationFirstClickListener as EventListener);
    this.#dbViewer!.addEventListener('tableClick', this.#relationSecondClickListener as EventListener);
    this.#relationFirstTableName = event.detail.name;
  };

  #relationSecondClickListener = (event: TableClickEvent): void => {
    const secondTableName = event.detail.name;
    const schema = this.#dbViewer!.schema;
    const tables = schema!.tables;
    const firstTable = tables.find(table => table.name === this.#relationFirstTableName);
    const secondTable = tables.find(table => table.name === secondTableName);
    const firstTablePks = firstTable!.columns.filter(column => column.pk);
    firstTablePks.forEach(column => secondTable!.columns.push({
      name: `fk_${firstTable!.name}_${column.name}`,
      fk: {
        table: firstTable!.name,
        column: column.name
      }
    }));
    store.dispatch(schemaAction.set(schema!));
    store.dispatch(setSchemaAction.load());
    store.dispatch(dbViewerModeAction.none());
  };

  #onTableMoveEnd = () => {
    store.dispatch(schemaAction.set(this.#dbViewer!.schema!));
  };

  firstUpdated() {
    this.#dbViewer = this.shadowRoot!.querySelector<DbViewer>('db-viewer')!;
    this.#dbViewer.addEventListener('tableDblClick', this.#onTableDblClick as EventListener);
    this.#dbViewer.addEventListener('tableMoveEnd', this.#onTableMoveEnd as EventListener);
    this.#resolveLoaded!();
  }

  connectedCallback() {
    super.connectedCallback();

    document.onkeydown = (event: KeyboardEvent) => {
      if ((event.keyCode === 90 && !event.shiftKey) && ((event.ctrlKey && !isMac) || (event.metaKey && isMac))) {
        store.dispatch(schemaAction.undo());
        store.dispatch(setSchemaAction.load());
      }

      if (((event.keyCode === 90 && event.shiftKey) && ((event.ctrlKey && !isMac) || (event.metaKey && isMac))) || (!isMac && event.ctrlKey)) {
        store.dispatch(schemaAction.redo());
        store.dispatch(setSchemaAction.load());
      }
    };

    subscribe(state => state.loadSchema, (loadSchema, state) => {
      if (loadSchema) {
        this.#loaded.then(() => {
          this.#dbViewer!.schema = state.schema.present;
          store.dispatch(setSchemaAction.loaded());
        });
      }
    });

    subscribe(state => state.dbViewerMode, dbViewerMode => {
      switch(dbViewerMode) {
        case IDbViewerMode.Create:
          this.#dbViewer!.addEventListener('viewportClick', this.#tableCreateListener as EventListener);
          break;
        case IDbViewerMode.Relation:
          this.#dbViewer!.addEventListener('tableClick', this.#relationFirstClickListener as EventListener);
          this.#dbViewer!.removeEventListener('viewportClick', this.#tableCreateListener as EventListener);
          break;
        default:
          this.#dbViewer!.removeEventListener('viewportClick', this.#tableCreateListener as EventListener);
          break;
      }
    });
  }

  render(): TemplateResult {
    return html`<db-viewer/>`;
  }
}