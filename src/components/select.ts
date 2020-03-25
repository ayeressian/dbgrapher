import { customElement, LitElement, TemplateResult, html, property, CSSResult, css, unsafeCSS } from 'lit-element';
import formsCss from 'purecss/build/forms-min.css';

type ComplexItem = {value: string; text: string};
type Option = string | ComplexItem;

type OnSelectEventDetail = {value: string; selectedIndex: number};
export type OnSelectEvent = CustomEvent<OnSelectEventDetail>;

@customElement('dbg-select')
export default class extends LitElement {
  @property( { type : Object } ) options?: Option[];
  @property( { type : String } ) value?: string;

  #resolveLoaded?: Function;
  #loaded: Promise<null> = new Promise((resolve) => this.#resolveLoaded = resolve);
  #selectElement?: HTMLSelectElement;

  static get styles(): CSSResult {
    return css`
      ${unsafeCSS(formsCss)}
      form {
        margin-bottom: 0px;
      }
    }`
  }

  firstUpdated() {
    this.#selectElement = this.shadowRoot!.querySelector<HTMLSelectElement>('select')!;
    this.#resolveLoaded!();
  }

  #updateValue = () => {
    this.#selectElement!.value = this.value || '';
  };

  #onChange = (event: InputEvent) => {
    const detail: OnSelectEventDetail = {
      value: (event.target as HTMLSelectElement).value,
      selectedIndex: (event.target as HTMLSelectElement).selectedIndex
    };
    const newEvent = new CustomEvent('dbg-on-select', { detail });
    this.dispatchEvent(newEvent);
  };

  attributeChangedCallback(name: string, old: string|null, value: string|null) {
    if (name === 'options') {
      Promise.all([this.requestUpdate(), this.#loaded]).then(this.#updateValue);
    } else {
      this.#loaded.then(this.#updateValue);
    }
    super.attributeChangedCallback(name, old, value);
  }

  render(): TemplateResult {
    return html`
      <form class="pure-form">
        <select @change="${this.#onChange}">
          ${this.options?.map((option: Option) => {
            if ((option as ComplexItem).value) {
              return html`<option value="${(option as ComplexItem).value}">${(option as ComplexItem).text}</option>`
            }
            return html`<option value="${option}">${option}</option>`
          })}
        </select>
      </form>
    `;
  }
}