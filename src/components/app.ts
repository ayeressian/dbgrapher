import initProviderFactory from "../drive/factory";
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

  connectedCallback(): void {
    super.connectedCallback();

    window.addEventListener("error", (errorEvent) =>
      this.#handleErrors(errorEvent.error, errorEvent)
    );
    window.addEventListener("unhandledrejection", (errorEvent) =>
      this.#handleErrors(errorEvent.reason, errorEvent)
    );
    window.addEventListener("beforeunload", (event: BeforeUnloadEvent) => {
      const state = store.getState();
      if (
        state.cloud.provider === CloudProvider.None &&
        state.showUnsavedWarning
      ) {
        event.preventDefault();
        event.returnValue = "";
      }
    });
  }
}
