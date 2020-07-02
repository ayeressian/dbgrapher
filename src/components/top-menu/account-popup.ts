import { customElement, LitElement, CSSResult, css, TemplateResult, html, property } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { CloudState } from '../../store/slices/cloud';
import cloudProviderName from './cloud-provider-name';

@customElement('dbg-top-menu-account-popup')
export default class extends LitElement {
  @property( { type : Boolean } ) open = false;
  @property( { type : Object } ) cloudState?: CloudState;

  static get styles(): CSSResult {
    return css`
      .right-popup {
        position: fixed;
        height: 100px;
        background-color: white;
        right: 10px;
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
    return html`
      <div class="right-popup ${classMap({hide: !this.open})}">
        <div>
          You logged in via ${cloudProviderName()} as ${this.cloudState?.userData?.name}.
        </div>
        <div>
          ${this.cloudState?.userData?.email}
        </div>
        <div>
          <button>Logout</button>
        </div>
      </div>
    `;
  }
}