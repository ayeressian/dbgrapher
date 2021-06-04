import { CSSResultGroup, TemplateResult, css, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import buttonCss from "purecss/build/buttons-min.css";
import { DBGElement } from "../dbg-element";

@customElement("dbg-confirmation-dialog")
export default class ConfirmationDialog extends DBGElement {
  private static instance: ConfirmationDialog;
  private static resultResolve: (result: boolean) => void;
  private static result?: Promise<boolean>;

  @property({ type: Boolean })
  open = false;

  @property()
  message = "";

  @property()
  confirmText = "";

  @property()
  cancelText = "";

  static get styles(): CSSResultGroup {
    return css`
      ${unsafeCSS(buttonCss)}

      .row {
        margin-top: 20px;
      }
    `;
  }

  render(): TemplateResult {
    return html`
      <dbg-dialog ?show=${this.open} @dbg-on-escape="${this.#cancel}">
        <div slot="body">
          <div>${this.message}</div>
          <div class="row">
            <button
              class="pure-button"
              @click="${this.#confirm}"
              data-testid="confirm-dialog-confirm-btn"
            >
              ${this.confirmText}
            </button>
            <button
              class="pure-button"
              @click="${this.#cancel}"
              data-testid="confirm-dialog-cancel-btn"
            >
              ${this.cancelText}
            </button>
          </div>
        </div>
      </dbg-dialog>
    `;
  }

  #confirm = (): void => {
    this.message = "";
    this.open = false;
    ConfirmationDialog.resultResolve(true);
    ConfirmationDialog.result = undefined;
  };

  #cancel = (): void => {
    if (this.open) {
      this.message = "";
      this.open = false;
      ConfirmationDialog.resultResolve(false);
      ConfirmationDialog.result = undefined;
    }
  };

  constructor() {
    super();
    if (ConfirmationDialog.instance)
      throw new Error(
        "ConfirmationDialog is singlton. ConfirmationDialog instance already exist."
      );
    ConfirmationDialog.instance = this;
  }

  static confirm(
    message: string,
    confirmText = "Confirm",
    cancelText = "Cancel"
  ): Promise<boolean> {
    ConfirmationDialog.instance.message = message;
    ConfirmationDialog.instance.open = true;
    ConfirmationDialog.instance.confirmText = confirmText;
    ConfirmationDialog.instance.cancelText = cancelText;
    if (ConfirmationDialog.result)
      throw new Error("Another unresolved confirmation dialog exist.");
    ConfirmationDialog.result = new Promise<boolean>((resolve) => {
      ConfirmationDialog.resultResolve = resolve;
    });

    return ConfirmationDialog.result;
  }
}
