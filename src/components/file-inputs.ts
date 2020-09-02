import {
  html,
  customElement,
  css,
  CSSResult,
  TemplateResult,
} from "lit-element";
import { actions as schemaAction } from "../store/slices/schema";
import { actions as setSchemaAction } from "../store/slices/load-schema";
import { actions as fileOpenDialogActions } from "../store/slices/dialog/file-dialog/file-open-dialog";
import {
  actions as dialogActions,
  DialogTypes,
} from "../store/slices/dialog/dialogs";
import store from "../store/store";
import { validateJson } from "../validate-schema";
import { actions as fileOpenChooserDialogOpen } from "../store/slices/dialog/file-open-chooser-dialog";
import { actions as fileOpenAction } from "../store/slices/dialog/file-dialog/file-open-dialog";
import { subscribe } from "../subscribe-store";
import { DBGElement } from "./dbg-element";
import { t } from "../localization";
import DbGrapherSchema from "../db-grapher-schema";

@customElement("dbg-file-inputs")
export default class extends DBGElement {
  #resolveLoaded!: () => void;
  #loaded: Promise<null> = new Promise(
    (resolve) => (this.#resolveLoaded = resolve)
  );
  #sqlFileInput!: HTMLInputElement;
  #dbgFileInput!: HTMLInputElement;

  firstUpdated(): void {
    this.#dbgFileInput = this.shadowRoot!.querySelector<HTMLInputElement>(
      "#dbgFileInput"
    )!;
    this.#sqlFileInput = this.shadowRoot!.querySelector<HTMLInputElement>(
      "#sqlFileInput"
    )!;
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
    subscribe(
      (state) => state.dialog.fileDialog.fileOpenDialog,
      (open) => {
        if (open) {
          void this.#loaded.then(() => {
            store.dispatch(fileOpenDialogActions.close());
            this.#dbgFileInput.click();
          });
        }
      }
    );
    subscribe(
      (state) => state.dialog.fileDialog.fileSqlOpenDialog,
      (open) => {
        if (open) {
          void this.#loaded.then(() => {
            this.#sqlFileInput.click();
          });
        }
      }
    );
  }

  render(): TemplateResult {
    return html`
      <input
        id="dbgFileInput"
        type="file"
        accept="application/json"
        @change=${this.#fileOpenChange}
      />
      <input
        id="sqlFileInput"
        type="file"
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
        schema = JSON.parse(
          readerEvent.target!.result as string
        ) as DbGrapherSchema;
      } catch (e) {
        alert(t((l) => l.error.invalidJSON));
        return;
      }
      const jsonValidation = validateJson(schema);
      if (!jsonValidation) {
        alert(t((l) => l.error.invalidFileFormat));
        return;
      }
      store.dispatch(schemaAction.initiate(schema));
      store.dispatch(setSchemaAction.load());
      store.dispatch(fileOpenChooserDialogOpen.close());
      store.dispatch(dialogActions.close(DialogTypes.NewOpenDialog));

      //Remove the value, so the same file can be set twice.
      this.#dbgFileInput.value = "";
    };
  };

  #importSqlFileChange = (): void => {
    // TODO
  };
}
