import { LitElement } from 'lit-element';
import chaiDom from 'chai-dom';
import chai from 'chai';

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
  return createElement(elementType);
};

export const removeElement = (element: Element): void => {
  element.outerHTML = '';
};
