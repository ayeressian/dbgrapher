import {
  customElement,
  LitElement,
  TemplateResult,
  html,
  property,
  CSSResult,
  css,
  unsafeCSS,
} from "lit-element";
import formsCss from "purecss/build/forms-min.css";

type ComplexItem = { value: string; text: string };
type Option = string | ComplexItem;

type OnSelectEventDetail = { value: string; selectedIndex: number };
export type OnSelectEvent = CustomEvent<OnSelectEventDetail>;

@customElement("dbg-select")
export default class extends LitElement {
  @property({ type: Object }) options!: Option[];
  @property({ type: String }) value!: string;

  #resolveLoaded!: Function;
  #loaded: Promise<null> = new Promise(
    (resolve) => (this.#resolveLoaded = resolve)
  );
  #selectElement!: HTMLSelectElement;

  static get styles(): CSSResult {
    return css`
      ${unsafeCSS(formsCss)}
      form {
        margin-bottom: 0px;
      }
    }`;
  }

  firstUpdated(): void {
    this.#selectElement = this.shadowRoot!.querySelector<HTMLSelectElement>(
      "select"
    )!;
    this.#resolveLoaded();
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
      Promise.all([this.requestUpdate(), this.#loaded]).then(this.#updateValue);
    } else {
      this.#loaded.then(this.#updateValue);
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
        <select @change="${this.#onChange}">
          ${this.options?.map((option: Option) => {
            if ((option as ComplexItem).value) {
              return html`<option value="${(option as ComplexItem).value}"
                >${(option as ComplexItem).text}</option
              >`;
            }
            return html`<option value="${option}">${option}</option>`;
          })}
        </select>
      </form>
    `;
  }
}
