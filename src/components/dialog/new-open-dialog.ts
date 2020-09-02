import {
  html,
  customElement,
  css,
  CSSResult,
  TemplateResult,
  internalProperty,
} from "lit-element";
import store from "../../store/store";
import {
  actions as dialogActions,
  DialogTypes,
} from "../../store/slices/dialog/dialogs";
import fileSvg from "../../../asset/file.svg";
import folderOpenSvg from "../../../asset/folder-open.svg";
import { subscribe } from "../../subscribe-store";
import { t } from "../../localization";
import { DBGElement } from "../dbg-element";
import { newFile, openFile } from "../operations";

@customElement("dbg-new-open-dialog")
export default class extends DBGElement {
  @internalProperty()
  private open = store.getState().dialog.dialogs.newOpenDialog;

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
      (state) => state.dialog.dialogs.newOpenDialog,
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
            <dbg-dialog-operation
              @dbg-click=${this.#newFile}
              text=${t((l) => l.dialog.newOpen.operation.newSchema)}
              icon=${fileSvg}
            ></dbg-dialog-operation>
            <dbg-dialog-operation
              @dbg-click=${this.#openFile}
              text=${t((l) => l.dialog.newOpen.operation.openSchema)}
              icon=${folderOpenSvg}
            ></dbg-dialog-operation>
          </div>
        </div>
      </dbg-dialog>
    `;
  }

  #newFile = (): void => {
    store.dispatch(dialogActions.close(DialogTypes.NewOpenDialog));
    newFile();
  };

  #openFile = (): void => {
    openFile();
  };
}
