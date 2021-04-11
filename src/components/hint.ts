import {
  customElement,
  css,
  CSSResult,
  TemplateResult,
  html,
  internalProperty,
} from "lit-element";
import { t } from "../localization";
import { DBGElement } from "./dbg-element";
import { HintType } from "../store/slices/hint";

@customElement("dbg-hint")
export default class extends DBGElement {
  @internalProperty()
  private hints = [] as string[];

  static get styles(): CSSResult {
    return css`
      .main {
        position: fixed;
        right: 20px;
        bottom: 18px;
        font-size: 1.2em;
      }

      .hint {
        background-color: #333;
        color: #ddd;
        margin-top: 10px;
        padding: 10px;
        float: right;
        clear: both;
      }
    `;
  }

  render(): TemplateResult {
    return this.hints.length
      ? html`<div class="main">
          ${this.hints.map((hint) => html`<div class="hint">${hint}</div>`)}
        </div> `
      : html``;
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.subscribe(
      (state) => state.hint,
      (stateHints, appState) => {
        this.hints = stateHints
          .map((hint) => {
            switch (hint.type) {
              case HintType.CreateTable:
                if (!appState.dialog.tableDialog.open) {
                  return t((l) => l.hint.tableCreation);
                }
                break;
              case HintType.RelationOneToMany:
              case HintType.RelationOneToOne:
              case HintType.RelationZeroToMany:
              case HintType.RelationZeroToOne:
                return t((l) => l.hint.relationCreation);
              case HintType.Remove:
                return t((l) => l.hint.remove);
              case HintType.Save:
                return t((l) => l.hint.save);
              case HintType.DriveSave:
                return t((l) => l.hint.driveSave);
            }
          })
          .filter((hint) => hint != null) as string[];
      }
    );
  }
}
