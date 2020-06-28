import { LitElement, html, customElement, css, unsafeCSS, CSSResult, TemplateResult } from 'lit-element';
import { actions as dbViewerModeAction } from '../store/slices/db-viewer-mode';
import store from '../store/store';
import createIconImg from '../../asset/table.svg';
import relationOneToManyIcon from '../../asset/relation-one-to-many.svg';
import relationOneToOneIcon from '../../asset/relation-one-to-one.svg';
import relationZeroToOneIcon from '../../asset/relation-zero-to-one.svg';
import relationZeroToManyIcon from '../../asset/relation-zero-to-many.svg';
import { classMap } from 'lit-html/directives/class-map';
import { subscribe } from '../subscribe-store';
import DbViewerMode from '../store/slices/db-viewer-mode-type';
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
        height: 80px;

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
      
      .left_toolbar .action.create_relation_one_to_many {
        background-image: url(${unsafeCSS(relationOneToManyIcon)});
      }

      .left_toolbar .action.create_relation_zero_to_many {
        background-image: url(${unsafeCSS(relationZeroToManyIcon)});
      }

      .left_toolbar .action.create_relation_one_to_one {
        background-image: url(${unsafeCSS(relationOneToOneIcon)});
      }

      .left_toolbar .action.create_relation_zero_to_one {
        background-image: url(${unsafeCSS(relationZeroToOneIcon)});
      }

      .safari-height {
        height: calc(100% - 33px);
      }
    `;
  }

  #mode: DbViewerMode = DbViewerMode.None;

  render(): TemplateResult {
    return html`
      <ul class="left_toolbar ${classMap({'safari-height': isSafari})}">
        <li class="action create_table ${classMap({active: this.#mode === DbViewerMode.CreateTable})}"
          title="Create table"
          @click="${this.#changeMode(DbViewerMode.CreateTable)}"/>
        <li class="action create_relation_one_to_many ${classMap({active: this.#mode === DbViewerMode.RelationOneToMany})}"
          title="Create one to many relation"
          @click="${this.#changeMode(DbViewerMode.RelationOneToMany)}"/>
        <li class="action create_relation_zero_to_many ${classMap({active: this.#mode === DbViewerMode.RelationZeroToMany})}"
          title="Create zero to many relation"
          @click="${this.#changeMode(DbViewerMode.RelationZeroToMany)}"/>
        <li class="action create_relation_one_to_one ${classMap({active: this.#mode === DbViewerMode.RelationOneToOne})}"
          title="Create one to one relation"
          @click="${this.#changeMode(DbViewerMode.RelationOneToOne)}"/>
        <li class="action create_relation_zero_to_one ${classMap({active: this.#mode === DbViewerMode.RelationZeroToOne})}"
          title="Create zero to one relation"
          @click="${this.#changeMode(DbViewerMode.RelationZeroToOne)}"/>
      </ul>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();

    subscribe(state => state.dbViewerMode, dbViewerMode => {
      this.#mode = dbViewerMode;
      this.requestUpdate();
    });
  }

  #changeMode = (mode: DbViewerMode) => (): void => {
    if (store.getState().dbViewerMode === mode) {
      store.dispatch(dbViewerModeAction.none());
    } else {
      store.dispatch(dbViewerModeAction.changeMode(mode));
    }
  }
}
