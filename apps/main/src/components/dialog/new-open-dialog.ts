import { html, TemplateResult } from "lit";
import store from "../../store/store";
import {
  actions as dialogActions,
  DialogTypes,
} from "../../store/slices/dialog/dialogs";
import fileSvg from "../../../asset/file.svg";
import folderOpenSvg from "../../../asset/folder-open.svg";
import demoSvg from "../../../asset/demo.svg";
import { t } from "../../localization";
import { DBGElement } from "../dbg-element";
import { newFile, openFile } from "../operations";
import { customElement, state } from "lit/decorators.js";
import { actions as schemaAction } from "../../store/slices/schema";
import { actions as laodSchemaAction } from "../../store/slices/load-schema";
import demoSchema from "./demo_schema";

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
      <dbg-dialog
        ?show=${this.open}
        centerTitle=${t((l) => l.dialog.fileOpenChooser.welcome)}
      >
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
            <dbg-dialog-operation
              data-testid="new-file"
              @dbg-click=${this.#demo}
              text=${t((l) => l.dialog.newOpen.operation.demoSchema)}
              icon=${demoSvg}
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

  #demo = (): void => {
    store.dispatch(dialogActions.close(DialogTypes.NewOpenDialog));
    store.dispatch(schemaAction.initiate(demoSchema));
    store.dispatch(laodSchemaAction.load());
  };
}
