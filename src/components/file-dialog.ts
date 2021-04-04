import {
  html,
  customElement,
  css,
  CSSResult,
  TemplateResult,
} from "lit-element";
import { actions as schemaAction } from "../store/slices/schema";
import { actions as setSchemaAction } from "../store/slices/load-schema";
import { actions as fileOpenDialogActions } from "../store/slices/dialog/file-dialog";
import {
  actions as dialogActions,
  DialogTypes,
} from "../store/slices/dialog/dialogs";
import store from "../store/store";
import { validateJson } from "../validate-schema";
import { actions as fileOpenChooserDialogOpen } from "../store/slices/dialog/file-open-chooser-dialog";
import { actions as fileDialogActions } from "../store/slices/dialog/file-dialog";
import { subscribe } from "../subscribe-store";
import { DBGElement } from "./dbg-element";
import { t } from "../localization";
import DbGrapherSchema from "../db-grapher-schema";
import { FileDialogState } from "../store/slices/dialog/file-dialog";
import { localDrive } from "./operations";

const ABORT_BY_USER_ERROR_CODE = 20;

@customElement("dbg-file-inputs")
export default class extends DBGElement {
  #resolveLoaded!: (value: PromiseLike<null> | null) => void;
  #loaded: Promise<null> = new Promise(
    (resolve) => (this.#resolveLoaded = resolve)
  );
  #sqlFileInput!: HTMLInputElement;
  #dbgFileInput!: HTMLInputElement;
  #handle?: FileSystemFileHandle;

  firstUpdated(): void {
    this.#dbgFileInput = this.shadowRoot!.querySelector<HTMLInputElement>(
      "#dbgFileInput"
    )!;
    this.#sqlFileInput = this.shadowRoot!.querySelector<HTMLInputElement>(
      "#sqlFileInput"
    )!;
    this.#resolveLoaded(null);
  }

  static get styles(): CSSResult {
    return css`
      input {
        display: none;
      }
    `;
  }

  #open = async (): Promise<void> => {
    await this.#loaded;
    if (window.showOpenFilePicker) {
      try {
        [this.#handle] = await window.showOpenFilePicker();
        const file = await this.#handle.getFile();
        this.#read(await file.text());
        store.dispatch(fileOpenDialogActions.close());
      } catch (e) {
        if (e.code !== ABORT_BY_USER_ERROR_CODE) throw e;
      }
    } else {
      await this.#loaded;
      this.#dbgFileInput.click();
    }
  };

  connectedCallback(): void {
    super.connectedCallback();
    subscribe(
      (state) => state.dialog.fileDialog,
      async (fileDialogState) => {
        switch (fileDialogState) {
          case FileDialogState.OpenDialog:
            await this.#open();
            store.dispatch(fileDialogActions.close());
            break;
          case FileDialogState.OpenSqlDialog:
            void this.#loaded.then(() => {
              this.#sqlFileInput.click();
            });
            break;
          case FileDialogState.SaveDialog:
            await this.#save();
            store.dispatch(fileDialogActions.close());
            break;
          case FileDialogState.SaveAsDialog:
            await this.#saveAs();
            store.dispatch(fileDialogActions.close());
            break;
        }
      }
    );
  }

  #write = async (): Promise<void> => {
    // Create a FileSystemWritableFileStream to write to.
    const writable = await this.#handle!.createWritable();
    // Write the contents of the file to the stream.
    await writable.write(JSON.stringify(store.getState().schema.present));
    // Close the file and write the contents to disk.
    await writable.close();
  };

  #save = async (): Promise<void> => {
    if (localDrive() && window.showSaveFilePicker) {
      if (this.#handle) {
        this.#write();
      } else {
        try {
          this.#handle = await window.showSaveFilePicker();
        } catch (e) {
          if (e.code !== ABORT_BY_USER_ERROR_CODE) throw e;
        }
      }
    }
  };

  #saveAs = async (): Promise<void> => {
    if (localDrive() && window.showSaveFilePicker) {
      this.#handle = await window.showSaveFilePicker();
    }
  };

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

  #read = (schemaText: string): void => {
    let schema;
    try {
      schema = JSON.parse(schemaText) as DbGrapherSchema;
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
  };

  #fileOpenChange = (event: Event): void => {
    const reader = new FileReader();
    reader.readAsText((event.target as HTMLInputElement).files![0]);
    reader.onload = (readerEvent): void => {
      if (typeof readerEvent.target!.result === "string") {
        this.#read(readerEvent.target!.result);
      } else {
        alert(t((l) => l.error.invalidJSON));
      }
      //Remove the value, so the same file can be set twice.
      this.#dbgFileInput.value = "";
    };
  };

  #importSqlFileChange = (): void => {
    // TODO
  };
}
