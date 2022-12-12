import "../../../src/components/dialog/about-dialog";
import AboutDialog from "../../../src/components/dialog/about-dialog";
import store from "../../../src/store/store";
import { initComponentTest, removeElement } from "../../helper";
import {
  actions as dialogActions,
  DialogTypes,
} from "../../../src/store/slices/dialog/dialogs";
import { describe, beforeEach, afterEach, it } from "vitest";
import toMatchHtmlSnapshot from "../../to-match-html-snapshot";

describe("dbg-about-dialog", () => {
  let aboutDialog: AboutDialog;

  beforeEach(async () => {
    aboutDialog = await initComponentTest("dbg-about-dialog");
    store.dispatch(dialogActions.open(DialogTypes.AboutDialog));
  });

  afterEach(() => {
    removeElement(aboutDialog);
  });

  it("renders propery", () => {
    toMatchHtmlSnapshot(aboutDialog.shadowRoot?.innerHTML);
  });
});
