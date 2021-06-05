import { html, css, CSSResultGroup, TemplateResult, unsafeCSS } from "lit";
import { customElement, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map";
import loadIcon from "../../asset/load.svg";
import { DBGElement } from "./dbg-element";

@customElement("dbg-load-screen")
export default class extends DBGElement {
  @state()
  private view = false;

  static get styles(): CSSResultGroup {
    return css`
      .overlay.hide {
        display: none;
      }

      .overlay {
        height: 100vh;
        width: 100vw;
        position: fixed;
        z-index: 2;
        left: 0;
        top: 0;
        background-color: rgba(255, 255, 255, 0.6);
        overflow-x: hidden;

        display: flex;
        align-items: center;
        justify-content: center;
      }

      .load-icon {
        width: 150px;
        height: 150px;
        background-image: url(${unsafeCSS(loadIcon)});
        background-size: cover;
        background-repeat: no-repeat;
      }
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.subscribe(
      (state) => state.loadScreen,
      (view) => {
        this.view = view;
      }
    );
  }

  render(): TemplateResult {
    return html`
      <div class=${classMap({ hide: !this.view, overlay: true })}>
        <div class="load-icon"></div>
      </div>
    `;
  }
}
