import { CSSResultGroup, TemplateResult, css, html } from "lit";
import {
  actions as dialogActions,
  DialogTypes,
} from "../../store/slices/dialog/dialogs";
import store from "../../store/store";
import { t } from "../../localization";
import { DBGElement } from "../dbg-element";
import { customElement, state } from "lit/decorators";

@customElement("dbg-about-dialog")
export default class extends DBGElement {
  @state()
  private open = false;

  static get styles(): CSSResultGroup {
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

    this.subscribe(
      (state) => state.dialog.dialogs.aboutDialog,
      (open) => {
        this.open = open;
      }
    );
  }

  #close = (): void => {
    if (this.open) {
      store.dispatch(dialogActions.close(DialogTypes.AboutDialog));
    }
  };
}
