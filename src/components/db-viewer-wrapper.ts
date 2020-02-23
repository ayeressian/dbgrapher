import { html, customElement, css, CSSResult, TemplateResult, LitElement } from 'lit-element';
import { actions as setSchemaAction } from '../store/slices/load-schema';
import { actions as tableDialogAction } from '../store/slices/create-dialog';
import store from '../store/store';

@customElement('dbg-db-viewer')
export default class DbWrapper extends LitElement {
  private resolveLoaded?: Function;
  private loaded: Promise<null> = new Promise((resolve) => this.resolveLoaded = resolve);
  private dbViewer?: IDbViewer;

  static get styles(): CSSResult {
    return css`
      :host {
        overflow: auto;
        width: 100%;
        height: 100%;
      }
    `;
  }

  private onTableDblClick = (event: CustomEvent) => {
    store.dispatch(tableDialogAction.open());
    console.log('dblclick', event.detail);
    event.detail.table;
  };

  firstUpdated() {
    this.dbViewer = this.shadowRoot!.querySelector<IDbViewer>('db-viewer')!;
    this.dbViewer.addEventListener('tableDblClick', this.onTableDblClick);
    this.resolveLoaded!();
  }

  connectedCallback() {
    super.connectedCallback();
    store.subscribe(() => {
      const state = store.getState();
      if (state.loadSchema) {
        this.loaded.then(() => {
          this.dbViewer!.schema = state.schema as ISchema;
          store.dispatch(setSchemaAction.loaded());
        });
      }
    });
  }

  render(): TemplateResult {
    return html`<db-viewer/>`;
  }
}