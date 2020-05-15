import { LitElement, html, customElement, css, CSSResult, TemplateResult, property, unsafeCSS } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import goBackSvg from '@fortawesome/fontawesome-free/svgs/regular/arrow-alt-circle-left.svg';
import closeSvg from '@fortawesome/fontawesome-free/svgs/regular/times-circle.svg';

export type OnCloseEvent = CustomEvent;

@customElement('dbg-dialog')
export default class extends LitElement {
  @property({
    type: Boolean,
  }) show = false;

  @property({
    type: Boolean,
  }) showBack = false;

  @property({
    type: Boolean,
  }) showClose = false;

  @property({
    type: String,
  }) title = '';

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

      .head {
        display: flex;
        justify-content: center;
        width: 100vw;
      }

      .head .title {
        text-align: center;
        margin: 0;
        line-height: 70px;
      }

      .icons > div {
        width: 50px;
        height: 50px;
        filter: opacity(60%);
        background-repeat: no-repeat;
        background-size: cover;
      }

      .icons > div:hover {
        filter: opacity(100%);
      }

      .icons {
        position: absolute;
        left: 100px;
        padding-top: 10px;
      }

      .go-back-icon {
        background-image: url(${unsafeCSS(goBackSvg)});
      }

      .close-icon {
        background-image: url(${unsafeCSS(closeSvg)});
      }

      .containter {
        background-color: rgba(255, 255, 255, 1);
        width: 100%;
      }

      ::slotted(*) {
        padding: 20px;
        display: flex;
        justify-content: center;
      }

      .hide {
        display: none;
      }
    `;
  }

  render(): TemplateResult {
    return html`
      <div class="dialog ${classMap({ hide: !this.show })}">
        <div class="containter">
          <slot name="head">
            <div class="head ${classMap({ hide: !this.showClose && !this.showBack && this.title === ''})}">
              <div class="icons">
                <div class="close-icon ${classMap({ hide: !this.showClose })}" @click="${this.#close}">
                </div>
                <div class="go-back-icon ${classMap({ hide: !this.showBack })}" @click="${this.#back}">
                </div>
              </div>
              <h2 class="title">${this.title}</h2>
            </div>
          </slot>
          <slot name="body">
          </slot>
        </div>
      </div>
    `;
  }

  #close = (): void => {  
    const closeEvent = new CustomEvent('dbg-on-close');
    this.dispatchEvent(closeEvent);
  };

  #back = (): void => {
    const closeEvent = new CustomEvent('dbg-on-back');
    this.dispatchEvent(closeEvent);
  }
}
