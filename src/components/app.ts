import initProviderFactory, { getDriveProvider } from "../drive/factory";
import "../localization";
import "./import-components";
import {
  html,
  customElement,
  css,
  CSSResult,
  TemplateResult,
} from "lit-element";
import store from "../store/store";
import ResetStoreException from "../reset-exception";
import { DBGElement } from "./dbg-element";
import { CloudProvider } from "../store/slices/cloud";
import { isMac } from "../util";
import { getDialogsAreClosed, googleDrive, openFile } from "./operations";
import { hintTimed, HintType } from "../store/slices/hint";

initProviderFactory();

@customElement("dbg-app")
export default class extends DBGElement {
  static get styles(): CSSResult {
    return css`
      * {
        font-family: RobotoCondensed, Arial;
        color: #333;
      }

      .main_container {
        display: grid;
        grid-template-columns: 60px 1fr;
        grid-template-rows: 33px 1fr;
        width: 100%;
        height: 100%;
      }

      dbg-side-panel {
        grid-row: 2;
      }

      dbg-db-viewer {
        grid-row: 2;
      }

      dbg-top-menu-wrapper {
        grid-column: 1 / 3;
        grid-row: 1;
      }

      @media print {
        dbg-side-panel {
          display: none;
        }

        dbg-db-viewer {
          grid-row: 1 / 3;
          grid-column: 1 / 3;
        }

        dbg-top-menu-wrapper {
          display: none;
        }
      }
    `;
  }

  render(): TemplateResult {
    return html`
      <div class="main_container">
        <dbg-top-menu-wrapper></dbg-top-menu-wrapper>
        <dbg-side-panel></dbg-side-panel>
        <dbg-db-viewer></dbg-db-viewer>
        <dbg-file-inputs></dbg-file-inputs>
        <dbg-table-dialog></dbg-table-dialog>
        <dbg-file-open-chooser-dialog></dbg-file-open-chooser-dialog>
        <dbg-load-screen></dbg-load-screen>
        <dbg-hint></dbg-hint>
        <dbg-about-dialog></dbg-about-dialog>
        <dbg-new-open-dialog></dbg-new-open-dialog>
        <dbg-cloud-provider-dialog></dbg-cloud-provider-dialog>
        <dbg-confirmation-dialog></dbg-confirmation-dialog>
        <dbg-db-type-dialog></dbg-db-type-dialog>
      </div>
    `;
  }

  #handleErrors = (error: Error, event: Event): void => {
    if (error instanceof ResetStoreException) {
      store.dispatch({ type: "RESET" });
      event.preventDefault();
    }
  };

  #onkeydown = async (event: KeyboardEvent): Promise<void> => {
    const driveProvider = getDriveProvider();
    const dialogsAreClosed = getDialogsAreClosed();
    if (
      event.key === "s" &&
      ((event.ctrlKey && !isMac) || (event.metaKey && isMac))
    ) {
      event.preventDefault();
      dialogsAreClosed && driveProvider && (await driveProvider.save());
      if (googleDrive() && dialogsAreClosed) {
        store.dispatch(hintTimed(HintType.DriveSave));
      }
    }

    if (
      (event.key === "s" &&
        event.shiftKey &&
        ((event.ctrlKey && !isMac) || (event.metaKey && isMac))) ||
      (!isMac && event.ctrlKey)
    ) {
      event.preventDefault();
      dialogsAreClosed && driveProvider && (await driveProvider.saveAs());
    }

    if (
      (event.key === "o" &&
        ((event.ctrlKey && !isMac) || (event.metaKey && isMac))) ||
      (!isMac && event.ctrlKey)
    ) {
      event.preventDefault();
      dialogsAreClosed && (await openFile());
    }
  };

  #onBeforeunload = (event: BeforeUnloadEvent): void => {
    const state = store.getState();
    if (
      state.cloud.provider === CloudProvider.Local &&
      state.showUnsavedWarning
    ) {
      event.preventDefault();
      event.returnValue = "";
    }
  };

  #onUnhandledrejection = (errorEvent: PromiseRejectionEvent): void => {
    this.#handleErrors(errorEvent.reason, errorEvent);
  };

  #onError = (errorEvent: ErrorEvent): void => {
    this.#handleErrors(errorEvent.error, errorEvent);
  };

  connectedCallback(): void {
    super.connectedCallback();

    window.addEventListener("error", this.#onError);
    window.addEventListener("unhandledrejection", this.#onUnhandledrejection);
    window.addEventListener("beforeunload", this.#onBeforeunload);
    document.addEventListener("keydown", this.#onkeydown);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();

    window.removeEventListener("error", this.#onError);
    window.removeEventListener(
      "unhandledrejection",
      this.#onUnhandledrejection
    );
    window.removeEventListener("beforeunload", this.#onBeforeunload);
    document.removeEventListener("keydown", this.#onkeydown);
  }
}
