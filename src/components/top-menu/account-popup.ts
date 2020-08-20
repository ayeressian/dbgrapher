import {
  customElement,
  CSSResult,
  css,
  TemplateResult,
  html,
  property,
  unsafeCSS,
} from "lit-element";
import { CloudState } from "../../store/slices/cloud";
import cloudProviderName from "./cloud-provider-name";
import buttonCss from "purecss/build/buttons-min.css";
import { t } from "../../localization";
import { DBGElement } from "../dbg-element";

@customElement("dbg-top-menu-account-popup")
export default class extends DBGElement {
  @property({ type: Object }) cloudState!: CloudState;

  static get styles(): CSSResult {
    return css`
      ${unsafeCSS(buttonCss)}
      .right-popup {
        position: fixed;
        background-color: white;
        right: 10px;
        margin-top: 5px;
        z-index: 1;
        padding: 16px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        border-radius: 5px;
      }

      .row {
        margin-bottom: 8px;
      }
    `;
  }

  render(): TemplateResult {
    return html`
      <div class="right-popup">
        <div class="row">
          ${t((l) => l.topMenu.accountPopup.text, {
            cloudProvider: cloudProviderName(),
            userIdentifier: this.cloudState.userData?.name ?? "",
          })}
        </div>
        <div class="row">
          ${this.cloudState.userData?.email}
        </div>

        <div>
          <button
            class="pure-button-primary pure-button"
            @click=${this.#onLogout}
          >
            ${t((l) => l.topMenu.accountPopup.logout)}
          </button>
        </div>
      </div>
    `;
  }

  #onLogout = (): void => {
    const event = new CustomEvent("dbg-logout");
    this.dispatchEvent(event);
  };
}
