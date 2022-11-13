import { html, TemplateResult } from "lit";
import store from "../../store/store";
import {
  actions as dialogActions,
  DialogTypes,
} from "../../store/slices/dialog/dialogs";
import fileSvg from "../../../asset/file.svg";
import folderOpenSvg from "../../../asset/folder-open.svg";
import { t } from "../../localization";
import { DBGElement } from "../dbg-element";
import { newFile, openFile } from "../operations";
import { customElement, state } from "lit/decorators.js";

@customElement("dbg-new-open-dialog")
export default class extends DBGElement {
  @state()
  private open = store.getState().dialog.dialogs.newOpenDialog;

  connectedCallback(): void {
    super.connectedCallback();

    this.subscribe(
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
          <dbg-dialog-operations>
            <dbg-dialog-operation
              data-testid="new-file"
              @dbg-click=${this.#newFile}
              text=${t((l) => l.dialog.newOpen.operation.newSchema)}
              icon=${fileSvg}
            ></dbg-dialog-operation>
            <dbg-dialog-operation
              data-testid="open-file"
              @dbg-click=${this.#openFile}
              text=${t((l) => l.dialog.newOpen.operation.openSchema)}
              icon=${folderOpenSvg}
            ></dbg-dialog-operation>
          </dbg-dialog-operations>
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
