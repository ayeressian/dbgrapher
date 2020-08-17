import store from "./store/store";
import { AppState } from "./store/reducer";
import { Unsubscribe } from "redux";

export const subscribe = <StateType>(
  selector: (state: AppState) => StateType,
  onUpdate: (subState: StateType, state: AppState) => void,
  isEqual: (oldValue: StateType, newValue: StateType) => boolean = (
    oldValue,
    newValue
  ): boolean => oldValue === newValue
): Unsubscribe => {
  let oldValue = selector(store.getState());
  return store.subscribe(() => {
    const state = store.getState();
    const newValue = selector(state);
    if (!isEqual(oldValue, newValue)) {
      onUpdate && onUpdate(newValue, state);
      oldValue = newValue;
    }
  });
};
