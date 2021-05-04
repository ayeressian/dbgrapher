import { CSSResultGroup, TemplateResult, css, html } from "lit";
import { customElement } from "lit/decorators";
import { DBGElement } from "../dbg-element";

@customElement("dbg-dialog-operations")
export default class extends DBGElement {
  static get styles(): CSSResultGroup {
    return css`
      .operations {
        display: flex;
        flex-wrap: wrap;
        flex-direction: horizontal;
      }
    `;
  }

  render(): TemplateResult {
    return html` <div class="operations"><slot></slot></div> `;
  }
}
