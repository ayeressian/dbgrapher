import './side-panel';
import './dialog';
import './welcome-dialog';
import { LitElement, html, customElement, css, CSSResult, TemplateResult } from 'lit-element';

@customElement('dbg-app')
export default class extends LitElement {
  static get styles(): CSSResult {
    return css`
      * {
        font-family: Arial, Helvetica, sans-serif;
      }
      
      body {
        margin: 0;
      }
      
      .main_container {
        display: grid;
        grid-template-columns: 60px 1fr;
        grid-template-rows: 32px 1fr;
        width: 100vw;
        height: 100vh;
      }
      
      dbg-side-panel {
        grid-row: 2;
      }
      
      dbg-db-viewer {
        grid-row: 2;
      }
      
      dbg-menu-bar {
        grid-column: 1 / 3;
        grid-row: 1;
      }
    `;
  }

  render(): TemplateResult {
    return html`
      <div class="main_container">
        <dbg-side-panel></dbg-side-panel>
        <dbg-welcome-dialog></dbg-welcome-dialog>
      </div>
    `;
  }
}
