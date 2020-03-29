import { html, customElement, css, CSSResult, TemplateResult, LitElement } from 'lit-element';
import { actions as setSchemaAction } from '../store/slices/load-schema';
import { actions as schemaAction } from '../store/slices/schema';
import { actions as tableDialogAction } from '../store/slices/create-dialog';
import store from '../store/store';
import { IDbViewerMode } from '../store/slices/db-viewer-mode-interface';
import { subscribe } from '../subscribe-store';
import { isMac } from '../util';

@customElement('dbg-db-viewer')
export default class DbWrapper extends LitElement {
  #resolveLoaded?: Function;
  #loaded: Promise<null> = new Promise((resolve) => this.#resolveLoaded = resolve);
  #dbViewer?: IDbViewer;

  static get styles(): CSSResult {
    return css`
      :host {
        overflow: auto;
        width: 100%;
        height: 100%;
      }
    `;
  }

  #onTableDblClick = (event: CustomEvent<{name: string}>) => {
    store.dispatch(tableDialogAction.openEdit(event.detail.name));
  };

  firstUpdated() {
    this.#dbViewer = this.shadowRoot!.querySelector<IDbViewer>('db-viewer')!;
    this.#dbViewer.addEventListener('tableDblClick', this.#onTableDblClick);
    this.#resolveLoaded!();
  }

  connectedCallback() {
    super.connectedCallback();

    document.onkeydown = (event: KeyboardEvent) => {
      if ((event.keyCode === 90 && !event.shiftKey) && ((event.ctrlKey && !isMac) || (event.metaKey && isMac))) {
        store.dispatch(schemaAction.undo());
        store.dispatch(setSchemaAction.load());
      }

      if (((event.keyCode === 90 && event.shiftKey) && ((event.ctrlKey && !isMac) || (event.metaKey && isMac))) || (!isMac && event.ctrlKey)) {
        store.dispatch(schemaAction.redo());
        store.dispatch(setSchemaAction.load());
      }
    };

    subscribe(state => state.loadSchema, (loadSchema, state) => {
      if (loadSchema) {
        this.#loaded.then(() => {
          this.#dbViewer!.schema = state.schema.present as ISchema;
          store.dispatch(setSchemaAction.loaded());
        });
      }
    });

    subscribe(state => state.dbViewerMode, dbViewerMode => {
      if (dbViewerMode === IDbViewerMode.Create) {
        //TODO  
      }
      if (dbViewerMode === IDbViewerMode.Relation) {
        //TODO
      }
    });
  }

  render(): TemplateResult {
    return html`<db-viewer/>`;
  }
}