import {
  LitElement,
  customElement,
  css,
  CSSResult,
  TemplateResult,
  html,
  internalProperty,
} from "lit-element";
import DbViewerMode from "../store/slices/db-viewer-mode-type";
import store from "../store/store";
import { isMac } from "../util";
import { FileOpenDialogState as FileOpenChooserDialogState } from "../store/slices/dialog/file-open-chooser-dialog";
import { CloudProvider } from "../store/slices/cloud";
import texts from "../texts";

const DISPLAY_TIMER = 5000;

@customElement("dbg-hint")
export default class extends LitElement {
  @internalProperty()
  private text = "";

  static get styles(): CSSResult {
    return css`
      div {
        position: fixed;
        right: 20px;
        bottom: 18px;
        background-color: #333;
        color: #ddd;
        font-size: 1.2em;
        padding: 5px;
        padding-left: 8px;
        padding-right: 8px;
        border-radius: 2px;
      }
    `;
  }

  render(): TemplateResult {
    return this.text
      ? html`
          <div>
            ${this.text}
          </div>
        `
      : html``;
  }

  #showTimedMessage = (message: string): void => {
    setTimeout(() => {
      if (this.text === message) {
        this.text = "";
      }
    }, DISPLAY_TIMER);
    this.text = message;
  };

  connectedCallback(): void {
    super.connectedCallback();

    store.subscribe(() => {
      const state = store.getState();
      this.text = "";
      switch (state.dbViewerMode) {
        case DbViewerMode.CreateTable:
          if (!state.dialog.tableDialog.open) {
            this.text = texts.hint.tableCreation;
          }
          break;
        case DbViewerMode.RelationOneToMany:
        case DbViewerMode.RelationOneToOne:
        case DbViewerMode.RelationZeroToMany:
        case DbViewerMode.RelationZeroToOne:
          this.text = texts.hint.relationCreation;
          break;
        case DbViewerMode.Remove:
          this.text = texts.hint.remove;
          break;
      }
    });

    window.addEventListener("keydown", (event) => {
      const state = store.getState();
      if (
        ((isMac && event.metaKey) || (!isMac && event.ctrlKey)) &&
        event.key === "s" &&
        state.cloud.provider !== CloudProvider.None &&
        !state.dialog.tableDialog.open &&
        !state.dialog.newOpenDialog &&
        !state.dialog.aboutDialog &&
        state.dialog.fileOpenChooserDialog === FileOpenChooserDialogState.Close
      ) {
        this.#showTimedMessage(texts.hint.driveSave);
        event.preventDefault();
      }
    });
  }
}
