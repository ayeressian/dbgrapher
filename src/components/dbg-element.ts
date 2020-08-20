import { LitElement } from "lit-element";
import { subscribe } from "../subscribe-store";

export abstract class DBGElement extends LitElement {
  connectedCallback(): void {
    super.connectedCallback();

    // Update on local change
    subscribe(
      (state) => state.localization,
      () => {
        this.requestUpdate();
      }
    );
  }
}
