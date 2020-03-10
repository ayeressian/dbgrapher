import { html, customElement, TemplateResult, LitElement } from 'lit-element';
import { actions as schemaAction } from '../store/slices/schema';
import { actions as fileOpenAction } from '../store/slices/file-open-dialog';
import store from '../store/store';

@customElement('dbg-top-menu-wrapper')
export default class extends LitElement {
  render(): TemplateResult {
    return html`<dbg-top-menu config="${JSON.stringify(store.getState().topMenuConfig)}" @item-selected="${this.#itemSelected}"></dbg-top-menu>`;
  }

  #itemSelected = (event: CustomEvent) => {
    switch(event.detail.id) {
      case 'new':
        store.dispatch(schemaAction.setSchema({ tables: [] }));
        break;
      case 'open':
        store.dispatch(fileOpenAction.open());
        break;
      //TODO
    }
  }
}