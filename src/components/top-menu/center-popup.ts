import { customElement, LitElement, CSSResult, css, TemplateResult, html, property } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

@customElement('dbg-top-menu-center-popup')
export default class extends LitElement {
  @property( { type : Boolean } ) open = false;

  static get styles(): CSSResult {
    return css`
      .center-popup {
        position: fixed;
        height: 100px;
        background-color: white;
        left: 50%;
        transform: translateX(-50%);
        margin-top: 5px;
        z-index: 1;
        padding:16px;
        border
      }

      .hide {
        display: none;
      }
    `;
  }

  render(): TemplateResult {
    const fileName = 'Untitled';
    return html`
      <div class="center-popup ${classMap({hide: !this.open})}">
        <div>
          File Name
        </div>
        <input type="text" .value=${fileName} />
      </div>
    `;
  }
}