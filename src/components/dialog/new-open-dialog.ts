import {
  html,
  customElement,
  css,
  CSSResult,
  TemplateResult,
  unsafeCSS,
  internalProperty,
} from "lit-element";
import store from "../../store/store";
import { actions as newOpenDialogActions } from "../../store/slices/dialog/new-open-dialog";
import fileSvg from "../../../asset/file.svg";
import folderOpenSvg from "../../../asset/folder-open.svg";
import commonStyles from "../common-icon-dialog-styling";
import { subscribe } from "../../subscribe-store";
import { t } from "../../localization";
import { DBGElement } from "../dbg-element";
import { newFile, openFile } from "../operations";

@customElement("dbg-new-open-dialog")
export default class extends DBGElement {
  @internalProperty()
  private open = false;

  static get styles(): CSSResult {
    return css`
      ${commonStyles}

      .folder-open {
        width: 112px;
        height: 75px;
        margin-top: 10px;
        background-image: url(${unsafeCSS(folderOpenSvg)});
      }

      .new-file {
        background-image: url(${unsafeCSS(fileSvg)});
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
      (state) => state.dialog.newOpenDialog,
      (open) => {
        this.open = open;
      }
    );
  }

  render(): TemplateResult {
    return html`
      <dbg-dialog ?show=${this.open}>
        <div slot="body">
          <div class="operations">
            <div class="operation-container" @click="${this.#newFile}">
              <div class="operation-icon-container">
                <div class="new-file operation-icon"></div>
              </div>
              <h4 class="operation" id="new-file">
                ${t((l) => l.dialog.newOpen.operation.newSchema)}
              </h4>
            </div>
            <div class="operation-container" @click="${this.#openFile}">
              <div class="operation-icon-container">
                <div class="folder-open operation-icon"></div>
              </div>
              <h4 class="operation" id="open-file">
                ${t((l) => l.dialog.newOpen.operation.openSchema)}
              </h4>
            </div>
          </div>
        </div>
      </dbg-dialog>
    `;
  }

  #newFile = (): void => {
    store.dispatch(newOpenDialogActions.close());
    newFile();
  };

  #openFile = (): void => {
    openFile();
  };
}
