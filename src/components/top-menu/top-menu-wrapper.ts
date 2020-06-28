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

@customElement('dbg-top-menu-wrapper')
export default class extends LitElement {

  #cloudProvider: CloudProvider = store.getState().cloud.provider;
  #openCenterPopup = false;
  #openRightPopup = false;

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

      .right-popup {
        position: fixed;
        height: 100px;
        background-color: white;
        left: 50%;
        transform: translateX(-90%);
        margin-top: 5px;
        z-index: 1;
        padding:16px;
        border
      }
    `;
  }

  #providerName = (): string => this.#cloudProvider === CloudProvider.GoogleDrive ? 'Google Drive' : 'OneDrive';

  render(): TemplateResult {
    const fileName = 'Untitled';
    const text = `${fileName} - Saved to ${this.#providerName()}`;
    return html`
      <dbg-top-menu .config="${topMenuConfig}" @item-selected="${this.#itemSelected}">
        <div slot="center" class="${classMap({ hide: this.#cloudProvider === CloudProvider.None })}" @click="${this.#onCenterClick}">
          ${text}
        </div>

        <div slot="right" class="${classMap({ hide: this.#cloudProvider === CloudProvider.None })}" @click="${this.#onAccountClick}">
          ${store.getState().cloud.userData?.name}
        </div>
      </dbg-top-menu>

      <dbg-top-menu-center-popup ?open=${this.#openCenterPopup}></dbg-top-menu-center-popup>

      <div class="right-popup ${classMap({hide: !this.#openRightPopup})}">
        test
      </div>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    subscribe(state => state.cloud.provider, cloudProvider => {
      this.#cloudProvider = cloudProvider;
      this.requestUpdate();
    });
  }

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
    this.#openCenterPopup = true;
    this.requestUpdate();
  }

  #onAccountClick = (): void => {
    this.#openRightPopup = true;
    this.requestUpdate();
  }
}