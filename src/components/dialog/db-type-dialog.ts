import {
  html,
  customElement,
  css,
  CSSResult,
  TemplateResult,
  unsafeCSS,
  internalProperty,
} from "lit-element";
import mssql from "../../../asset/mssql.svg";
import mysql from "../../../asset/mysql.svg";
import postgresql from "../../../asset/postgresql.svg";
import sqlite from "../../../asset/sqlite.svg";
import db from "../../../asset/db.svg";
import commonStyles from "../common-icon-dialog-styling";
import { subscribe } from "../../subscribe-store";
import { t } from "../../localization";
import { DBGElement } from "../dbg-element";
import { actions as schemaActions } from "../../store/slices/schema";
import { actions as dbTypeDialogActions } from "../../store/slices/dialog/db-type-dialog";
import { DbType } from "../../db-grapher-schema";
import store from "../../store/store";
import { actions as setSchemaAction } from "../../store/slices/load-schema";

@customElement("dbg-db-type-dialog")
export default class extends DBGElement {
  @internalProperty()
  private open = false;

  static get styles(): CSSResult {
    return css`
      ${commonStyles}

      .mssql {
        width: 95px;
        background-image: url(${unsafeCSS(mssql)});
      }

      .mysql {
        width: 98px;
        background-image: url(${unsafeCSS(mysql)});
      }

      .postgresql {
        width: 91px;
        height: 93px;
        background-image: url(${unsafeCSS(postgresql)});
      }

      .sqlite {
        width: 91px;
        background-image: url(${unsafeCSS(sqlite)});
      }

      .generic {
        width: 99px;
        background-image: url(${unsafeCSS(db)});
      }

      .operations {
        display: flex;
        flex-direction: horizontal;
      }
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();

    subscribe(
      (state) => state.dialog.dbTypeDialog,
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
            <div class="operation-container" @click="${this.#mssql}">
              <div class="operation-icon-container">
                <div class="mssql operation-icon"></div>
              </div>
              <h4 class="operation" id="mssql">
                ${t((l) => l.dialog.dbType.mssql)}
              </h4>
            </div>
            <div class="operation-container" @click="${this.#mysql}">
              <div class="operation-icon-container">
                <div class="mysql operation-icon"></div>
              </div>
              <h4 class="operation" id="mysql">
                ${t((l) => l.dialog.dbType.mysql)}
              </h4>
            </div>
            <div class="operation-container" @click="${this.#postgresql}">
              <div class="operation-icon-container">
                <div class="postgresql operation-icon"></div>
              </div>
              <h4 class="operation" id="postgresql">
                ${t((l) => l.dialog.dbType.postgresql)}
              </h4>
            </div>
            <div class="operation-container" @click="${this.#sqlite}">
              <div class="operation-icon-container">
                <div class="sqlite operation-icon"></div>
              </div>
              <h4 class="operation" id="sqlite">
                ${t((l) => l.dialog.dbType.sqlite)}
              </h4>
            </div>
            <div class="operation-container" @click="${this.#generic}">
              <div class="operation-icon-container">
                <div class="generic operation-icon"></div>
              </div>
              <h4 class="operation" id="generic">
                ${t((l) => l.dialog.dbType.generic)}
              </h4>
            </div>
          </div>
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
}
