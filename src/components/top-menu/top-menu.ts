import { html, customElement, css, CSSResult, TemplateResult, LitElement, property } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { styleMap } from 'lit-html/directives/style-map';
import { TopMenuConfig, Item } from './top-menu-config';

@customElement('dbg-top-menu')
export default class extends LitElement {

  static get styles(): CSSResult {
    return css`
      * {
        cursor: default;
      }

      .menu-bar {
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: #d9d9d9;
        display: flex;
        height: 33px;
        justify-content: space-between;
      }
      .menu-bar .right {
        display: flex;
      } 

      .menu-bar .left {
        justify-content: center;
      }

      .menu-bar .left {
        display: flex;
      }

      .menu-bar .item {
        color: black;
        text-align: center;
        padding: 7px 8px;
        text-decoration: none;
      }

      .menu-item:hover {
        background-color: #bfbfbf;
      }

      .dropdown {
        position: fixed;
        top: 50px;
        left: 0;
        display: none;
        background-color: #d9d9d9;
        z-index: 1;
        min-width: 160px;
        padding: 0;
      }

      .dropdown ul {
        padding: 0;
        margin: 0;
      }

      .dropdown.show {
        display: inline-block;
      }

      .dropdown li {
        list-style-type: none;
        height: 2em;
        line-height: 2em;
        padding-left: 20px;
        padding-right: 20px;
      }

      .dropdown li:last-child {
        border-bottom: 0;
      }
    `;
  }

  @property( { type : Object } ) config?: TopMenuConfig;

  #dropdownItems?: Item[];
  #dropdownStyle = {};

  #onDocumentClick = (event: MouseEvent): void => {
    if (event.composed && !event.composedPath().includes(this)) {
      this.#dropdownItems = undefined;
      this.requestUpdate();
    }
  };

  #onComponentClick = (event: MouseEvent): void => {
    if (!(event.composedPath()[0] as HTMLElement).classList.contains('menu-item')) {
      this.#dropdownItems = undefined;
      this.requestUpdate();
    }
  };

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', this.#onComponentClick);
    document.addEventListener('click', this.#onDocumentClick);
  }

  disconnectedCallback(): void {
    this.removeEventListener('click', this.#onComponentClick);
    document.removeEventListener('click', this.#onDocumentClick);
    super.disconnectedCallback();
  }

  render(): TemplateResult {
    return html`
      <div class="menu-bar">
        <div class="left">
          ${
            (this.config?.items ?? []).map(menuItem => html`<div @click="${(event: Event): void => this.#onMenuItemClick(event, menuItem)}" class="item menu-item">${menuItem.title}</div>`)
          }
        </div>
        <slot name="center">
        </slot>

        <slot name="right">
        </slot>
      </div>
      <div class="${classMap({dropdown: true, show: this.#dropdownItems != null})}" style="${styleMap(this.#dropdownStyle)}">
        <ul>
          ${
            (this.#dropdownItems ?? []).map(dropdownItem => html`<li @click="${(): void => this.#onDropdownItemClick(dropdownItem)}" class="menu-item">${dropdownItem.title}</li>`)
          }
        </ul>
      </div>
    `;
  }

  #itemSelected = (item: Item): void => {
    const event = new CustomEvent<{id: string}>('item-selected', {
      detail: {
        id: item.id
      }
    });
    this.dispatchEvent(event);
  }

  #onDropdownItemClick = (item: Item): void => {
    this.#itemSelected(item);
    this.#dropdownItems = undefined;
    this.requestUpdate();
  }

  #onMenuItemClick = (event: Event, item: Item): void => {
    this.#itemSelected(item);
    const viewportOffset = (event.target! as HTMLElement).getBoundingClientRect();

    if (item.items != null) {
      this.#dropdownStyle = {
        top: viewportOffset.bottom + 'px',
        left: viewportOffset.left + 'px'
      };
      this.#dropdownItems = item.items;
    } else {
      this.#dropdownItems = undefined;
    }
    this.requestUpdate();
  }
}
