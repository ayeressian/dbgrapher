import {
  html,
  customElement,
  css,
  CSSResult,
  TemplateResult,
} from "lit-element";
import { actions as setSchemaAction, State } from "../store/slices/load-schema";
import { actions as schemaAction } from "../store/slices/schema";
import { actions as tableDialogAction } from "../store/slices/dialog/table-dialog";
import { actions as dbViewerModeAction } from "../store/slices/db-viewer-mode";
import store from "../store/store";
import DbViewerMode from "../store/slices/db-viewer-mode-type";
import { subscribe } from "../subscribe-store";
import { isMac } from "../util";
import DbViewer, {
  TableClickEvent,
  TableDblClickEvent,
  ViewportClickEvent,
  Viewport,
  RelationClickEvent,
} from "db-viewer-component";
import { ColumnFkSchema } from "db-viewer-component";
import { driveProvider } from "../drive/factory";
import { AppState } from "../store/reducer";
import { FileOpenDialogState } from "../store/slices/dialog/file-open-chooser-dialog";
import { undo, redo } from "./operations";
import { DBGElement } from "./dbg-element";
import DbGrapherSchema from "../db-grapher-schema";

@customElement("dbg-db-viewer")
export default class DbWrapper extends DBGElement {
  #resolveLoaded!: () => void;
  #loaded: Promise<null> = new Promise(
    (resolve) => (this.#resolveLoaded = resolve)
  );
  #dbViewer!: DbViewer;
  #relationFirstTableName!: string;
  #mode: DbViewerMode = DbViewerMode.None;

  static get styles(): CSSResult {
    return css`
      :host {
        overflow: auto;
      }

      db-viewer {
        height: 100%;
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
    this.#dbViewer.removeEventListener(
      "tableClick",
      this.#relationFirstClickListener
    );
    this.#dbViewer.addEventListener(
      "tableClick",
      this.#relationSecondClickListener
    );
    this.#relationFirstTableName = event.detail.name;
  };

  #createRelation = (secondTableName: string): DbGrapherSchema => {
    const schema = this.#dbViewer.schema as DbGrapherSchema;
    const tables = schema!.tables;
    const firstTable = tables.find(
      (table) => table.name === this.#relationFirstTableName
    );
    const secondTable = tables.find((table) => table.name === secondTableName);
    const firstTablePks = firstTable!.columns.filter(
      (column) => column.pk && (column as ColumnFkSchema).fk == null
    );
    firstTablePks.forEach((column) => {
      const originalRelationName = `fk_${firstTable!.name}_${column.name}`;
      let relationName = originalRelationName;
      let index = 0;
      while (
        secondTable?.columns.find((column) => column.name === relationName) !=
        null
      ) {
        ++index;
        relationName = `${originalRelationName}_${index}`;
      }
      secondTable!.columns.push({
        name: relationName,
        uq:
          this.#mode === DbViewerMode.RelationOneToOne ||
          this.#mode === DbViewerMode.RelationZeroToOne,
        nn:
          this.#mode === DbViewerMode.RelationOneToOne ||
          this.#mode === DbViewerMode.RelationOneToMany,
        fk: {
          table: firstTable!.name,
          column: column.name,
        },
      });
    });
    return schema!;
  };

  #relationSecondClickListener = (event: TableClickEvent): void => {
    const secondTableName = event.detail.name;
    const schema = this.#createRelation(secondTableName);
    store.dispatch(schemaAction.set(schema));
    store.dispatch(setSchemaAction.loadViewportUnchange());
    store.dispatch(dbViewerModeAction.none());
    this.#dbViewer.removeEventListener(
      "tableClick",
      this.#relationSecondClickListener
    );
  };

  #onTableMoveEnd = (): void => {
    store.dispatch(schemaAction.set(this.#dbViewer.schema as DbGrapherSchema));
    void driveProvider.updateFile();
  };

  firstUpdated(): void {
    this.#dbViewer = this.shadowRoot!.querySelector<DbViewer>("db-viewer")!;
    this.#dbViewer.addEventListener("tableDblClick", this.#onTableDblClick);
    this.#dbViewer.addEventListener("tableMoveEnd", this.#onTableMoveEnd);
    this.#resolveLoaded();
  }

  #loadSchema = (state: AppState, viewport: Viewport): void => {
    void this.#loaded.then(() => {
      this.#dbViewer.viewport = viewport;
      this.#dbViewer.schema = state.schema.present;
      store.dispatch(setSchemaAction.loaded());
    });
  };

  #loadSchemaCheck = (): void => {
    const state = store.getState();
    switch (state.loadSchema) {
      case State.LOAD:
        this.#loadSchema(state, Viewport.centerByTables);
        break;
      case State.LOAD_VIEWPORT_UNCHANGE:
        this.#loadSchema(state, Viewport.noChange);
        break;
    }
  };

  #isDialogOpen = (): boolean => {
    const stateDialog = store.getState().dialog;
    return (
      stateDialog.dialogs.aboutDialog ||
      stateDialog.dialogs.cloudProviderChooserDialog ||
      stateDialog.fileOpenChooserDialog !== FileOpenDialogState.Close ||
      stateDialog.dialogs.newOpenDialog ||
      stateDialog.tableDialog.open
    );
  };

  connectedCallback(): void {
    super.connectedCallback();

    this.#loadSchemaCheck();

    document.onkeydown = (event: KeyboardEvent): void => {
      if (!this.#isDialogOpen()) {
        if (
          event.keyCode === 90 &&
          !event.shiftKey &&
          ((event.ctrlKey && !isMac) || (event.metaKey && isMac))
        ) {
          undo();
        }

        if (
          (event.keyCode === 90 &&
            event.shiftKey &&
            ((event.ctrlKey && !isMac) || (event.metaKey && isMac))) ||
          (!isMac && event.ctrlKey)
        ) {
          redo();
        }
      }
    };

    subscribe((state) => state.loadSchema, this.#loadSchemaCheck);

    subscribe(
      (state) => state.dbViewerMode,
      (dbViewerMode) => {
        this.#mode = dbViewerMode;
        switch (dbViewerMode) {
          case DbViewerMode.CreateTable:
            this.#dbViewer.addEventListener(
              "viewportClick",
              this.#tableCreateListener
            );
            this.#dbViewer.removeEventListener(
              "tableClick",
              this.#relationFirstClickListener
            );
            this.#dbViewer.removeEventListener(
              "tableClick",
              this.#relationSecondClickListener
            );
            this.#dbViewer.removeEventListener("tableClick", this.#removeTable);
            this.#dbViewer.removeEventListener(
              "relationClick",
              this.#removeRelation
            );
            break;
          case DbViewerMode.RelationOneToOne:
          case DbViewerMode.RelationZeroToOne:
          case DbViewerMode.RelationZeroToMany:
          case DbViewerMode.RelationOneToMany:
            this.#dbViewer.addEventListener(
              "tableClick",
              this.#relationFirstClickListener
            );
            this.#dbViewer.removeEventListener(
              "viewportClick",
              this.#tableCreateListener
            );
            this.#dbViewer.removeEventListener(
              "tableClick",
              this.#relationSecondClickListener
            );
            this.#dbViewer.removeEventListener("tableClick", this.#removeTable);
            this.#dbViewer.removeEventListener(
              "relationClick",
              this.#removeRelation
            );
            break;
          case DbViewerMode.Remove:
            this.#dbViewer.addEventListener("tableClick", this.#removeTable);
            this.#dbViewer.addEventListener(
              "relationClick",
              this.#removeRelation
            );
            this.#dbViewer.removeEventListener(
              "viewportClick",
              this.#tableCreateListener
            );
            this.#dbViewer.removeEventListener(
              "tableClick",
              this.#relationFirstClickListener
            );
            this.#dbViewer.removeEventListener(
              "tableClick",
              this.#relationSecondClickListener
            );
            break;
          default:
            this.#dbViewer.removeEventListener(
              "viewportClick",
              this.#tableCreateListener
            );
            this.#dbViewer.removeEventListener(
              "tableClick",
              this.#relationFirstClickListener
            );
            this.#dbViewer.removeEventListener(
              "tableClick",
              this.#relationSecondClickListener
            );
            this.#dbViewer.removeEventListener("tableClick", this.#removeTable);
            this.#dbViewer.removeEventListener(
              "relationClick",
              this.#removeRelation
            );
            break;
        }
      }
    );
  }

  #removeTable = (event: TableClickEvent): void => {
    const schema = this.#dbViewer.schema as DbGrapherSchema;
    const tableName = event.detail.name;
    schema.tables = schema.tables.filter((table) => table.name !== tableName);
    schema.tables.forEach((table) => {
      table.columns = table.columns.filter(
        (column) => (column as ColumnFkSchema).fk?.table !== tableName
      );
    });
    store.dispatch(schemaAction.set(schema));
    driveProvider.updateFile();
    store.dispatch(setSchemaAction.loadViewportUnchange());
  };

  #removeRelation = (event: RelationClickEvent): void => {
    const schema = this.#dbViewer.schema as DbGrapherSchema;
    const fromTable = schema.tables.find(
      (table) => table.name === event.detail.fromTable
    )!;
    fromTable.columns = fromTable.columns.filter(
      (column) => column.name !== event.detail.fromColumn
    );
    store.dispatch(schemaAction.set(schema));
    void driveProvider.updateFile();
    store.dispatch(setSchemaAction.loadViewportUnchange());
  };

  render(): TemplateResult {
    return html`<db-viewer />`;
  }
}
