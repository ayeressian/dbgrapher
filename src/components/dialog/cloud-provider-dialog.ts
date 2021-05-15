import { html, TemplateResult } from "lit";
import googleDriveSvg from "../../../asset/google-drive.svg";
import noDriveSvg from "../../../asset/no-drive.svg";
import store from "../../store/store";
import {
  actions as cloudActions,
  CloudProvider,
} from "../../store/slices/cloud";
import { getDriveProvider } from "../../drive/factory";
import {
  actions as dialogActions,
  DialogTypes,
} from "../../store/slices/dialog/dialogs";
import { t } from "../../localization";
import { DBGElement } from "../dbg-element";
import { customElement, state } from "lit/decorators";

@customElement("dbg-cloud-provider-dialog")
export default class extends DBGElement {
  @state()
  private open = store.getState().dialog.dialogs.cloudProviderChooserDialog;

  connectedCallback(): void {
    super.connectedCallback();

    this.subscribe(
      (state) => state.dialog.dialogs.cloudProviderChooserDialog,
      (open) => {
        this.open = open;
      }
    );
  }

  render(): TemplateResult {
    return html`
      <dbg-dialog
        ?show=${this.open}
        centerTitle=${t((l) => l.dialog.cloudProvider.title)}
      >
        <div slot="body">
          <dbg-dialog-operations>
            <dbg-dialog-operation
              data-testid="google-drive"
              @dbg-click=${this.#onSelect(CloudProvider.GoogleDrive)}
              text=${t((l) => l.dialog.cloudProvider.operation.googleDrive)}
              icon=${googleDriveSvg}
            ></dbg-dialog-operation>
            <!-- disabled onedrive because of https://github.com/OneDrive/onedrive-api-docs/issues/958-->
            <dbg-dialog-operation
              data-testid="none"
              @dbg-click=${this.#onSelect(CloudProvider.Local)}
              text=${t((l) => l.dialog.cloudProvider.operation.none)}
              icon=${noDriveSvg}
            ></dbg-dialog-operation>
          </dbg-dialog-operations>
        </div>
      </dbg-dialog>
    `;
  }

  #onSelect = (cloudProvider: CloudProvider) => async (): Promise<void> => {
    store.dispatch(cloudActions.setDriveType(cloudProvider));
    const loggedIn = await getDriveProvider().login();
    if (loggedIn) {
      store.dispatch(
        dialogActions.close(DialogTypes.CloudProviderChooserDialog)
      );
      store.dispatch(dialogActions.open(DialogTypes.NewOpenDialog));
    }
  };
}
