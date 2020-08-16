import { html, customElement, css, CSSResult, TemplateResult, LitElement } from 'lit-element';
import { actions as schemaAction } from '../store/slices/schema';
import { actions as setSchemaAction } from '../store/slices/load-schema';
import { actions as fileOpenDialogActions } from '../store/slices/dialog/file-dialog/file-open-dialog';
import { actions as newOpenDialogActions } from "../store/slices/dialog/new-open-dialog";
import store from '../store/store';
import { validateJson } from '../validate-schema';
import { actions as fileOpenChooserDialogOpen } from '../store/slices/dialog/file-open-chooser-dialog';
import { actions as fileOpenAction } from '../store/slices/dialog/file-dialog/file-open-dialog';
import { subscribe } from '../subscribe-store';

const INVALID_JSON_MSG = 'Selected file does not contain valid JSON.';
const INVALID_FILE_FORMAT = 'Selected file does not have correct Db designer file format';

@customElement('dbg-file-inputs')
export default class extends LitElement {
  #resolveLoaded!: Function;
  #loaded: Promise<null> = new Promise((resolve) => this.#resolveLoaded = resolve);
  #sqlFileInput!: HTMLInputElement;
  #dbgFileInput!: HTMLInputElement;

  firstUpdated(): void {
    this.#dbgFileInput = this.shadowRoot!.querySelector<HTMLInputElement>('#dbgFileInput')!;
    this.#sqlFileInput = this.shadowRoot!.querySelector<HTMLInputElement>('#sqlFileInput')!;
    this.#resolveLoaded();
  }
  
  static get styles(): CSSResult {
    return css`
      input {
        display: none;
      }
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    subscribe(state => state.dialog.fileDialog.fileOpenDialog, open => {
      if (open) {
        this.#loaded.then(() => {
          store.dispatch(fileOpenDialogActions.close());
          this.#dbgFileInput.click();
        });
      }
    });
    subscribe(state => state.dialog.fileDialog.fileSqlOpenDialog, open => {
      if (open) {
        this.#loaded.then(() => {
          this.#sqlFileInput.click();
        });
      }
    });
  }

  render(): TemplateResult {
    return html`
      <input
        id='dbgFileInput'
        type='file'
        accept='application/json'
        @change=${this.#fileOpenChange}
      />
      <input
        id='sqlFileInput'
        type='file'
        @change=${this.#importSqlFileChange}
      />
    `;
  }

  #fileOpenChange = (event: Event): void => {
    const reader = new FileReader();
    reader.readAsText((event.target as HTMLInputElement).files![0]);
    reader.onload = (readerEvent): void => {
      store.dispatch(fileOpenAction.close());
      let schema;
      try {
        schema = JSON.parse(readerEvent.target!.result as string);
      } catch (e) {
        alert(INVALID_JSON_MSG);
        return;
      }
      const jsonValidation = validateJson(schema);
      if (!jsonValidation) {
        alert(INVALID_FILE_FORMAT);
        return;
      }
      store.dispatch(schemaAction.initiate(schema));
      store.dispatch(setSchemaAction.load());
      store.dispatch(fileOpenChooserDialogOpen.close());
      store.dispatch(newOpenDialogActions.close());

      //Remove the value, so the same file can be set twice.
      this.#dbgFileInput.value = '';
    };
  };

  #importSqlFileChange = (): void => {
    // TODO
  };
}