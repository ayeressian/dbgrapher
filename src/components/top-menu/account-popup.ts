import { customElement, LitElement, CSSResult, css, TemplateResult, html, property, unsafeCSS } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { CloudState } from '../../store/slices/cloud';
import cloudProviderName from './cloud-provider-name';
import buttonCss from 'purecss/build/buttons-min.css';

@customElement('dbg-top-menu-account-popup')
export default class extends LitElement {
  @property( { type : Boolean } ) open = false;
  @property( { type : Object } ) cloudState?: CloudState;

  static get styles(): CSSResult {
    return css`
      ${unsafeCSS(buttonCss)}
      .right-popup {
        position: fixed;
        background-color: white;
        right: 10px;
        margin-top: 5px;
        z-index: 1;
        padding:16px;
        box-shadow: 0 2px 10px rgba(0,0,0,.2);
        border-radius: 5px;
      }

      .row {
        margin-bottom: 8px;
      }

      .hide {
        display: none;
      }
    `;
  }

  render(): TemplateResult {
    return html`
      <div class="right-popup ${classMap({hide: !this.open})}">
        <div class="row">
          You are logged in via ${cloudProviderName()} as ${this.cloudState?.userData?.name}.
        </div>
        <div class="row">
          ${this.cloudState?.userData?.email}
        </div>
        <div>
          <button class="pure-button-primary pure-button">Logout</button>
        </div>
      </div>
    `;
  }
}