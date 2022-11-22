import { LitElement } from "lit";
import { AppState } from "../store/reducer";
export declare abstract class DBGElement extends LitElement {
    #private;
    connectedCallback(): void;
    subscribe<StateType>(selector: (state: AppState) => StateType, onUpdate: (subState: StateType, state: AppState) => void, isEqual?: (oldValue: StateType, newValue: StateType) => boolean): void;
    disconnectedCallback(): void;
}
