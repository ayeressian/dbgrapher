import { LitElement, html, customElement, css, CSSResult, TemplateResult, property } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

@customElement('dbg-dialog')
export default class extends LitElement {
  @property({
    type: Boolean,
  }) show = false;

  static get styles(): CSSResult {
    return css`
      .dialog {
        position: fixed;
        z-index: 1;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background-color: rgba(0,0,0,0.4);
        display: flex;
        
        /* this is what centers your element in the fixed wrapper*/
        flex-flow: column nowrap;
        justify-content: center; /* aligns on vertical for column */
        align-items: center; /* aligns on horizontal for column */
      }

      .dialog.hide {
        display: none;
      }

      .dialog-content {
        background-color: rgba(255, 255, 255, 1);
        padding: 20px;
        border: 1px solid #888;
        width: 100%;

        display: flex;
        justify-content: center;
      }
    `;
  }

  render(): TemplateResult {
    return html`
      <div class="dialog ${classMap({ hide: !this.show })}">
        <div class="dialog-content">
          <slot>
          </slot>
        </div>
      </div>
    `;
  }
}
