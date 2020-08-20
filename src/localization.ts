import { subscribe } from "./subscribe-store";
import { LocalizationState } from "./store/slices/localization";
import en from "./local_en";
import arm from "./local_arm";
import store from "./store/store";

type Localization = typeof en;

const getLocal = (localization: LocalizationState): Localization => {
  switch (localization) {
    case LocalizationState.ENGLISH:
      return en;
    case LocalizationState.ARMENIAN:
      return arm;
    default:
      return en;
  }
};

let local = getLocal(store.getState().localization);

subscribe(
  (state) => state.localization,
  (localization) => {
    local = getLocal(localization);
  }
);

export function t(
  path: (l: Localization) => string,
  replaceTexts?: object
): string;
export function t(
  path: (l: Localization) => string,
  replaceTexts?: string,
  ...replaceTextsRest: string[]
): string;
export function t(
  path: (l: Localization) => string,
  replaceTexts?: string | object,
  ...replaceTextsRest: string[]
): string {
  let text = path(local);
  if (replaceTexts) {
    if (typeof replaceTexts === "string") {
      replaceTextsRest.unshift(replaceTexts);
      replaceTextsRest.forEach(
        (replaceText, index) =>
          (text = text.replace(`$${index + 1}`, replaceText))
      );
    } else {
      Object.entries(replaceTexts).forEach(([key, value]) => {
        text = text.replace(`$${key}`, value);
      });
    }
  }
  return text;
}
