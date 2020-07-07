import { customElement, LitElement, CSSResult, css, TemplateResult, html, unsafeCSS, property } from 'lit-element';
import formsCss from 'purecss/build/forms-min.css';
import buttonCss from 'purecss/build/buttons-min.css';

@customElement('dbg-top-menu-center-popup')
export default class extends LitElement {
  @property({
    type: String,
  }) fileName = '';
  
  static get styles(): CSSResult {
    return css`
      ${unsafeCSS(formsCss)}
      ${unsafeCSS(buttonCss)}

      .center-popup {
        position: fixed;
        background-color: white;
        left: 50%;
        transform: translateX(-50%);
        margin-top: 5px;
        z-index: 1;
        padding:0 16px 0 16px;
        box-shadow: 0 2px 10px rgba(0,0,0,.2);
        border-radius: 5px;
      }
    `;
  }

  render(): TemplateResult {
    return html`
      <div class="center-popup">
        <form class="pure-form pure-form-stacked">
          <fieldset>
            <label for="file-name">File Name</label>
            <input type="text" id="file-name" .value=${this.fileName} />
          </fieldset>
          <button type="submit" class="pure-button pure-button-primary">Update</button>
        </form>
      </div>
    `;
  }
}