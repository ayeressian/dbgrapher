import {
  html,
  customElement,
  css,
  CSSResult,
  TemplateResult
} from "lit-element";
import ConnectLitElement from "./connect-lit-element";
import store from "../store/store";
import { watch } from "lit-redux-watch";
import { actions as welcomeDialogActions } from "../store/slices/welcome-dialog";
import { actions as schemaAction } from "../store/slices/schema";
import { actions as fileOpenAction } from "../store/slices/file-open-dialog";
import { actions as fileSqlOpenAction } from "../store/slices/file-sql-open-dialog";

@customElement("dbg-welcome-dialog")
export default class extends ConnectLitElement {
  @watch("dialog.welcomeDialog")
  private open = true;

  static get styles(): CSSResult {
    return css`
      .operation {
        color: #0a70b4;
        cursor: pointer;
      }
    `;
  }

  render(): TemplateResult {
    return this.open
      ? html`
          <dbg-dialog show>
            <div>
              <h4 class="operation" id="new-file" @click="${this.newFile}">
                New File
              </h4>
              <h4 class="operation" id="open-file" @click="${this.openFile}">
                Open File
              </h4>
              <h4
                class="operation"
                id="import-sql-file"
                @click="${this.importSqlFile}"
              >
                Import SQL File
              </h4>
            </div>
          </dbg-dialog>
        `
      : html``;
  }

  private newFile = (): void => {
    store.dispatch(schemaAction.setSchema({ tables: [] }));
    store.dispatch(welcomeDialogActions.close());
  };

  private openFile = (): void => {
    store.dispatch(fileOpenAction.open());
  };

  private importSqlFile = (): void => {
    store.dispatch(fileSqlOpenAction.open());
  };
}
