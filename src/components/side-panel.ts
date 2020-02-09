import { LitElement, html, customElement, css, unsafeCSS, CSSResult, TemplateResult } from 'lit-element';
import createIconImg from '../../asset/icon_create_table_48x48.png';
import relationIconImg from '../../asset/icon_create_relation_48x48.png';

@customElement('dbg-side-panel')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        <li class="action create_table" title="Create Table"></li>
        <li class="action create_relation" title="Create Relation"></li>
      </ul>
    `;
  }
}
