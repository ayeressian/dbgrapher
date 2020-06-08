import { html, customElement, css, CSSResult, TemplateResult, LitElement } from 'lit-element';
import { actions as setSchemaAction } from '../store/slices/load-schema';
import { actions as schemaAction } from '../store/slices/schema';
import { actions as tableDialogAction } from '../store/slices/create-dialog';
import { actions as dbViewerModeAction } from '../store/slices/db-viewer-mode';
import store from '../store/store';
import { IDbViewerMode } from '../store/slices/db-viewer-mode-interface';
import { subscribe } from '../subscribe-store';
import { isSafari, isMac } from '../util';
import DbViewer, { TableClickEvent, TableDblClickEvent, ViewportClickEvent, Schema } from 'db-viewer-component';
import { ColumnFkSchema } from 'db-viewer-component';
import { classMap } from 'lit-html/directives/class-map';
import { update as updateDrive } from '../drive/google-drive';

@customElement('dbg-db-viewer')
export default class DbWrapper extends LitElement {
  #resolveLoaded?: Function;
  #loaded: Promise<null> = new Promise((resolve) => this.#resolveLoaded = resolve);
  #dbViewer?: DbViewer;
  #relationFirstTableName?: string; 
  #mode: IDbViewerMode = IDbViewerMode.None;

  static get styles(): CSSResult {
    return css`
      :host {
        overflow: auto;
      }
      .safari-height {
        height: calc(100% - 33px);
      }

      db-viewer {
        --font-family: RobotoCondensed;
      }
    `;
  }

  #onTableDblClick = (event: TableDblClickEvent): void => {
    store.dispatch(tableDialogAction.openEdit(event.detail.name));
  };

  #tableCreateListener = (event: ViewportClickEvent): void => {
    store.dispatch(tableDialogAction.openCreate(event.detail));
  };

  #relationFirstClickListener = (event: TableClickEvent): void => {
    this.#dbViewer!.removeEventListener('tableClick', this.#relationFirstClickListener);
    this.#dbViewer!.addEventListener('tableClick', this.#relationSecondClickListener);
    this.#relationFirstTableName = event.detail.name;
  };

  #createRelation = (secondTableName: string): Schema => {
    const schema = this.#dbViewer!.schema;
    const tables = schema!.tables;
    const firstTable = tables.find(table => table.name === this.#relationFirstTableName);
    const secondTable = tables.find(table => table.name === secondTableName);
    const firstTablePks = firstTable!.columns.filter(column => column.pk && (column as ColumnFkSchema).fk == null);
    firstTablePks.forEach(column => {
      const originalRelationName = `fk_${firstTable!.name}_${column.name}`;
      let relationName = originalRelationName;
      let index = 0;
      while (secondTable?.columns.find(column => column.name === relationName) != null) {
        ++index;
        relationName = `${originalRelationName}_${index}`;
      }
      secondTable!.columns.push({
        name: relationName,
        uq: this.#mode === IDbViewerMode.RelationOneToOne || this.#mode === IDbViewerMode.RelationZeroToOne,
        nn: this.#mode === IDbViewerMode.RelationOneToOne || this.#mode === IDbViewerMode.RelationOneToMany,
        fk: {
          table: firstTable!.name,
          column: column.name
        }
      });
    });
    return schema!;
  };

  #relationSecondClickListener = (event: TableClickEvent): void => {
    const secondTableName = event.detail.name;
    const schema = this.#createRelation(secondTableName);
    store.dispatch(schemaAction.set(schema));
    store.dispatch(setSchemaAction.load());
    store.dispatch(dbViewerModeAction.none());
    this.#dbViewer!.removeEventListener('tableClick', this.#relationSecondClickListener);
  };

  #onTableMoveEnd = (): void => {
    store.dispatch(schemaAction.set(this.#dbViewer!.schema!));
    updateDrive();
  };

  firstUpdated(): void {
    this.#dbViewer = this.shadowRoot!.querySelector<DbViewer>('db-viewer')!;
    this.#dbViewer.addEventListener('tableDblClick', this.#onTableDblClick);
    this.#dbViewer.addEventListener('tableMoveEnd', this.#onTableMoveEnd);
    this.#resolveLoaded!();
  }

  #loadSchema = (): void => {
    const state = store.getState();
    if (state.loadSchema) {
      this.#loaded.then(() => {
        this.#dbViewer!.schema = state.schema.present;
        store.dispatch(setSchemaAction.loaded());
      });
    }
  };

  connectedCallback(): void {
    super.connectedCallback();

    this.#loadSchema();

    document.onkeydown = (event: KeyboardEvent): void => {
      if ((event.keyCode === 90 && !event.shiftKey) && ((event.ctrlKey && !isMac) || (event.metaKey && isMac))) {
        store.dispatch(schemaAction.undo());
        store.dispatch(setSchemaAction.load());
      }

      if (((event.keyCode === 90 && event.shiftKey) && ((event.ctrlKey && !isMac) || (event.metaKey && isMac))) || (!isMac && event.ctrlKey)) {
        store.dispatch(schemaAction.redo());
        store.dispatch(setSchemaAction.load());
      }
    };

    subscribe(state => state.loadSchema, this.#loadSchema);

    subscribe(state => state.dbViewerMode, dbViewerMode => {
      this.#mode = dbViewerMode;
      switch(dbViewerMode) {
        case IDbViewerMode.CreateTable:
          this.#dbViewer!.addEventListener('viewportClick', this.#tableCreateListener);
          break;
        case IDbViewerMode.RelationOneToOne:
        case IDbViewerMode.RelationZeroToOne:
        case IDbViewerMode.RelationZeroToMany:
        case IDbViewerMode.RelationOneToMany:
          this.#dbViewer!.addEventListener('tableClick', this.#relationFirstClickListener);
          this.#dbViewer!.removeEventListener('viewportClick', this.#tableCreateListener);
          break;
        default:
          this.#dbViewer!.removeEventListener('viewportClick', this.#tableCreateListener);
          break;
      }
    });
  }

  render(): TemplateResult {
    return html`<db-viewer class="${classMap({'safari-height': isSafari})}"/>`;
  }
}