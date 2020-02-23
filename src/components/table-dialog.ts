import { html, customElement, css, CSSResult, TemplateResult } from 'lit-element';
import ConnectLitElement from './connect-lit-element';
import { watch } from 'lit-redux-watch';
import store from '../store/store';

@customElement('dbg-table-dialog')
export default class extends ConnectLitElement {
  @watch('dialog.tableDialog')
  private open = false;

  connectedCallback() {
    super.connectedCallback();
    store.subscribe(() => {
      const open = store.getState().dialog.tableDialog;
      if
    });
  }

  render(): TemplateResult {
    return html``;
  }

}