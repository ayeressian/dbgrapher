import { expect } from "chai";
import AboutDialog from "../../../src/components/dialog/about-dialog";
import store from "../../../src/store/store";
import { initComponentTest, removeElement } from "../../helper";
import {
  actions as dialogActions,
  DialogTypes,
} from "../../../src/store/slices/dialog/dialogs";
import { t } from "../../../src/localization";

describe("dbg-about-dialog", () => {
  let aboutDialog: AboutDialog;

  beforeEach(async () => {
    aboutDialog = await initComponentTest("dbg-about-dialog");
    store.dispatch(dialogActions.open(DialogTypes.AboutDialog));
  });

  afterEach(() => {
    removeElement(aboutDialog);
  });

  it("should have correct text", async () => {
    expect(
      aboutDialog.shadowRoot!.querySelector<HTMLElement>('[data-testid="text"]')
        ?.innerText
    ).to.equal(t((l) => l.dialog.about.text));
  });

  it("should have correct footer", async () => {
    expect(
      aboutDialog.shadowRoot!.querySelector<HTMLElement>(
        '[data-testid="footer"]'
      )?.innerText
    ).to.equal(t((l) => l.dialog.about.footer));
  });
});
