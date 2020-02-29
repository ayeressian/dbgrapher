import { LitElement, html, customElement, css, unsafeCSS, CSSResult, TemplateResult } from 'lit-element';
import { actions as dbViewerModeAction } from '../store/slices/db-viewer-mode';
import store from '../store/store';
import createIconImg from '../../asset/icon_create_table_48x48.png';
import relationIconImg from '../../asset/icon_create_relation_48x48.png';

@customElement('dbg-side-panel')
export default class extends LitElement {
  static get styles(): CSSResult {
    return css`
      .left_toolbar {
        padding: 0;
        margin: 0;
      }
      
      .left_toolbar .action {
        width: 60px;
        height: 60px;
        list-style-type: none;
        background-repeat: no-repeat;
        background-position: center;
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
    `;
  }

  render(): TemplateResult {
    return html`
      <ul class="left_toolbar">
        <li class="action create_table" title="Create Table" @click="${this.create}"></li>
        <li class="action create_relation" title="Create Relation" @click="${this.relation}"></li>
      </ul>
    `;
  }

  private create = () => {
    store.dispatch(dbViewerModeAction.createMode());
  }

  private relation = () => {
    store.dispatch(dbViewerModeAction.relationMode());
  }
}
