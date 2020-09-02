import {
  customElement,
  CSSResult,
  TemplateResult,
  css,
  html,
  internalProperty,
} from "lit-element";
import { subscribe } from "../../subscribe-store";
import {
  actions as dialogActions,
  DialogTypes,
} from "../../store/slices/dialog/dialogs";
import store from "../../store/store";
import { t } from "../../localization";
import { DBGElement } from "../dbg-element";

@customElement("dbg-about-dialog")
export default class extends DBGElement {
  @internalProperty()
  private open = false;

  static get styles(): CSSResult {
    return css`
      p {
        width: 500px;
      }
    `;
  }

  render(): TemplateResult {
    return html`
      <dbg-dialog
        centerTitle="About"
        showClose
        ?show=${this.open}
        @dbg-on-close="${this.#close}"
        @dbg-on-escape="${this.#close}"
      >
        <div slot="body">
          <p>
            ${t((l) => l.dialog.about.text)}
            <br /><br />
            ${t((l) => l.dialog.about.footer)}
          </p>
        </div>
      </dbg-dialog>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();

    subscribe(
      (state) => state.dialog.dialogs.aboutDialog,
      (open) => {
        this.open = open;
      }
    );
  }

  #close = (): void => {
    store.dispatch(dialogActions.close(DialogTypes.AboutDialog));
  };
}
