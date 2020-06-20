import { LitElement, customElement, css, CSSResult, TemplateResult, html } from 'lit-element';
import { IDbViewerMode } from '../store/slices/db-viewer-mode-interface';
import store from '../store/store';
import { isMac } from '../util';
import { State as FileOpenChooserDialogState } from '../store/slices/file-open-chooser-dialog';

const DISPLAY_TIMER = 5000;

@customElement('dbg-hint')
export default class extends LitElement {

  #text = '';

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
    return this.#text ? html`
      <div>
        ${this.#text}
      </div>
    ` : html``;
  }

  #showTimedMessage = (message: string): void => {
    setTimeout(() => {
      if (this.#text === message) {
        this.#text = '';
        this.requestUpdate();
      }
    }, DISPLAY_TIMER);
    this.#text = message;
    this.requestUpdate();
  }

  connectedCallback(): void {
    super.connectedCallback();

    store.subscribe(() => {
      const state = store.getState();
      this.#text = '';
      if (state.dbViewerMode === IDbViewerMode.CreateTable && !state.dialog.tableDialog.open) {
        this.#text = 'Choose the position of the new table by clicking on the viewport';
      }
      if (state.dbViewerMode !== IDbViewerMode.None && state.dbViewerMode !== IDbViewerMode.CreateTable) {
        this.#text = 'Click on the first table to create the relation from and then click on the second table to create the relation to';
      }
      this.requestUpdate();
    });

    window.addEventListener('keydown', (event) => {
      const state = store.getState();
      if (((isMac && event.metaKey) ||
        (!isMac && event.ctrlKey)) &&
        event.key === 's' &&
        state.googleDriveKey != null &&
        !state.dialog.tableDialog.open &&
        !state.dialog.welcomeDialog &&
        !state.dialog.aboutDialog &&
        state.dialog.fileOpenChooserDialog === FileOpenChooserDialogState.Close) {
        this.#showTimedMessage('Your changes will be automatically saved to Google drive');
      }
      event.preventDefault();
    });
  }
}
