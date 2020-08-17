import {
  LitElement,
  customElement,
  CSSResult,
  TemplateResult,
  css,
  html,
  internalProperty,
} from "lit-element";
import { subscribe } from "../subscribe-store";
import { actions as aboutDialogActions } from "../store/slices/dialog/about-dialog";
import store from "../store/store";

@customElement("dbg-about-dialog")
export default class extends LitElement {
  @internalProperty()
  private open = false;

  static get styles(): CSSResult {
    return css`
      p {
        width: 500px;
      }
    `;
  }

  render(): TemplateResult {
    return html`
      <dbg-dialog
        centerTitle="About"
        showClose
        ?show=${this.open}
        @dbg-on-close="${this.#close}"
        @dbg-on-escape="${this.#close}"
      >
        <div slot="body">
          <p>
            Hello my name is Ara. Currenttly I'm the only contributer of this
            project. I initiated this project for my own needs. If you like
            relational databases and have knowledge or wish to learn more about
            typescript, webcomponent, litelement, redux, webpack, karma,
            jasmine, playwright and much more you should consider to contribute
            to this
            <a
              target="_blank"
              and
              rel="noopener noreferrer"
              href="https://github.com/ayeressian/dbgrapher"
              >project</a
            >.

            <br /><br />
            I hope you enjoy using this application.
          </p>
        </div>
      </dbg-dialog>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();

    subscribe(
      (state) => state.dialog.aboutDialog,
      (open) => {
        this.open = open;
      }
    );
  }

  #close = (): void => {
    store.dispatch(aboutDialogActions.close());
  };
}
