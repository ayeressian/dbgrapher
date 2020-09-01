import {
  customElement,
  CSSResult,
  TemplateResult,
  css,
  html,
  property,
} from "lit-element";
import { DBGElement } from "../dbg-element";
import { styleMap } from "lit-html/directives/style-map";

@customElement("dbg-dialog-operation")
export default class extends DBGElement {
  @property({ type: String }) text!: string;
  @property({ type: String }) icon!: string;

  static get styles(): CSSResult {
    return css`
      .operation-icon {
        width: 100px;
        height: 100px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center center;
      }

      .operation-icon-container {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .operation-container {
        padding: 10px;
        margin: 10px;
        width: 200px;
        text-align: center;
        background-color: white;
      }

      .operation-container:hover {
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.05);
        background-blend-mode: multiply;
      }
    `;
  }

  #onClick = (): void => {
    const newEvent = new CustomEvent("dbg-click");
    this.dispatchEvent(newEvent);
  };

  render(): TemplateResult {
    return html`
      <div class="operation-container" @click=${this.#onClick}>
        <div class="operation-icon-container">
          <div
            class="google-drive operation-icon"
            style=${styleMap({
              backgroundImage: `url(${this.icon})`,
            })}
          ></div>
        </div>
        <h4 class="operation">
          ${this.text}
        </h4>
      </div>
    `;
  }
}
