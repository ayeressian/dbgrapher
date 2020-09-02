import {
  html,
  customElement,
  css,
  CSSResult,
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
  actions as dialogActions,
  DialogTypes,
} from "../../store/slices/dialog/dialogs";
import { DbType } from "../../db-grapher-schema";
import store from "../../store/store";
import { actions as setSchemaAction } from "../../store/slices/load-schema";

@customElement("dbg-db-type-dialog")
export default class extends DBGElement {
  @internalProperty()
  private open = store.getState().dialog.dialogs.dbTypeDialog;

  static get styles(): CSSResult {
    return css`
      .operations {
        display: flex;
        flex-direction: horizontal;
      }
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();

    subscribe(
      (state) => state.dialog.dialogs.dbTypeDialog,
      (open) => {
        this.open = open;
      }
    );
  }

  render(): TemplateResult {
    return html`
      <dbg-dialog
        ?show=${this.open}
        centerTitle=${t((l) => l.dialog.dbType.title)}
      >
        <div slot="body">
          <div class="operations">
            <dbg-dialog-operation
              @dbg-click=${this.#mssql}
              text=${t((l) => l.dialog.dbType.mssql)}
              icon=${mssql}
            ></dbg-dialog-operation>
            <dbg-dialog-operation
              @dbg-click=${this.#mysql}
              text=${t((l) => l.dialog.dbType.mysql)}
              icon=${mysql}
            ></dbg-dialog-operation>
            <dbg-dialog-operation
              @dbg-click=${this.#postgresql}
              text=${t((l) => l.dialog.dbType.postgresql)}
              icon=${postgresql}
            ></dbg-dialog-operation>
            <dbg-dialog-operation
              @dbg-click=${this.#sqlite}
              text=${t((l) => l.dialog.dbType.sqlite)}
              icon=${sqlite}
            ></dbg-dialog-operation>
            <dbg-dialog-operation
              @dbg-click=${this.#generic}
              text=${t((l) => l.dialog.dbType.generic)}
              icon=${db}
            ></dbg-dialog-operation>
          </div>
        </div>
      </dbg-dialog>
    `;
  }

  #closeAndLoad = (): void => {
    store.dispatch(dialogActions.close(DialogTypes.DbTypeDialog));
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
}
