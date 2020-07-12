import { LitElement, customElement, CSSResult, TemplateResult, css, html, property, unsafeCSS } from 'lit-element';
import buttonCss from 'purecss/build/buttons-min.css';

@customElement('dbg-confirmation-dialog')
export default class ConfirmationDialog extends LitElement {
  private static instance: ConfirmationDialog;
  private static resultResolve: (result: boolean) => void;
  private static result?: Promise<boolean>;

  @property()
  open = false;

  @property()
  message = '';

  static get styles(): CSSResult {
    return css`
      ${unsafeCSS(buttonCss)}
    `;
  }

  render(): TemplateResult {
    return html`
      <dbg-dialog ?show=${this.open} @dbg-on-escape="${this.#cancel}">
        <div slot="body">
          <div class="row">
            ${this.message}
          </div>
          <div class="row">
            <button class="pure-button" @click="${this.#confirm}" data-testid="confirm-dialog-confirm-btn">Confirm</button>
            <button class="pure-button" @click="${this.#cancel}" data-testid="confirm-dialog-cancel-btn">Cancel</button>
          </div>
        </div>
      </dbg-dialog>
    `;
  }

  #confirm = (): void => {
    this.message = '';
    this.open = false;
    ConfirmationDialog.resultResolve(true);
    ConfirmationDialog.result = undefined;
  };

  #cancel = (): void => {
    this.message = '';
    this.open = false;
    ConfirmationDialog.resultResolve(false);
    ConfirmationDialog.result = undefined;
  };

  constructor() {
    super();
    if (ConfirmationDialog.instance) throw new Error('ConfirmationDialog is singlton. ConfirmationDialog instance already exist.');
    ConfirmationDialog.instance = this;
  }

  static confirm(message: string): Promise<boolean> {
    ConfirmationDialog.instance.message = message;
    ConfirmationDialog.instance.open = true;
    if (ConfirmationDialog.result) throw new Error('Another unresolved confirmation dialog exist.');
    ConfirmationDialog.result = new Promise<boolean>(resolve => {
      ConfirmationDialog.resultResolve = resolve;
    });

    return ConfirmationDialog.result;
  }
}
