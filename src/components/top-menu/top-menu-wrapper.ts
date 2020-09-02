import {
  html,
  customElement,
  TemplateResult,
  CSSResult,
  css,
  unsafeCSS,
  internalProperty,
} from "lit-element";
import {
  actions as dialogActions,
  DialogTypes,
} from "../../store/slices/dialog/dialogs";
import store from "../../store/store";
import { download } from "../../util";
import { Schema } from "db-viewer-component";
import schemaToSqlSchema from "../../schema-to-sql-schema";
import { classMap } from "lit-html/directives/class-map";
import { subscribe } from "../../subscribe-store";
import buttonCss from "purecss/build/buttons-min.css";
import {
  CloudState,
  CloudProvider,
  CloudUpdateState,
} from "../../store/slices/cloud";
import topMenuConfig from "./top-menu-config";
import ColorHash from "color-hash";
import { styleMap } from "lit-html/directives/style-map";
import { driveProvider } from "../../drive/factory";
import { FileNameUpdateEvent } from "./file-name-popup";
import { undo, redo, newFile, openFile } from "../operations";
import { DBGElement } from "../dbg-element";
import { t } from "../../localization";
import providerName from "./cloud-provider-name";

const colorHash = new ColorHash({ saturation: 0.5 });

@customElement("dbg-top-menu-wrapper")
export default class extends DBGElement {
  @internalProperty()
  private openAccountPopup = false;

  @internalProperty()
  private openFileRenamePopup = false;

  @internalProperty()
  private fileName!: string;

  @internalProperty()
  private cloudState: CloudState = store.getState().cloud;

  #accountPopup!: HTMLElement;
  #error = false;

  static get styles(): CSSResult {
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
    this.cloudState.provider === CloudProvider.None ||
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
        .config="${topMenuConfig}"
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
    subscribe(
      (state) => state.cloud,
      (cloudState) => {
        this.cloudState = cloudState;
        this.fileName = cloudState.fileName!;
      }
    );

    document.addEventListener("click", this.#onDocumentClick, true);
    window.addEventListener("keydown", this.#onEscape);
  }

  #logout = (): void => {
    this.openAccountPopup = false;
    void driveProvider.logout();
  };

  firstUpdated(): void {
    this.#accountPopup = this.shadowRoot!.querySelector(
      "dbg-top-menu-account-popup"
    ) as HTMLElement;
  }

  #onfileRename = (event: FileNameUpdateEvent): void => {
    void driveProvider.renameFile(event.detail.newFileName);
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

  #getCurrentSchema = (): Schema => {
    return store.getState().schema.present;
  };

  #downloadAsSQLSchema = async (): Promise<void> => {
    const schema = this.#getCurrentSchema();
    const result = await schemaToSqlSchema(schema);
    if (result) download(result, "schema.sql", "text/plain");
  };

  #itemSelected = (event: CustomEvent): void => {
    switch (event.detail.id) {
      case "new":
        newFile();
        break;
      case "open":
        openFile();
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
