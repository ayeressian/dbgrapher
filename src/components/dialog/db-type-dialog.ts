import {
  html,
  customElement,
  TemplateResult,
  internalProperty,
} from "lit-element";
import mssql from "../../../asset/mssql.svg";
import mysql from "../../../asset/mysql.svg";
import postgresql from "../../../asset/postgresql.svg";
import sqlite from "../../../asset/sqlite.svg";
import db from "../../../asset/db.svg";
import { subscribe } from "../../subscribe-store";
import { t } from "../../localization";
import { DBGElement } from "../dbg-element";
import { actions as schemaActions } from "../../store/slices/schema";
import {
  actions as dbTypeDialogActions,
  DbTypeDialogState,
} from "../../store/slices/dialog/db-type-dialog";
import {
  actions as dialogActions,
  DialogTypes,
} from "../../store/slices/dialog/dialogs";
import { DbType } from "../../db-grapher-schema";
import store from "../../store/store";
import { actions as setSchemaAction } from "../../store/slices/load-schema";

@customElement("dbg-db-type-dialog")
export default class extends DBGElement {
  @internalProperty()
  private open = store.getState().dialog.dbTypeDialog;

  @internalProperty()
  private selectedDbType!: DbType;

  connectedCallback(): void {
    super.connectedCallback();

    subscribe(
      (state) => state.dialog.dbTypeDialog,
      (open) => (this.open = open)
    );

    subscribe(
      (state) => state.schema.present.dbGrapher?.type,
      (dbType) => (this.selectedDbType = dbType)
    );
  }

  render(): TemplateResult {
    return html`
      <dbg-dialog
        ?show=${this.open !== DbTypeDialogState.Close}
        ?showBack=${this.open === DbTypeDialogState.OpenFromWizard}
        ?showClose=${this.open === DbTypeDialogState.OpenFromTopMenu}
        @dbg-on-close=${this.#close}
        @dbg-on-back=${this.#back}
        @dbg-on-escape=${this.#close}
        centerTitle=${t((l) => l.dialog.dbType.title)}
      >
        <div slot="body">
          <dbg-dialog-operations>
            <dbg-dialog-operation
              @dbg-click=${this.#mssql}
              text=${t((l) => l.dialog.dbType.mssql)}
              icon=${mssql}
              ?selected=${this.selectedDbType === DbType.Mssql}
            ></dbg-dialog-operation>
            <dbg-dialog-operation
              @dbg-click=${this.#mysql}
              text=${t((l) => l.dialog.dbType.mysql)}
              icon=${mysql}
              ?selected=${this.selectedDbType === DbType.Mysql}
            ></dbg-dialog-operation>
            <dbg-dialog-operation
              @dbg-click=${this.#postgresql}
              text=${t((l) => l.dialog.dbType.postgresql)}
              icon=${postgresql}
              ?selected=${this.selectedDbType === DbType.Postgresql}
            ></dbg-dialog-operation>
            <dbg-dialog-operation
              @dbg-click=${this.#sqlite}
              text=${t((l) => l.dialog.dbType.sqlite)}
              icon=${sqlite}
              ?selected=${this.selectedDbType === DbType.Sqlite}
            ></dbg-dialog-operation>
            <dbg-dialog-operation
              @dbg-click=${this.#generic}
              text=${t((l) => l.dialog.dbType.generic)}
              icon=${db}
              ?selected=${this.selectedDbType === DbType.Generic}
            ></dbg-dialog-operation>
          </dbg-dialog-operations>
        </div>
      </dbg-dialog>
    `;
  }

  #closeAndLoad = (): void => {
    store.dispatch(dbTypeDialogActions.close());
    store.dispatch(setSchemaAction.load());
  };

  #mssql = (): void => {
    store.dispatch(schemaActions.setDbType(DbType.Mssql));
    this.#closeAndLoad();
  };

  #mysql = (): void => {
    store.dispatch(schemaActions.setDbType(DbType.Mysql));
    this.#closeAndLoad();
  };

  #postgresql = (): void => {
    store.dispatch(schemaActions.setDbType(DbType.Postgresql));
    this.#closeAndLoad();
  };

  #sqlite = (): void => {
    store.dispatch(schemaActions.setDbType(DbType.Sqlite));
    this.#closeAndLoad();
  };

  #generic = (): void => {
    store.dispatch(schemaActions.setDbType(DbType.Generic));
    this.#closeAndLoad();
  };

  #close = (): void => {
    if (this.open === DbTypeDialogState.OpenFromTopMenu) {
      store.dispatch(dbTypeDialogActions.close());
    }
  };

  #back = (): void => {
    store.dispatch(dbTypeDialogActions.close());
    store.dispatch(dialogActions.open(DialogTypes.NewOpenDialog));
  };
}
