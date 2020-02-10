import { LitElement, html, customElement, css, CSSResult, TemplateResult } from 'lit-element';
import store from '../store/store';
// import { actions as welcomeDialogActions } from '../store/slices/welcomeDialog';

@customElement('dbg-welcome-dialog')
export default class extends LitElement{
  constructor() {
    super();
  }

  static get styles(): CSSResult {
    return css`
      .operation {
        color: #0a70b4;
        cursor: pointer;
      }
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();

    store.subscribe(() => {
      const open = store.getState().dialog.welcomeDialog;
      if (!open) {
        open
      }
    });
  }

  render(): TemplateResult {
    return html`
      <dbg-dialog show>
        <div>
          <h4 class="operation" id="new-file">New File</h4>
          <h4 class="operation" id="open-file">Open File</h4>
          <h4 class="operation" id="import-sql-file">Import SQL File</h4>
        </div>
      </dbg-dialog>
    `;
  }
}
