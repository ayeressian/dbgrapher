import { LitElement, html, customElement, css, unsafeCSS, CSSResult, TemplateResult } from 'lit-element';
import { actions as dbViewerModeAction } from '../store/slices/db-viewer-mode';
import store from '../store/store';
import createIconImg from '../../asset/table.svg';
import relationIconImg from '../../asset/relation.svg';
import { classMap } from 'lit-html/directives/class-map';
import { subscribe } from '../subscribe-store';
import { IDbViewerMode } from '../store/slices/db-viewer-mode-interface';
import { isSafari } from '../util';

@customElement('dbg-side-panel')
export default class extends LitElement {
  static get styles(): CSSResult {
    return css`
      .left_toolbar {
        padding: 0;
        margin: 0;

        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      
      .left_toolbar .action {
        width: 60px;
        height: 60px;

        list-style-type: none;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 35px;
      }
      
      .left_toolbar .action:hover {
        background-color: #dddddd;
      }
      
      .left_toolbar .action.active {
        background-color: #d68080;
      }
      
      .left_toolbar .action.create_table {

        background-image: url(${unsafeCSS(createIconImg)});
      }
      
      .left_toolbar .action.create_relation {
        background-image: url(${unsafeCSS(relationIconImg)});
      }

      .safari-height {
        height: calc(100% - 33px);
      }
    `;
  }

  #createActive = false;
  #relationActive = false;

  render(): TemplateResult {
    return html`
      <ul class="left_toolbar ${classMap({'safari-height': isSafari})}">
        <li class="action create_table ${classMap({active: this.#createActive})}" title="Create Table" @click="${this.#create}"></li>
        <li class="action create_relation ${classMap({active: this.#relationActive})}" title="Create Relation" @click="${this.#relation}"></li>
      </ul>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();

    subscribe(state => state.dbViewerMode, (dbViewerMode) => {
      switch(dbViewerMode) {
        case IDbViewerMode.Create:
          this.#createActive = true;
          this.#relationActive = false;
          break;
        case IDbViewerMode.Relation:
          this.#createActive = false;
          this.#relationActive = true;
          break;
        default:
          this.#createActive = false;
          this.#relationActive = false;
          break;
      }
      this.requestUpdate();
    });
  }

  #create = (): void => {
    if (store.getState().dbViewerMode === IDbViewerMode.Create) {
      store.dispatch(dbViewerModeAction.none());
    } else {
      store.dispatch(dbViewerModeAction.createMode());
    }
  }

  #relation = (): void => {
    if (store.getState().dbViewerMode === IDbViewerMode.Relation) {
      store.dispatch(dbViewerModeAction.none());
    } else {
      store.dispatch(dbViewerModeAction.relationMode());
    }
  }
}
