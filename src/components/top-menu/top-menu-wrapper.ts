import { html, TemplateResult, CSSResultGroup, css, unsafeCSS } from "lit";
import {
  actions as dialogActions,
  DialogTypes,
} from "../../store/slices/dialog/dialogs";
import {
  actions as dbTypeDialogActions,
  DbTypeDialogState,
} from "../../store/slices/dialog/db-type-dialog";
import store from "../../store/store";
import { download } from "../../util";
import schemaToSqlSchema from "../../schema-to-sql-schema";
import { classMap } from "lit/directives/class-map";
import buttonCss from "purecss/build/buttons-min.css";
import {
  CloudState,
  CloudProvider,
  CloudUpdateState,
} from "../../store/slices/cloud";
import topMenuConfig from "./top-menu-config";
import ColorHash from "color-hash";
import { styleMap } from "lit/directives/style-map";
import { getDriveProvider } from "../../drive/factory";
import { FileNameUpdateEvent } from "./file-name-popup";
import { undo, redo, newFile, openFile } from "../operations";
import { DBGElement } from "../dbg-element";
import { t } from "../../localization";
import providerName from "./cloud-provider-name";
import UserCancelGeneration from "../../user-cancel-generation";
import DbGrapherSchema from "../../db-grapher-schema";
import { actions as schemaActions } from "../../store/slices/schema";
import { actions as loadSchemaActions } from "../../store/slices/load-schema";
import { customElement, state } from "lit/decorators";

const colorHash = new ColorHash({ saturation: 0.5 });
@customElement("dbg-top-menu-wrapper")
export default class extends DBGElement {
  @state()
  private openAccountPopup = false;

  @state()
  private openFileRenamePopup = false;

  @state()
  private fileName!: string;

  @state()
  private cloudState: CloudState = store.getState().cloud;

  #accountPopup!: HTMLElement;
  #error = false;

  static get styles(): CSSResultGroup {
    return css`
      ${unsafeCSS(buttonCss)}

      .menu {
        display: flex;
        justify-content: center;
        padding-left: 0;
      }

      [slot="center"],
      [slot="right"] {
        height: 33px;
        line-height: 33px;
      }

      [slot="center"] {
        padding: 0 8px 0 8px;
      }

      [slot="center"]:hover,
      [slot="right"]:hover {
        background-color: #bfbfbf;
      }

      .hide {
        display: none;
      }

      .user_picture {
        width: 33px;
        height: 33px;
      }

      .user_picture_initial {
        width: 33px;
        height: 33px;
        text-align: center;
        color: white;
      }

      .error {
        color: #b00020;
      }
    `;
  }

  #hideCenterAndRight = (): boolean =>
    this.cloudState.provider === CloudProvider.Local ||
    this.cloudState.userData?.name == null;

  render(): TemplateResult {
    const cloudState = store.getState().cloud;
    let centerText;
    this.#error = false;
    const translationParams = {
      fileName: this.fileName,
      providerName: providerName(),
    };
    switch (cloudState.updateState) {
      case CloudUpdateState.None:
        centerText = this.fileName;
        break;
      case CloudUpdateState.Saved:
        centerText = t((l) => l.topMenu.centerText.saved, translationParams);
        break;
      case CloudUpdateState.Saving:
        centerText = t((l) => l.topMenu.centerText.saving, translationParams);
        break;
      case CloudUpdateState.NetworkError:
        this.#error = true;
        centerText = t(
          (l) => l.topMenu.centerText.networkError,
          translationParams
        );
        break;
    }

    return html`
      <dbg-top-menu
        .config="${topMenuConfig()}"
        @item-selected="${this.#itemSelected}"
      >
        <div
          slot="center"
          class="${classMap({
            hide: this.#hideCenterAndRight() || this.fileName == null,
            error: this.#error,
          })}"
          @click="${this.#onCenterClick}"
        >
          ${centerText}
        </div>

        <div
          slot="right"
          class="${classMap({ hide: this.#hideCenterAndRight() })}"
          @click="${this.#onAccountClick}"
        >
          ${cloudState.userData?.picture
            ? html`<img
                class="user_picture"
                src=${cloudState.userData?.picture}
              />`
            : html`<div
                class="user_picture_initial"
                style=${styleMap({
                  backgroundColor: colorHash.hex(
                    cloudState.userData?.name ?? ""
                  ),
                })}
              >
                ${cloudState.userData?.name.charAt(0)}
              </div>`}
        </div>
      </dbg-top-menu>

      ${this.openFileRenamePopup
        ? html`<dbg-file-rename-popup
            fileName="${cloudState.fileName}"
            @dbg-file-rename=${this.#onfileRename}
          ></dbg-file-rename-popup>`
        : html``}

      <dbg-top-menu-account-popup
        class="${classMap({ hide: !this.openAccountPopup })}"
        .cloudState=${cloudState}
        @dbg-logout="${this.#logout}"
      ></dbg-top-menu-account-popup>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.subscribe(
      (state) => state.cloud,
      (cloudState) => {
        this.cloudState = cloudState;
        this.fileName = cloudState.fileName!;
      }
    );

    document.addEventListener("click", this.#onDocumentClick, true);
    document.addEventListener("keydown", this.#onEscape);
  }

  disconnectedCallback(): void {
    document.removeEventListener("click", this.#onDocumentClick, true);
    document.removeEventListener("keydown", this.#onEscape);
  }

  #logout = (): void => {
    this.openAccountPopup = false;
    void getDriveProvider().logout();
  };

  firstUpdated(): void {
    this.#accountPopup = this.shadowRoot!.querySelector(
      "dbg-top-menu-account-popup"
    ) as HTMLElement;
  }

  #onfileRename = (event: FileNameUpdateEvent): void => {
    void getDriveProvider().renameFile(event.detail.newFileName);
    this.openFileRenamePopup = false;
  };

  #onDocumentClick = (event: MouseEvent): void => {
    if (event.composed) {
      const fileNamePopup = this.shadowRoot!.querySelector(
        "dbg-file-rename-popup"
      ) as HTMLElement;
      if (
        !event.composedPath().includes(fileNamePopup) &&
        this.openFileRenamePopup
      ) {
        this.openFileRenamePopup = false;
      }

      if (
        !event.composedPath().includes(this.#accountPopup) &&
        this.openAccountPopup
      ) {
        this.openAccountPopup = false;
      }
    }
  };

  #getCurrentSchema = (): DbGrapherSchema => {
    return store.getState().schema.present;
  };

  #downloadAsSQLSchema = async (): Promise<void> => {
    const schema = this.#getCurrentSchema();
    try {
      const result = await schemaToSqlSchema(schema);
      if (result === "") {
        alert(t((l) => l.error.emptySchemaDownload));
      } else {
        download(result, "schema.sql", "text/plain");
      }
    } catch (ex) {
      if (ex.constructor !== UserCancelGeneration) throw ex;
    }
  };

  #increaseViewSize = (): void => {
    store.dispatch(schemaActions.increaseViewSize());
    store.dispatch(loadSchemaActions.loadViewportUnchange());
  };

  #decreaseViewSize = (): void => {
    store.dispatch(schemaActions.decreaseViewSize());
    store.dispatch(loadSchemaActions.loadViewportUnchange());
  };

  #itemSelected = (event: CustomEvent): void => {
    const driveProvider = getDriveProvider();
    switch (event.detail.id) {
      case "new":
        newFile();
        break;
      case "open":
        openFile();
        break;
      case "save":
        driveProvider.save();
        break;
      case "saveAs":
        driveProvider.saveAs();
        break;
      case "downloadSchema":
        download(
          JSON.stringify(store.getState().schema.present),
          "schema.json",
          "application/json"
        );
        break;
      case "exportSql":
        this.#downloadAsSQLSchema();
        break;
      case "undo":
        undo();
        break;
      case "redo":
        redo();
        break;
      case "selectDbType":
        store.dispatch(
          dbTypeDialogActions.open(DbTypeDialogState.OpenFromTopMenu)
        );
        break;
      case "increaseViewSize":
        this.#increaseViewSize();
        break;
      case "decreaseViewSize":
        this.#decreaseViewSize();
        break;
      case "reportIssue":
        {
          const win = window.open(
            "https://github.com/ayeressian/dbgrapher/issues",
            "_blank"
          );
          win!.focus();
        }
        break;
      case "gitHub":
        {
          const win = window.open(
            "https://github.com/ayeressian/dbgrapher",
            "_blank"
          );
          win!.focus();
        }
        break;
      case "privacyPolicy":
        {
          const win = window.open(
            "https://site.dbgrapher.com/privacy-policy.html",
            "_blank"
          );
          win!.focus();
        }
        break;
      case "termsOfService":
        {
          const win = window.open(
            "https://site.dbgrapher.com/terms-of-service.html",
            "_blank"
          );
          win!.focus();
        }
        break;
      case "about":
        store.dispatch(dialogActions.open(DialogTypes.AboutDialog));
        break;
    }
  };

  #onCenterClick = (): void => {
    if (!this.openFileRenamePopup) {
      this.openFileRenamePopup = true;
    }
  };

  #onAccountClick = (): void => {
    if (!this.openAccountPopup) {
      this.openAccountPopup = true;
    }
  };

  #onEscape = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      if (this.openFileRenamePopup) {
        this.openFileRenamePopup = false;
      }
      if (this.openAccountPopup) {
        this.openAccountPopup = false;
      }
    }
  };
}
