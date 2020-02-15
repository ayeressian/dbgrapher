import { html, customElement, css, CSSResult, TemplateResult, LitElement } from 'lit-element';
import { actions as schemaAction } from '../store/slices/schema';
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

  firstUpdated() {
    this.dbViewer = this.shadowRoot!.querySelector<IDbViewer>('db-viewer')!;
    this.resolveLoaded!();
  }

  connectedCallback() {
    super.connectedCallback();
    store.subscribe(() => {
      const state = store.getState();
      if (state.schema != null) {
        this.loaded.then(() => {
          this.dbViewer!.schema = state.schema as ISchema;
          store.dispatch(schemaAction.setSchema(null));
        });
      }
    });
  }

  render(): TemplateResult {
    return html`<db-viewer/>`;
  }
}