import { LitElement } from "lit";
import { Unsubscribe } from "redux";
import { AppState } from "../store/reducer";
import { subscribe } from "../subscribe-store";

export abstract class DBGElement extends LitElement {
  #unsubscribes: Unsubscribe[] = [];

  getShadowRoot(): ShadowRoot {
    if (!this.shadowRoot)
      throw new Error(
        "Shadowroot is not available. Most probably Component is not connected yet."
      );
    return this.shadowRoot;
  }

  connectedCallback(): void {
    super.connectedCallback();

    // Update on local change
    this.subscribe(
      (state) => state.localization,
      () => this.updateComplete
    );
  }

  subscribe<StateType>(
    selector: (state: AppState) => StateType,
    onUpdate: (subState: StateType, state: AppState) => void,
    isEqual?: (oldValue: StateType, newValue: StateType) => boolean
  ): void {
    this.#unsubscribes.push(subscribe<StateType>(selector, onUpdate, isEqual));
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#unsubscribes.forEach((unsub) => unsub());
  }
}
