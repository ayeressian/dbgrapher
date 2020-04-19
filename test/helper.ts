import { LitElement } from 'lit-element';
import chaiDom from 'chai-dom';
import chai from 'chai';
import store from '../src/store/store';
import { resetAction } from '../src/store/reducer';

export const createElement = async (elementType: string): Promise<LitElement> => {
  const element = document.createElement(elementType) as LitElement;

  document.body.insertAdjacentElement(
    'afterbegin', 
    element);

  await element.updateComplete;

  return element;
};

export const initComponentTest = (elementType: string): Promise<LitElement> => {
  chai.use(chaiDom);
  store.dispatch({type: 'RESET'});
  return createElement(elementType);
};

export const removeElement = (element: Element): void => {
  store.dispatch(resetAction);
  element.outerHTML = '';
};
