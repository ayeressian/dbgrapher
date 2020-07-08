import {
  html,
  customElement,
  css,
  CSSResult,
  TemplateResult,
  unsafeCSS,
  internalProperty,
} from "lit-element";
import ConnectLitElement from "./connect-lit-element";
import fileSvg from '../../asset/file.svg';
import oneDriveSvg from '../../asset/onedrive.svg';
import googleDriveSvg from '../../asset/google-drive.svg';
import noDriveSvg from '../../asset/no-drive.svg';
import commonStyles from './common-icon-dialog-styling';
import { subscribe } from "../subscribe-store";
import store from "../store/store";
import { actions as cloudActions, CloudProvider } from '../store/slices/cloud';
import { driveProvider } from '../drive/factory';
import { actions as cloudProviderChooserDialogActions } from '../store/slices/dialog/cloud-provider-chooser-dialog';
import { actions as newOpenFileDialogActions } from '../store/slices/dialog/new-open-dialog';

@customElement("dbg-cloud-provider-dialog")
export default class extends ConnectLitElement {
  @internalProperty()
  open = true;

  static get styles(): CSSResult {
    return css`
      ${commonStyles}

      .one-drive {
        width: 179px;
        margin-left: 10px;
        background-image: url(${unsafeCSS(oneDriveSvg)});
      }

      .google-drive {
        width: 100px;
        background-image: url(${unsafeCSS(googleDriveSvg)});
      }

      .no-drive {
        width: 100px;
        margin-left: 52px;
        background-image: url(${unsafeCSS(noDriveSvg)});
      }

      .new-file {
        background-image: url(${unsafeCSS(fileSvg)});
      }
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();

    subscribe(state => state.dialog.cloudProviderChooserDialog, open => {
      this.open = open;
    });
  }
  
  render(): TemplateResult {
    return html`
      <dbg-dialog ?show=${this.open} title="Please select a cloud provider">
        <div slot="body">
          <div class="operation-container" @click="${this.#onSelect(CloudProvider.GoogleDrive)}">
            <div class="operation-icon-container">
              <div class="google-drive operation-icon">
              </div>
            </div>
            <h4 class="operation">
              Google Drive
            </h4>
          </div>
          <!-- disabled onedrive because of https://github.com/OneDrive/onedrive-api-docs/issues/958
          <div class="operation-container" @click="${this.#onSelect(CloudProvider.OneDrive)}">
            <div class="one-drive operation-icon">
            </div>
            <h4 class="operation">
              One Drive
            </h4>
          </div>-->
          <div class="operation-container" @click="${this.#onSelect(CloudProvider.None)}">
            <div class="no-drive operation-icon">
            </div>
            <h4 class="operation">
              None
            </h4>
          </div>
        </div>
      </dbg-dialog>
    `;
  }

  #onSelect = (cloudProvider: CloudProvider) => async (): Promise<void> => {
    store.dispatch(cloudActions.setDriveType(cloudProvider));
    await driveProvider.login();
    store.dispatch(cloudProviderChooserDialogActions.close());
    store.dispatch(newOpenFileDialogActions.open());
  }
}
