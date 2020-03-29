import {
  html,
  customElement,
  css,
  CSSResult,
  TemplateResult,
  unsafeCSS,
} from "lit-element";
import ConnectLitElement from "./connect-lit-element";
import store from "../store/store";
import { watch } from "lit-redux-watch";
import { actions as welcomeDialogActions } from "../store/slices/welcome-dialog";
import { actions as schemaAction } from "../store/slices/schema";
import { actions as fileOpenAction } from "../store/slices/file-open-dialog";
import { actions as fileSqlOpenAction } from "../store/slices/file-sql-open-dialog";
import { AppState } from '../store/reducer';
import fileSvg from '@fortawesome/fontawesome-free/svgs/regular/file.svg'
import folderOpenSvg from '@fortawesome/fontawesome-free/svgs/regular/folder-open.svg'
import fileImportSvg from '@fortawesome/fontawesome-free/svgs/solid/file-import.svg'

@customElement("dbg-welcome-dialog")
export default class extends ConnectLitElement {
  @watch((state: AppState) => state.dialog.welcomeDialog)
  private open = true;

  static get styles(): CSSResult {
    return css`
      .operation {
        color: #000000a3;
      }

      .operation-icon {
        width: 75px;
        height: 100px;
        display: inline-block;
        filter: opacity(50%);
      }

      .folder-open {
        width: 112px;
        background-image: url(${unsafeCSS(folderOpenSvg)});
      }

      .new-file {
        background-image: url(${unsafeCSS(fileSvg)});
      }

      .file-import {
        width: 100px;
        background-image: url(${unsafeCSS(fileImportSvg)});
      }

      .container {
        display: flex;
      }

      .operation-container {
        padding: 10px;
        margin: 10px;
        width: 200px;
        text-align: center;
        background-color: white;
      }

      .operation-container:hover {
        cursor: pointer;
        background-color: rgba(0,0,0,.05);
        background-blend-mode: multiply;
      }
    `;
  }
  
  render(): TemplateResult {
    return this.open
      ? html`
          <dbg-dialog show>
            <div class="container">
              <div class="operation-container" @click="${this.#newFile}">
                <div class="new-file operation-icon">
                </div>
                <h4 class="operation" id="new-file">
                  New File
                </h4>
              </div>
              <div class="operation-container" @click="${this.#openFile}">
                <div class="folder-open operation-icon">
                </div>
                <h4 class="operation" id="open-file">
                  Open File
                </h4>
              </div>

              <div class="operation-container" @click="${this.#importSqlFile}">
                <div class="file-import operation-icon">
                </div>
                <h4
                  class="operation"
                  id="import-sql-file"
                >
                  Import SQL File
                </h4>
              </div>
            </div>
          </dbg-dialog>
        `
      : html``;
  }

  #newFile = (): void => {
    store.dispatch(schemaAction.set({ tables: [] }));
    store.dispatch(welcomeDialogActions.close());
  };

  #openFile = (): void => {
    store.dispatch(fileOpenAction.open());
  };

  #importSqlFile = (): void => {
    store.dispatch(fileSqlOpenAction.open());
  };
}
