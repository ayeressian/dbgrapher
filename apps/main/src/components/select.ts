import { TemplateResult, html, CSSResultGroup, css, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

import formsCss from "purecss/build/forms-min.css";
import { DBGElement } from "./dbg-element";

type ComplexItem = { value: string; text: string };
type Option = string | ComplexItem;

type OnSelectEventDetail = { value: string; selectedIndex: number };
export type OnSelectEvent = CustomEvent<OnSelectEventDetail>;

@customElement("dbg-select")
export default class Select extends DBGElement {
  @property({ type: Array }) options!: Option[];
  @property({ type: String }) value!: string;
  @property({ type: Boolean }) required = false;

  #resolveLoaded!: (value: PromiseLike<null> | null) => void;
  #loaded: Promise<null> = new Promise(
    (resolve) => (this.#resolveLoaded = resolve)
  );
  #selectElement!: HTMLSelectElement;
  #form!: HTMLFormElement;

  static get styles(): CSSResultGroup {
    return css`
      ${unsafeCSS(formsCss)}
      form {
        margin-bottom: 0px;
      }
    }`;
  }

  firstUpdated(): void {
    this.#form = this.shadowRoot!.querySelector("form")!;
    this.#selectElement =
      this.shadowRoot!.querySelector<HTMLSelectElement>("select")!;
    this.#resolveLoaded(null);
  }

  #updateValue = (): void => {
    this.#selectElement.value = this.value || "";
  };

  #dispatch = (value: string, index: number): void => {
    const newEvent = new CustomEvent("dbg-on-select", {
      detail: { value, index },
    });
    this.dispatchEvent(newEvent);
  };

  #onChange = (event: InputEvent): void => {
    const element = event.target as HTMLSelectElement;
    this.#dispatch(element.value, element.selectedIndex);
  };

  attributeChangedCallback(
    name: string,
    old: string | null,
    value: string | null
  ): void {
    if (name === "options") {
      void Promise.all([this.updateComplete, this.#loaded]).then(
        this.#updateValue
      );
    } else {
      void this.#loaded.then(this.#updateValue);
    }
    super.attributeChangedCallback(name, old, value);
  }

  #getOptionIndex = (value?: string): number => {
    return (this.options ?? []).findIndex((option) => {
      if (typeof option === "object") {
        return option.value === value;
      }
      return value === option;
    });
  };

  reportValidity = (): boolean => {
    return this.#form.reportValidity();
  };

  render(): TemplateResult {
    if (
      this.#getOptionIndex(this.value) === -1 &&
      (this.options?.length ?? 0) > 0
    ) {
      const option = this.options[0];
      this.value = typeof option === "object" ? option.value : option;
      this.#dispatch(this.value, 0);
    }
    return html`
      <form class="pure-form">
        <select @change="${this.#onChange}" ?required=${this.required}>
          ${this.options?.map((option: Option) => {
            if ((option as ComplexItem).value) {
              return html`<option value="${(option as ComplexItem).value}">
                ${(option as ComplexItem).text}
              </option>`;
            }
            return html`<option value="${option}">${option}</option>`;
          })}
        </select>
      </form>
    `;
  }
}
