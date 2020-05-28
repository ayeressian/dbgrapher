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
import { actions as fileOpenChooserAction } from "../store/slices/file-open-chooser-dialog";
import { AppState } from '../store/reducer';
import fileSvg from '../../asset/file.svg';
import folderOpenSvg from '../../asset/folder-open.svg';
import commonStyles from './common-icon-dialog-styling';

@customElement("dbg-welcome-dialog")
export default class extends ConnectLitElement {
  @watch((state: AppState) => state.dialog.welcomeDialog)
  private open = true;

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
    `;
  }
  
  render(): TemplateResult {
    return html`
      <dbg-dialog ?show=${this.open}>
        <div slot="body">
          <div class="operation-container" @click="${this.#newFile}">
            <div class="operation-icon-container">
              <div class="new-file operation-icon">
              </div>
            </div>
            <h4 class="operation" id="new-file">
              New Schema
            </h4>
          </div>
          <div class="operation-container" @click="${this.#openFile}">
            <div class="operation-icon-container">
              <div class="folder-open operation-icon">
              </div>
            </div>
            <h4 class="operation" id="open-file">
              Open Schema
            </h4>
          </div>
        <div class="container">
      </dbg-dialog>
    `;
  }

  #newFile = (): void => {
    store.dispatch(welcomeDialogActions.close());
  };

  #openFile = (): void => {
    store.dispatch(welcomeDialogActions.close());
    store.dispatch(fileOpenChooserAction.open(true));
  };
}
