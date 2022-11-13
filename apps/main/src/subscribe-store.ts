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
      onUpdate?.(newValue, state);
      oldValue = newValue;
    }
  });
};

export const subscribeOnce = <StateType>(
  selector: (state: AppState) => StateType,
  isEqual: (oldValue: StateType, newValue: StateType) => boolean = (
    oldValue,
    newValue
  ): boolean => oldValue === newValue
): Promise<StateType> => {
  const oldValue = selector(store.getState());
  return new Promise((resolve) => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      const newValue = selector(state);
      if (!isEqual(oldValue, newValue)) {
        resolve(newValue);
        unsubscribe();
      }
    });
  });
};
