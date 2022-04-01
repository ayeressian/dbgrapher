import { html, css, CSSResultGroup, TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import { TopMenuConfig, Item } from "./top-menu-config";
import { DBGElement } from "../dbg-element";
import { customElement, property, state } from "lit/decorators.js";

@customElement("dbg-top-menu")
export default class extends DBGElement {
  static get styles(): CSSResultGroup {
    return css`
      * {
        cursor: default;
      }

      .menu-bar {
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: #d9d9d9;
        height: 33px;
        width: 100%;
      }

      .left {
        float: left;
        width: min-content;
      }

      [name="center"] {
        margin: 0 auto;
        width: max-content;
        display: block;
      }

      [name="right"] {
        float: right;
        display: block;
      }

      .menu-bar .right {
        display: flex;
      }

      .menu-bar .left {
        display: flex;
      }

      .menu-bar .item {
        color: #333;
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
        margin-top: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        border-radius: 5px;
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

  @property({ type: Object }) config?: TopMenuConfig;

  @state()
  private dropdownItems?: Item[];

  @state()
  private dropdownStyle = {};

  #onDocumentClick = (event: MouseEvent): void => {
    if (event.composed && !event.composedPath().includes(this)) {
      this.dropdownItems = undefined;
    }
  };

  #onComponentClick = (event: MouseEvent): void => {
    if (
      !(event.composedPath()[0] as HTMLElement).classList.contains("menu-item")
    ) {
      this.dropdownItems = undefined;
    }
  };

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("click", this.#onComponentClick);
    document.addEventListener("click", this.#onDocumentClick);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.#onComponentClick);
    document.removeEventListener("click", this.#onDocumentClick);
  }

  render(): TemplateResult {
    return html`
      <div class="menu-bar">
        <div class="left">
          ${(this.config?.items ?? []).map(
            (menuItem) =>
              html`<div
                @click="${(event: Event): void =>
                  this.#onMenuItemClick(event, menuItem)}"
                class="item menu-item"
              >
                ${menuItem.title}
              </div>`
          )}
        </div>
        <slot name="right"> </slot>
        <slot name="center"> </slot>
      </div>
      <div
        class="${classMap({
          dropdown: true,
          show: this.dropdownItems != null,
        })}"
        style="${styleMap(this.dropdownStyle)}"
      >
        <ul>
          ${(this.dropdownItems ?? []).map(
            (dropdownItem) =>
              html`<li
                @click="${(): void => this.#onDropdownItemClick(dropdownItem)}"
                class="menu-item"
              >
                ${dropdownItem.title}
              </li>`
          )}
        </ul>
      </div>
    `;
  }

  #itemSelected = (item: Item): void => {
    const event = new CustomEvent<{ id: string }>("item-selected", {
      detail: {
        id: item.id,
      },
    });
    this.dispatchEvent(event);
  };

  #onDropdownItemClick = (item: Item): void => {
    this.#itemSelected(item);
    this.dropdownItems = undefined;
  };

  #onMenuItemClick = (event: Event, item: Item): void => {
    this.#itemSelected(item);
    const viewportOffset = (
      event.target! as HTMLElement
    ).getBoundingClientRect();

    if (item.items != null) {
      this.dropdownStyle = {
        top: `${viewportOffset.bottom}px`,
        left: `${viewportOffset.left}px`,
      };
      this.dropdownItems = item.items;
    } else {
      this.dropdownItems = undefined;
    }
  };
}
