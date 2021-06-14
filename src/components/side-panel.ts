import { html, css, unsafeCSS, CSSResultGroup, TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map";
import { customElement, state } from "lit/decorators.js";
import { actions as dbViewerModeAction } from "../store/slices/db-viewer-mode";
import store from "../store/store";
import createIconImg from "../../asset/table.svg";
import relationOneToManyIcon from "../../asset/relation-one-to-many.svg";
import relationOneToOneIcon from "../../asset/relation-one-to-one.svg";
import relationZeroToOneIcon from "../../asset/relation-zero-to-one.svg";
import relationZeroToManyIcon from "../../asset/relation-zero-to-many.svg";
import clearIcon from "../../asset/clear.svg";
import DbViewerMode from "../store/slices/db-viewer-mode-type";
import { t } from "../localization";
import { DBGElement } from "./dbg-element";

@customElement("dbg-side-panel")
export default class extends DBGElement {
  static get styles(): CSSResultGroup {
    return css`
      .left_toolbar {
        padding: 0;
        margin: 0;

        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .left_toolbar .action {
        width: 60px;
        height: 80px;

        list-style-type: none;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 35px;
      }

      .left_toolbar .action:hover {
        background-color: #dddddd;
      }

      .left_toolbar .action.active {
        background-color: #d68080;
      }

      .left_toolbar .action.create_table {
        background-image: url(${unsafeCSS(createIconImg)});
      }

      .left_toolbar .action.create_relation_one_to_many {
        background-image: url(${unsafeCSS(relationOneToManyIcon)});
      }

      .left_toolbar .action.create_relation_zero_to_many {
        background-image: url(${unsafeCSS(relationZeroToManyIcon)});
      }

      .left_toolbar .action.create_relation_one_to_one {
        background-image: url(${unsafeCSS(relationOneToOneIcon)});
      }

      .left_toolbar .action.create_relation_zero_to_one {
        background-image: url(${unsafeCSS(relationZeroToOneIcon)});
      }

      .left_toolbar .action.clear {
        background-image: url(${unsafeCSS(clearIcon)});
      }
    `;
  }

  @state()
  private mode: DbViewerMode = DbViewerMode.None;

  render(): TemplateResult {
    return html`
      <ul class="left_toolbar">
        <li
          class="action create_table ${classMap({
            active: this.mode === DbViewerMode.CreateTable,
          })}"
          title=${t((l) => l.sidePanel.createTable)}
          @click="${this.#changeMode(DbViewerMode.CreateTable)}"
        ></li>
        <li
          class="action create_relation_one_to_many ${classMap({
            active: this.mode === DbViewerMode.RelationOneToMany,
          })}"
          title=${t((l) => l.sidePanel.createOneToManyRelation)}
          @click="${this.#changeMode(DbViewerMode.RelationOneToMany)}"
        ></li>
        <li
          class="action create_relation_zero_to_many ${classMap({
            active: this.mode === DbViewerMode.RelationZeroToMany,
          })}"
          title=${t((l) => l.sidePanel.createZeroToManyRelation)}
          @click="${this.#changeMode(DbViewerMode.RelationZeroToMany)}"
        ></li>
        <li
          class="action create_relation_one_to_one ${classMap({
            active: this.mode === DbViewerMode.RelationOneToOne,
          })}"
          title=${t((l) => l.sidePanel.createOneToOneRelation)}
          @click="${this.#changeMode(DbViewerMode.RelationOneToOne)}"
        ></li>
        <li
          class="action create_relation_zero_to_one ${classMap({
            active: this.mode === DbViewerMode.RelationZeroToOne,
          })}"
          title=${t((l) => l.sidePanel.createZeroToOneRelation)}
          @click="${this.#changeMode(DbViewerMode.RelationZeroToOne)}"
        ></li>
        <li
          class="action clear ${classMap({
            active: this.mode === DbViewerMode.Remove,
          })}"
          title=${t((l) => l.sidePanel.removeTableOrRelation)}
          @click="${this.#changeMode(DbViewerMode.Remove)}"
        ></li>
      </ul>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.subscribe(
      (state) => state.dbViewerMode,
      (dbViewerMode) => {
        this.mode = dbViewerMode;
      }
    );

    document.addEventListener("keydown", this.#onEscape);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();

    document.removeEventListener("keydown", this.#onEscape);
  }

  #onEscape = (event: KeyboardEvent): void => {
    if (
      event.key === "Escape" &&
      store.getState().dbViewerMode !== DbViewerMode.None
    ) {
      store.dispatch(dbViewerModeAction.none());
    }
  };

  #changeMode = (mode: DbViewerMode) => (): void => {
    if (store.getState().dbViewerMode === mode) {
      store.dispatch(dbViewerModeAction.none());
    } else {
      store.dispatch(dbViewerModeAction.changeMode(mode));
    }
  };
}
