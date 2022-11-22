import { AppState } from "./store/reducer";
import { Unsubscribe } from "redux";
export declare const subscribe: <StateType>(selector: (state: AppState) => StateType, onUpdate: (subState: StateType, state: AppState) => void, isEqual?: (oldValue: StateType, newValue: StateType) => boolean) => Unsubscribe;
export declare const subscribeOnce: <StateType>(selector: (state: AppState) => StateType, isEqual?: (oldValue: StateType, newValue: StateType) => boolean) => Promise<StateType>;
