import { css, TemplateResult, html, unsafeCSS, CSSResultGroup } from "lit";
import formsCss from "purecss/build/forms-min.css";
import buttonCss from "purecss/build/buttons-min.css";
import { DBGElement } from "../dbg-element";
import { customElement, property } from "lit/decorators.js";

type FileNameUpdateEventDetail = { newFileName: string };

export type FileNameUpdateEvent = CustomEvent<FileNameUpdateEventDetail>;

@customElement("dbg-file-rename-popup")
export default class extends DBGElement {
  @property({
    type: String,
  })
  fileName = "";

  #fileNameInput!: HTMLInputElement;

  static get styles(): CSSResultGroup {
    return css`
      ${unsafeCSS(formsCss)}
      ${unsafeCSS(buttonCss)}

      .center-popup {
        position: fixed;
        background-color: white;
        left: 50%;
        transform: translateX(-50%);
        margin-top: 5px;
        z-index: 1;
        padding: 0 16px 14px 16px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        border-radius: 5px;
      }
    `;
  }

  render(): TemplateResult {
    return html`
      <div class="center-popup">
        <form class="pure-form pure-form-stacked">
          <fieldset>
            <label for="file-name">File Name</label>
            <input type="text" id="file-name" .value="${this.fileName}" />
          </fieldset>
          <button type="submit" class="pure-button" @click=${this.#onUpdate}>
            Update
          </button>
        </form>
      </div>
    `;
  }

  firstUpdated(): void {
    this.#fileNameInput = this.getShadowRoot().querySelector(
      "#file-name"
    ) as HTMLInputElement;
  }

  #onUpdate = (event: MouseEvent): void => {
    event.preventDefault();
    const detail: FileNameUpdateEventDetail = {
      newFileName: this.#fileNameInput.value,
    };
    const newEvent = new CustomEvent<FileNameUpdateEventDetail>(
      "dbg-file-rename",
      { detail }
    );
    this.dispatchEvent(newEvent);
  };
}
