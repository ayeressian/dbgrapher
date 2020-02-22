import { html, customElement, css, CSSResult, TemplateResult, LitElement, property } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { styleMap } from 'lit-html/directives/style-map';
import TopMenuConfig from '../store/slices/top-menu-config-interface';
import { Item } from '../store/slices/top-menu-config-interface';

@customElement('dbg-top-menu')
export default class extends LitElement {

  static get styles(): CSSResult {
    return css`
      * {
        font-family: Arial, Helvetica, sans-serif;
        cursor: default;
      }

      .menu-bar {
        list-style-type: none;
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: #d9d9d9;
      }

      .menu-bar > li {
        float: left;
        display: block;
        color: black;
        text-align: center;
        padding: 7px 8px;
        text-decoration: none;
      }

      .menu-bar > li.right-menu-item {
        float: right
      }

      li:hover {
        background-color: #bfbfbf;
      }

      .dropdown {
        position: fixed;
        top: 50px;
        left: 0;
        display: none;
        background-color: #cfcfcf;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
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
        border-bottom: 1px solid #bdbdbd;
      }

      .dropdown li:last-child {
        border-bottom: 0;
      }
    `;
  }

  @property( { type : Object } ) config?: TopMenuConfig;

  private dropdownItems?: Item[];
  private dropdownStyle = {};

  private onDocumentClick = (event: MouseEvent) => {
    if (event.composed && event.composedPath().indexOf(this) === -1) {
      this.dropdownItems = undefined;
      this.requestUpdate();
    }
  };

  private onComponentClick = (event: MouseEvent) => {
    if ((event.composedPath()[0] as HTMLElement).nodeName != 'LI') {
      this.dropdownItems = undefined;
      this.requestUpdate();
    }
  };

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.onComponentClick);
    document.addEventListener('click', this.onDocumentClick);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.onComponentClick);
    document.removeEventListener('click', this.onDocumentClick);
    super.disconnectedCallback();
  }

  render(): TemplateResult {
    return html`
      <ul class="menu-bar">
        ${
          (this.config?.items ?? []).map(menuItem => html`<li @click="${(event: Event) => this.onMenuItemClick(event, menuItem)}">${menuItem.title}</li>`)
        }
        ${
          (this.config?.rightItems ?? []).map(menuItem => html`<li class="right-menu-item" @click="${(event: Event) => this.onMenuItemClick(event, menuItem)}">${menuItem.title}</li>`)
        }
      </ul>
      <div class="${classMap({dropdown: true, show: this.dropdownItems != null})}" style="${styleMap(this.dropdownStyle)}">
        <ul>
          ${
            (this.dropdownItems ?? []).map(dropdownItem => html`<li @click="${() => this.onDropdownItemClick(dropdownItem)}">${dropdownItem.title}</li>`)
          }
        </ul>
      </div>
    `;
  }

  private itemSelected(item: Item) {
    const event = new CustomEvent('item-selected', {
      detail: {
        id: item.id
      }
    });
    this.dispatchEvent(event);
  }

  private onDropdownItemClick = (item: Item) => {
    this.itemSelected(item);
    this.dropdownItems = undefined;
    this.requestUpdate();
  }

  private onMenuItemClick = (event: Event, item: Item) => {
    this.itemSelected(item);
    const viewportOffset = (event.target! as HTMLElement).getBoundingClientRect();

    if (item.items != null) {
      this.dropdownStyle = {
        top: viewportOffset.bottom + 'px',
        left: viewportOffset.left + 'px'
      };
      this.dropdownItems = item.items;
    } else {
      this.dropdownItems = undefined;
    }
    this.requestUpdate();
  }
};