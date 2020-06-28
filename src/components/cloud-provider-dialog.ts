import {
  html,
  customElement,
  css,
  CSSResult,
  TemplateResult,
  unsafeCSS,
} from "lit-element";
import ConnectLitElement from "./connect-lit-element";
import fileSvg from '../../asset/file.svg';
import oneDriveSvg from '../../asset/onedrive.svg';
import googleDriveSvg from '../../asset/google-drive.svg';
import commonStyles from './common-icon-dialog-styling';
import { subscribe } from "../subscribe-store";
import { login as gDriveLogin } from "../drive/google-drive/google-drive";
import { login as oneDriveLogin } from "../drive/one-drive/one-drive";
import store from "../store/store";
import { actions as cloudStatusAction } from '../store/slices/cloud';
import { actions as cloudProviderChooserDialogAction } from '../store/slices/dialog/cloud-provider-chooser-dialog';

@customElement("dbg-cloud-provider-dialog")
export default class extends ConnectLitElement {
  #open = true;

  static get styles(): CSSResult {
    return css`
      ${commonStyles}

      .one-drive {
        width: 179px;
        background-image: url(${unsafeCSS(oneDriveSvg)});
      }

      .google-drive {
        width: 100px;
        background-image: url(${unsafeCSS(googleDriveSvg)});
      }

      .new-file {
        background-image: url(${unsafeCSS(fileSvg)});
      }
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();

    subscribe(state => state.dialog.cloudProviderChooserDialog, open => {
      this.#open = open;
      this.requestUpdate();
    });
  }
  
  render(): TemplateResult {
    return html`
      <dbg-dialog ?show=${this.#open} title="Please select a cloud provider">
        <div slot="body">
          <div class="operation-container" @click="${this.#googleDrive}">
            <div class="operation-icon-container">
              <div class="google-drive operation-icon">
              </div>
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
          <div class="operation-container" @click="${this.#none}">
            <div class="one-drive operation-icon">
            </div>
            <h4 class="operation">
              None
            </h4>
          </div>
        </div>
      </dbg-dialog>
    `;
  }

  #googleDrive = async (): Promise<void> => {
    await gDriveLogin();
    store.dispatch(cloudProviderChooserDialogAction.close());
  };

  #oneDrive = async (): Promise<void> => {
    await oneDriveLogin();
    store.dispatch(cloudProviderChooserDialogAction.close());
  };

  #none = (): void => {
    store.dispatch(cloudStatusAction.none());
    store.dispatch(cloudProviderChooserDialogAction.close());
  };
}
