import {
  customElement,
  CSSResult,
  TemplateResult,
  css,
  html,
  property,
} from "lit-element";
import { DBGElement } from "../dbg-element";

@customElement("dbg-dialog-operation")
export default class extends DBGElement {
  @property({ type: String }) text!: string;
  @property({ type: String }) icon!: string;

  static get styles(): CSSResult {
    return css`
      .operations {
        display: flex;
        flex-direction: horizontal;
      }
    `;
  }

  #onClick = (): void => {
    const newEvent = new CustomEvent("dbg-click");
    this.dispatchEvent(newEvent);
  };

  render(): TemplateResult {
    return html` <div class="operations"></div> `;
  }
}
