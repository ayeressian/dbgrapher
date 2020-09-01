import {
  html,
  customElement,
  css,
  CSSResult,
  TemplateResult,
  internalProperty,
} from "lit-element";
import googleDriveSvg from "../../../asset/google-drive.svg";
import noDriveSvg from "../../../asset/no-drive.svg";
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
            <dbg-dialog-operation
              @dbg-click=${this.#onSelect(CloudProvider.GoogleDrive)}
              text=${t((l) => l.dialog.cloudProvider.operation.googleDrive)}
              icon=${googleDriveSvg}
            ></dbg-dialog-operation>
            <!-- disabled onedrive because of https://github.com/OneDrive/onedrive-api-docs/issues/958-->
            <dbg-dialog-operation
              @dbg-click=${this.#onSelect(CloudProvider.None)}
              text=${t((l) => l.dialog.cloudProvider.operation.none)}
              icon=${noDriveSvg}
            ></dbg-dialog-operation>
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
