import {
  html,
  customElement,
  css,
  CSSResult,
  TemplateResult,
  unsafeCSS,
  internalProperty,
} from "lit-element";
import fileSvg from "../../../asset/file.svg";
import oneDriveSvg from "../../../asset/onedrive.svg";
import googleDriveSvg from "../../../asset/google-drive.svg";
import noDriveSvg from "../../../asset/no-drive.svg";
import commonStyles from "../common-icon-dialog-styling";
import { subscribe } from "../../subscribe-store";
import store from "../../store/store";
import {
  actions as cloudActions,
  CloudProvider,
} from "../../store/slices/cloud";
import { driveProvider } from "../../drive/factory";
import { actions as cloudProviderChooserDialogActions } from "../../store/slices/dialog/cloud-provider-chooser-dialog";
import { actions as newOpenFileDialogActions } from "../../store/slices/dialog/new-open-dialog";
import { t } from "../../localization";
import { DBGElement } from "../dbg-element";

@customElement("dbg-cloud-provider-dialog")
export default class extends DBGElement {
  @internalProperty()
  private open = store.getState().dialog.cloudProviderChooserDialog;

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

      .operations {
        display: flex;
        flex-direction: horizontal;
      }
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();

    subscribe(
      (state) => state.dialog.cloudProviderChooserDialog,
      (open) => {
        this.open = open;
      }
    );
  }

  render(): TemplateResult {
    console.log("render");
    return html`
      <dbg-dialog
        ?show=${this.open}
        centerTitle=${t((l) => l.dialog.cloudProvider.title)}
      >
        <div slot="body">
          <div class="operations">
            <div
              class="operation-container"
              @click="${this.#onSelect(CloudProvider.GoogleDrive)}"
            >
              <div class="operation-icon-container">
                <div class="google-drive operation-icon"></div>
              </div>
              <h4 class="operation">
                ${t((l) => l.dialog.cloudProvider.operation.googleDrive)}
              </h4>
            </div>
            <!-- disabled onedrive because of https://github.com/OneDrive/onedrive-api-docs/issues/958
            <div class="operation-container" @click="${this.#onSelect(
              CloudProvider.OneDrive
            )}">
              <div class="one-drive operation-icon">
              </div>
              <h4 class="operation">
                One Drive
              </h4>
            </div>-->
            <div
              class="operation-container"
              @click="${this.#onSelect(CloudProvider.None)}"
            >
              <div class="no-drive operation-icon"></div>
              <h4 class="operation">
                ${t((l) => l.dialog.cloudProvider.operation.none)}
              </h4>
            </div>
          </div>
        </div>
      </dbg-dialog>
    `;
  }

  #onSelect = (cloudProvider: CloudProvider) => async (): Promise<void> => {
    store.dispatch(cloudActions.setDriveType(cloudProvider));
    const loggedIn = await driveProvider.login();
    if (loggedIn) {
      store.dispatch(cloudProviderChooserDialogActions.close());
      store.dispatch(newOpenFileDialogActions.open());
    }
  };
}
