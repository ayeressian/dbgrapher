import store from './store/store';
import { LitElement } from 'lit-element';
import { AppState } from './store/reducer';

type Options<StateType> = {
  requestUpdate?: boolean;
  isEqual?: (oldValue: StateType, newValue: StateType) => boolean;
  onUpdate?: (subState: StateType) => void;
};

export const watch = <StateType>(
  selector: (state: AppState) => StateType,
  {requestUpdate, isEqual, onUpdate}: Options<StateType> = {
    requestUpdate: true,
    isEqual: (oldValue, newValue) => oldValue === newValue,
  }) => {

  let oldValue = selector(store.getState());
  return <T extends LitElement>(target: T, propertyKey: keyof T) => {
      ((target[propertyKey] as unknown) as StateType) = oldValue;
      store.subscribe(() => {
        const newValue = selector(store.getState());
        if (!isEqual!(oldValue, newValue)) {
          ((target[propertyKey] as unknown) as StateType) = newValue;
          requestUpdate && target.requestUpdate(propertyKey, oldValue);
          onUpdate && onUpdate(newValue);
          oldValue = newValue;
        }
      });
  };
};

export const subscribe = <StateType>(selector: (state: AppState) => StateType,
  onUpdate: (subState: StateType, state: AppState) => void,
  isEqual: (oldValue: StateType, newValue: StateType) => boolean = (oldValue, newValue) => oldValue === newValue) => {

  let oldValue = selector(store.getState());
  store.subscribe(() => {
    const state = store.getState();
    const newValue = selector(state);
    if (!isEqual(oldValue, newValue)) {
      onUpdate && onUpdate(newValue, state);
      oldValue = newValue;
    }
  });
}
