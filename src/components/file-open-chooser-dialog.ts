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
import oneDriveSvg from '../../asset/icon-onedrive.svg';
import { picker as googleDrivePicker } from '../drive/google-drive';
import { picker as oneDrivePicker } from '../drive/one-drive';
import { subscribe } from "../subscribe-store";
import { actions as fileOpenDialog } from "../store/slices/file-open-dialog";
import { actions as fileOpenChooserAction, State } from '../store/slices/file-open-chooser-dialog';
import { actions as welcomeDialogActions } from "../store/slices/welcome-dialog";
import commonStyles from './common-icon-dialog-styling';

@customElement("dbg-file-open-chooser-dialog")
export default class extends ConnectLitElement {
  #open = State.Close;

  static get styles(): CSSResult {
    return css`
      ${commonStyles}

      .local {
        width: 113px;
        background-image: url(${unsafeCSS(localSvg)});
      }

      .google-drive {
        width: 100px;
        background-image: url(${unsafeCSS(googleDriveSvg)});
      }

      .one-drive {
        background-image: url(${unsafeCSS(oneDriveSvg)});
      }
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    subscribe(state => state.dialog.fileOpenChooserDialog, open => {
      this.#open = open;
      this.requestUpdate();
    });
  }
  
  render(): TemplateResult {
    return html`
      <dbg-dialog
        ?show=${this.#open !== State.Close}
        ?showBack=${this.#open === State.OpenFromWelcomeDialog}
        ?showClose=${this.#open === State.OpenFromTopMenu}
        @dbg-on-back=${this.#goBack}
        @dbg-on-close=${this.#close}
        @dbg-on-escape="${this.#onEscape}">
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
          <!--<div class="operation-container" @click="${this.#oneDrive}">
            <div class="one-drive operation-icon">
            </div>
            <h4 class="operation">
              One Drive
            </h4>
          </div>-->
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

  #close = (): void => {
    store.dispatch(fileOpenChooserAction.close());
  };

  #onEscape = (): void => {
    if (this.#open === State.OpenFromTopMenu) {
      this.#close();
    } else {
      this.#goBack();
    }
  }
}
