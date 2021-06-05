import { CSSResultGroup, TemplateResult, css, html } from "lit";
import { DBGElement } from "../dbg-element";
import { styleMap } from "lit/directives/style-map";
import { classMap } from "lit/directives/class-map";
import { customElement, property } from "lit/decorators.js";

@customElement("dbg-dialog-operation")
export default class extends DBGElement {
  @property({ type: String }) text!: string;
  @property({ type: String }) icon!: string;
  @property({ type: Boolean }) selected = false;

  static get styles(): CSSResultGroup {
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
      }

      .operation-container.selected {
        background-color: #d68080;
      }
    `;
  }

  #onClick = (): void => {
    const newEvent = new CustomEvent("dbg-click");
    this.dispatchEvent(newEvent);
  };

  render(): TemplateResult {
    classMap;
    return html`
      <div
        class="operation-container ${classMap({ selected: this.selected })}"
        @click=${this.#onClick}
      >
        <div class="operation-icon-container">
          <div
            class="google-drive operation-icon"
            style=${styleMap({
              backgroundImage: `url(${this.icon})`,
            })}
          ></div>
        </div>
        <h4 class="operation">${this.text}</h4>
      </div>
    `;
  }
}
