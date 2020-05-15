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
import localSvg from '@fortawesome/fontawesome-free/svgs/regular/folder-open.svg';
import googleDriveSvg from '@fortawesome/fontawesome-free/svgs/brands/google-drive.svg';
import goBackSvg from '@fortawesome/fontawesome-free/svgs/regular/arrow-alt-circle-left.svg';
import oneDriveSvg from '../../asset/icon-onedrive.svg';
import { picker as googleDrivePicker } from '../drive/google-drive';
import { picker as oneDrivePicker } from '../drive/one-drive';
import { subscribe } from "../subscribe-store";
import { actions as fileOpenDialog } from "../store/slices/file-open-dialog";
import { actions as fileOpenChooserAction } from "../store/slices/file-open-chooser-dialog";
import { actions as welcomeDialogActions } from "../store/slices/welcome-dialog";

@customElement("dbg-file-open-chooser-dialog")
export default class extends ConnectLitElement {
  #open = false;

  static get styles(): CSSResult {
    return css`
      .operation-icon {
        width: 100px;
        height: 100px;
        display: inline-block;
        background-repeat: no-repeat;
        background-size: cover;
      }

      .local {
        width: 113px;
        background-image: url(${unsafeCSS(localSvg)});
      }

      .google-drive {
        background-image: url(${unsafeCSS(googleDriveSvg)});
      }

      .one-drive {
        background-image: url(${unsafeCSS(oneDriveSvg)});
      }

      .go-back {
        background-image: url(${unsafeCSS(goBackSvg)});
      }

      .operation-container {
        filter: opacity(60%);
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

  #onEscape = (): void => {
    // TODO
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('keydown', this.#onEscape);
    subscribe(state => state.dialog.fileOpenChooserDialog, open => {
      this.#open = open;
      this.requestUpdate();
    });
  }
  
  render(): TemplateResult {
    return html`
      <dbg-dialog ?show=${this.#open} showBack @dbg-on-back=${this.#goBack}>
        <div slot="body">
          <div class="operation-container" @click="${this.#local}">
            <div class="local operation-icon">
            </div>
            <h4 class="operation">
              My Computer
            </h4>
          </div>
          <div class="operation-container" @click="${this.#googleDrive}">
            <div class="google-drive operation-icon">
            </div>
            <h4 class="operation">
              Google Drive
            </h4>
          </div>
          <div class="operation-container" @click="${this.#oneDrive}">
            <div class="one-drive operation-icon">
            </div>
            <h4 class="operation">
              One Drive
            </h4>
          </div>
        </div>
      </dbg-dialog>
    `;
  }

  #local = (): void => {
    store.dispatch(fileOpenDialog.open());
  };

  #googleDrive = (): void => {
    googleDrivePicker();
  };

  #oneDrive = (): void => {
    oneDrivePicker();
  };

  #goBack = (): void => {
    store.dispatch(welcomeDialogActions.open());
    store.dispatch(fileOpenChooserAction.close());
  };
}
