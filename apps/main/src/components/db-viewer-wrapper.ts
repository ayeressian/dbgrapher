import { html, css, CSSResultGroup, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { actions as setSchemaAction, State } from "../store/slices/load-schema";
import { actions as schemaAction } from "../store/slices/schema";
import { actions as tableDialogAction } from "../store/slices/dialog/table-dialog";
import { actions as dbViewerModeAction } from "../store/slices/db-viewer-mode";
import store from "../store/store";
import DbViewerMode from "../store/slices/db-viewer-mode-type";
import { isMac } from "../util";
import DbViewer, {
  TableClickEvent,
  TableDblClickEvent,
  ViewportClickEvent,
  RelationClickEvent,
  Viewport,
  ColumnSchema,
} from "db-viewer";
import { ColumnFkSchema } from "db-viewer";
import { getDriveProvider } from "../drive/factory";
import { AppState } from "../store/reducer";
import { undo, redo, getDialogsAreClosed } from "./operations";
import { DBGElement } from "./dbg-element";
import DbGrapherSchema from "../db-grapher-schema";
import { hintTimed, HintType } from "../store/slices/hint";

@customElement("dbg-db-viewer")
export default class DbWrapper extends DBGElement {
  #resolveLoaded!: (value: PromiseLike<null> | null) => void;
  #loaded: Promise<null> = new Promise(
    (resolve) => (this.#resolveLoaded = resolve)
  );
  #dbViewer!: DbViewer;
  #relationFirstTableName!: string;
  #relationFirstTableRelations!: ColumnSchema[];
  #mode: DbViewerMode = DbViewerMode.None;

  static get styles(): CSSResultGroup {
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
    this.#relationFirstTableRelations = this.#getFirstTableRelations();
    if (this.#relationFirstTableRelations.length === 0) {
      store.dispatch(dbViewerModeAction.none());
      store.dispatch(hintTimed(HintType.RelationCreationFailedFK));
    }
  };

  #getFirstTableRelations = () => {
    const schema = this.#dbViewer.getSchema();
    const table = schema!.tables.find(
      (table) => table.name === this.#relationFirstTableName
    );
    return table!.columns.filter(
      (column) => column.pk && (column as ColumnFkSchema).fk == null
    );
  };

  #getTableRelations = (tableName: string) => {
    const schema = this.#dbViewer.getSchema() as DbGrapherSchema;
    const table = schema.tables.find((table) => table.name === tableName);
    return table!.columns.filter(
      (column) => column.pk && (column as ColumnFkSchema).fk == null
    );
  };

  #createRelation = (secondTableName: string): DbGrapherSchema => {
    const schema = this.#dbViewer.getSchema() as DbGrapherSchema;
    const { tables } = schema!;
    // const secondTable = tables.find((table) => table.name === secondTableName);
    const firstTable = tables.find(
      (table) => table.name === this.#relationFirstTableName
    );

    const secondTableRelations = this.#getTableRelations(secondTableName);

    secondTableRelations.forEach((column) => {
      const originalRelationName = `fk_${secondTableName}_${column.name}`;
      let relationName = originalRelationName;
      let index = 0;
      while (
        firstTable?.columns.find((column) => column.name === relationName) !=
        null
      ) {
        ++index;
        relationName = `${originalRelationName}_${index}`;
      }
      firstTable?.columns.push({
        name: relationName,
        uq:
          this.#mode === DbViewerMode.RelationOneToOne ||
          this.#mode === DbViewerMode.RelationZeroToOne,
        nn:
          this.#mode === DbViewerMode.RelationOneToOne ||
          this.#mode === DbViewerMode.RelationOneToMany,
        fk: {
          table: secondTableName,
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

    const secondTableRelations = this.#getTableRelations(secondTableName);
    if (secondTableRelations.length === 0) {
      store.dispatch(dbViewerModeAction.none());
      store.dispatch(hintTimed(HintType.RelationCreationFailedFK));
    }
  };

  #onTableMoveEnd = (): void => {
    store.dispatch(
      schemaAction.set(this.#dbViewer.getSchema() as DbGrapherSchema)
    );
    void getDriveProvider().updateFile();
  };

  firstUpdated(): void {
    this.#dbViewer = this.shadowRoot!.querySelector<DbViewer>("db-viewer")!;
    this.#dbViewer.addEventListener("tableDblClick", this.#onTableDblClick);
    this.#dbViewer.addEventListener("tableMoveEnd", this.#onTableMoveEnd);
    this.#resolveLoaded(null);
  }

  #loadSchema = (state: AppState, viewport: Viewport): void => {
    void this.#loaded.then(() => {
      this.#dbViewer.setSchema(state.schema.present, viewport);
      store.dispatch(setSchemaAction.loaded());
    });
  };

  #loadSchemaCheck = (): void => {
    const state = store.getState();
    switch (state.loadSchema) {
      case State.LOAD:
        this.#loadSchema(state, "centerByTables");
        break;
      case State.LOAD_VIEWPORT_UNCHANGE:
        this.#loadSchema(state, "noChange");
        break;
    }
  };

  #onKeyDown = (event: KeyboardEvent): void => {
    if (getDialogsAreClosed() && event.key === "z") {
      if (
        !event.shiftKey &&
        ((event.ctrlKey && !isMac) || (event.metaKey && isMac))
      ) {
        undo();
      }

      if (
        (event.shiftKey &&
          ((event.ctrlKey && !isMac) || (event.metaKey && isMac))) ||
        (!isMac && event.ctrlKey)
      ) {
        redo();
      }
    }
  };

  connectedCallback(): void {
    super.connectedCallback();

    this.#loadSchemaCheck();

    document.addEventListener("keydown", this.#onKeyDown);

    this.subscribe((state) => state.loadSchema, this.#loadSchemaCheck);

    this.subscribe(
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

  disconnectedCallback(): void {
    super.disconnectedCallback();

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
    this.#dbViewer.removeEventListener("relationClick", this.#removeRelation);

    document.removeEventListener("keydown", this.#onKeyDown);
  }

  #removeTable = (event: TableClickEvent): void => {
    const schema = this.#dbViewer.getSchema() as DbGrapherSchema;
    const tableName = event.detail.name;
    schema.tables = schema.tables.filter((table) => table.name !== tableName);
    schema.tables.forEach((table) => {
      table.columns = table.columns.filter(
        (column) => (column as ColumnFkSchema).fk?.table !== tableName
      );
    });
    store.dispatch(schemaAction.set(schema));
    getDriveProvider().updateFile();
    store.dispatch(setSchemaAction.loadViewportUnchange());
  };

  #removeRelation = (event: RelationClickEvent): void => {
    const schema = this.#dbViewer.getSchema() as DbGrapherSchema;
    const fromTable = schema.tables.find(
      (table) => table.name === event.detail.fromTable
    )!;
    fromTable.columns = fromTable.columns.filter(
      (column) => column.name !== event.detail.fromColumn
    );
    store.dispatch(schemaAction.set(schema));
    void getDriveProvider().updateFile();
    store.dispatch(setSchemaAction.loadViewportUnchange());
  };

  render(): TemplateResult {
    return html`<db-viewer></db-viewer>`;
  }
}
