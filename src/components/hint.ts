import { LitElement, customElement, css, CSSResult, TemplateResult, html } from 'lit-element';
import { IDbViewerMode } from '../store/slices/db-viewer-mode-interface';
import store from '../store/store';

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
        border-radius: 2px;
      }
    `;
  }

  render(): TemplateResult {
    return this.#text? html`
      <div>
        ${this.#text}
      </div>
    ` : html``;
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
  }
}
