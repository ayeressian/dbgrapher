import initProviderFactory from '../drive/factory';
import './import-components';
import { LitElement, html, customElement, css, CSSResult, TemplateResult } from 'lit-element';

initProviderFactory();

@customElement('dbg-app')
export default class extends LitElement {
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

        --theme-primary: rgb(217, 217, 217);
        --theme-text-color: #333;
        --theme-orange: #FF6C00;
        --theme-font-family: Roboto;
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
      </div>
    `;
  }
}
