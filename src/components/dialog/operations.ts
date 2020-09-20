import {
  customElement,
  CSSResult,
  TemplateResult,
  css,
  html,
} from "lit-element";
import { DBGElement } from "../dbg-element";

@customElement("dbg-dialog-operations")
export default class extends DBGElement {
  static get styles(): CSSResult {
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
