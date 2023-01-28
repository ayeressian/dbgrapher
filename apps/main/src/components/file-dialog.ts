import { html, css, CSSResultGroup, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
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
import { DBGElement } from "./dbg-element";
import { t } from "../localization";
import DbGrapherSchema from "../db-grapher-schema";
import { FileDialogState } from "../store/slices/dialog/file-dialog";
import { hintTimed, HintType } from "../store/slices/hint";
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
    this.#dbgFileInput = this.getShadowRoot().querySelector<HTMLInputElement>(
      "#dbgFileInput"
    ) as HTMLInputElement;
    this.#sqlFileInput = this.getShadowRoot().querySelector<HTMLInputElement>(
      "#sqlFileInput"
    ) as HTMLInputElement;
    this.#resolveLoaded(null);
  }

  static get styles(): CSSResultGroup {
    return css`
      input {
        display: none;
      }
    `;
  }

  #filePickerOptions = {
    types: [
      {
        description: "Schema",
        accept: { "application/json": [".json", ".dbgr"] },
      },
    ],
  };

  #open = async (): Promise<void> => {
    if (window.showOpenFilePicker) {
      try {
        [this.#handle] = await window.showOpenFilePicker(
          this.#filePickerOptions
        );
        const file = await this.#handle.getFile();
        this.#read(await file.text());
        store.dispatch(fileOpenDialogActions.close());
      } catch (e) {
        if (e.code !== ABORT_BY_USER_ERROR_CODE) throw e;
        store.dispatch(fileOpenDialogActions.close());
      }
    } else {
      await this.#loaded;
      this.#dbgFileInput.click();
    }
  };

  connectedCallback(): void {
    super.connectedCallback();
    this.subscribe(
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
    const writable = await this.#handle?.createWritable();
    // Write the contents of the file to the stream.
    await writable?.write(JSON.stringify(store.getState().schema.present));
    // Close the file and write the contents to disk.
    await writable?.close();
  };

  #save = async (): Promise<void> => {
    if (localDrive() && window.showSaveFilePicker) {
      if (this.#handle == null) {
        try {
          this.#handle = await window.showSaveFilePicker(
            this.#filePickerOptions
          );
        } catch (e) {
          if (e.code == ABORT_BY_USER_ERROR_CODE) return;
          else {
            throw e;
          }
        }
      }
      await this.#write();
      store.dispatch(hintTimed(HintType.Save));
    }
  };

  #saveAs = async (): Promise<void> => {
    if (localDrive() && window.showSaveFilePicker) {
      this.#handle = await window.showSaveFilePicker(this.#filePickerOptions);
      await this.#write();
      store.dispatch(hintTimed(HintType.Save));
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
    let schema: DbGrapherSchema;
    try {
      schema = JSON.parse(schemaText);
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
    reader.readAsText((event.target as HTMLInputElement).files?.[0] as File);
    reader.onload = (readerEvent): void => {
      const fileReaderResult = (readerEvent.target as FileReader).result;
      if (typeof fileReaderResult === "string") {
        this.#read(fileReaderResult);
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
