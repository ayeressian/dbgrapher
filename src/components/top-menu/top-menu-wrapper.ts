import { html, customElement, TemplateResult, LitElement, CSSResult, css, unsafeCSS } from 'lit-element';
import { actions as schemaAction } from '../../store/slices/schema';
import { actions as setSchemaAction } from '../../store/slices/load-schema';
import { actions as fileOpenChooserAction } from "../../store/slices/dialog/file-open-chooser-dialog";
import { actions as aboutDialogActions } from "../../store/slices/dialog/about-dialog";
import store from '../../store/store';
import { download } from '../../util';
import { Schema } from 'db-viewer-component';
import schemaToSqlSchema from '../../schema-to-sql-schema';
import { classMap } from 'lit-html/directives/class-map';
import { subscribe } from '../../subscribe-store';
import buttonCss from 'purecss/build/buttons-min.css';
import { CloudProvider } from '../../store/slices/cloud';
import topMenuConfig from './top-menu-config';
import ColorHash from 'color-hash';
import { styleMap } from 'lit-html/directives/style-map';

const colorHash = new ColorHash({saturation: 0.5});

@customElement('dbg-top-menu-wrapper')
export default class extends LitElement {

  #cloudProvider: CloudProvider = store.getState().cloud.provider;
  #openCenterPopup = false;
  #openRightPopup = false;
  #centerPopup?: HTMLElement;
  #rightPopup?: HTMLElement;

  static get styles(): CSSResult {
    return css`
      ${unsafeCSS(buttonCss)}

      .menu {
        display: flex;
        justify-content: center;
        padding-left: 0;
      }

      [slot="center"], [slot="right"] {
        height: 33px;
        line-height: 33px;
      }

      .hide {
        display: none;
      }

      .user_picture {
        width: 33px;
        height: 33px;
      }

      .user_picture_initial {
        width: 33px;
        height: 33px;
        text-align: center;
        color: white;
      }
    `;
  }

  #providerName = (): string => this.#cloudProvider === CloudProvider.GoogleDrive ? 'Google Drive' : 'OneDrive';

  render(): TemplateResult {
    const fileName = 'Untitled';
    const text = `${fileName} - Saved to ${this.#providerName()}`;
    const cloudState = store.getState().cloud;
    return html`
      <dbg-top-menu .config="${topMenuConfig}" @item-selected="${this.#itemSelected}">
        <div slot="center" class="${classMap({ hide: this.#cloudProvider === CloudProvider.None })}" @click="${this.#onCenterClick}">
          ${text}
        </div>

        <div slot="right" class="${classMap({ hide: this.#cloudProvider === CloudProvider.None })}" @click="${this.#onAccountClick}">
          ${cloudState.userData?.picture ? 
            html`<img class="user_picture" src=${cloudState.userData?.picture} />` : 
            html`<div class="user_picture_initial" style=${styleMap({ backgroundColor: colorHash.hex(cloudState.userData?.name ?? '') })}>${cloudState.userData?.name.charAt(0)}</div>`}
        </div>
      </dbg-top-menu>

      <dbg-top-menu-center-popup class="${classMap({ hide: !this.#openCenterPopup })}"></dbg-top-menu-center-popup>

      <dbg-top-menu-account-popup class="${classMap({ hide: !this.#openRightPopup })}" .cloudState=${cloudState}></dbg-top-menu-account-popup>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    subscribe(state => state.cloud.provider, cloudProvider => {
      this.#cloudProvider = cloudProvider;
      this.requestUpdate();
    });

    document.addEventListener('click', this.#onDocumentClick, true);
  }

  firstUpdated(): void {
    this.#centerPopup = this.shadowRoot!.querySelector('dbg-top-menu-center-popup') as HTMLElement;
    this.#rightPopup = this.shadowRoot!.querySelector('dbg-top-menu-account-popup') as HTMLElement;
  }

  #onDocumentClick = (event: MouseEvent): void => {
    if (event.composed) {
      if (!event.composedPath().includes(this.#centerPopup!) && this.#openCenterPopup) {
        this.#openCenterPopup = false;
        this.requestUpdate();
      }

      if (!event.composedPath().includes(this.#rightPopup!) && this.#openRightPopup) {
        this.#openRightPopup = false;
        this.requestUpdate();
      }
    }
  };

  #getCurrentSchema = (): Schema => {
    return store.getState().schema.present;
  };

  #downloadAsSQLSchema = (): void => {
    const schema = this.#getCurrentSchema();
    const result = schemaToSqlSchema(schema);
    download(result, 'schema.sql', 'text/plain');
  };

  #itemSelected = (event: CustomEvent): void => {
    switch(event.detail.id) {
      case 'new':
        store.dispatch(schemaAction.initiate());
        store.dispatch(setSchemaAction.load());
        break;
      case 'open':
        store.dispatch(fileOpenChooserAction.open(false));
        break;
      case 'downloadSchema':
        download(JSON.stringify(store.getState().schema.present), 'schema.json', 'application/json');
        break;
      case 'exportSql':
        this.#downloadAsSQLSchema();
        break;
      case 'reportIssue':
        {
          const win = window.open('https://github.com/ayeressian/dbgrapher/issues', '_blank');
          win!.focus();
        }
        break;
      case 'gitHub':
        {
          const win = window.open('https://github.com/ayeressian/dbgrapher', '_blank');
          win!.focus();
        }
        break;
      case 'about':
        store.dispatch(aboutDialogActions.open());
        break;
    }
  }

  #onCenterClick = (): void => {
    if (!this.#openCenterPopup) this.#openCenterPopup = true;
    this.requestUpdate();
  }

  #onAccountClick = (): void => {
    if (!this.#openRightPopup) this.#openRightPopup = true;
    this.requestUpdate();
  }
}