import { LitElement } from 'lit-element';
import store from '../../src/store/store';

export const createElement = async (elementType: string): Promise<LitElement> => {
  const element = document.createElement(elementType) as LitElement;
  document.body.appendChild(element);
  await element.updateComplete;

  return element;
};

export const initComponentTest = (elementType: string): Promise<LitElement> => {
  store.dispatch({type: 'RESET'});
  return createElement(elementType);
};

export const removeElement = (element: Element): void => {
  element.outerHTML = '';
};

export const getTagName = (queryString: string, shadowRoot: ShadowRoot): string | undefined => shadowRoot.querySelector(queryString)?.tagName;