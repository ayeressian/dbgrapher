import { LitElement } from "lit-element";
import store from "../src/store/store";
import initProviderFactory from "../src/drive/factory";
import {
  actions as cloudActions,
  CloudProvider,
} from "../src/store/slices/cloud";

export const createElement = async (
  elementType: string,
  attrs: { [key in string]: string } = {},
  noUpdate = false
): Promise<LitElement> => {
  const element = document.createElement(elementType) as LitElement;
  for (const [key, value] of Object.entries(attrs)) {
    element.setAttribute(key, value);
  }
  document.body.appendChild(element);
  if (!noUpdate) {
    await element.updateComplete;
  }

  return element;
};

type initComponentTestParameters =
  | {
      elementType: string;
      attrs?: { [key in string]: string };
      noUpdate: boolean;
    }
  | string;

export function initComponentTest(
  param: initComponentTestParameters
): Promise<LitElement> {
  store.dispatch({ type: "RESET" });
  initProviderFactory();
  store.dispatch(cloudActions.setDriveType(CloudProvider.None));
  if (typeof param === "string") {
    return createElement(param);
  }
  return createElement(param.elementType, param.attrs, param.noUpdate);
}

export const removeElement = (element: Element): void => {
  element.outerHTML = "";
};

export const getTagName = (
  queryString: string,
  shadowRoot: ShadowRoot
): string | undefined => shadowRoot.querySelector(queryString)?.tagName;
