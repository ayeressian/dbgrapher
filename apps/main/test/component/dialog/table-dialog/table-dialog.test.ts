import "../../../../src/components/import-components";
import TableDialog from "../../../../src/components/dialog/table-dialog/table-dialog";
import { initComponentTest, removeElement, getTagName } from "../../../helper";
import store from "../../../../src/store/store";
import { actions as tableDialogAction } from "../../../../src/store/slices/dialog/table-dialog";
import { describe, beforeEach, afterEach, it, expect } from "vitest";

describe("table-dialog", () => {
  let tableDialog: TableDialog;
  let shadowRoot: ShadowRoot;

  beforeEach(async (): Promise<void> => {
    tableDialog = await initComponentTest({
      elementType: "dbg-table-dialog",
      noUpdate: true,
    });
    store.dispatch(tableDialogAction.openCreate({ x: 0, y: 0 }));
    await tableDialog.updateComplete;
    shadowRoot = tableDialog.getShadowRoot();
  });
  afterEach((): void => {
    removeElement(tableDialog);
  });

  it("should render properly", () => {
    expect(getTagName("dbg-table-dialog-columns", shadowRoot)).to.not.be
      .undefined;
    expect(getTagName("dbg-table-dialog-fk-columns", shadowRoot)).to.not.be
      .undefined;
    expect(getTagName('[data-testid="table-name"]', shadowRoot)).to.equal(
      "INPUT"
    );
    expect(getTagName('[data-testid="save-btn"]', shadowRoot)).to.equal(
      "BUTTON"
    );
    expect(getTagName('[data-testid="cancel-btn"]', shadowRoot)).to.equal(
      "BUTTON"
    );
  });

  describe("when table name is not set", () => {
    it("should not close the dialog on save", () => {
      (
        shadowRoot.querySelector(
          '[data-testid="save-btn"]'
        ) as HTMLButtonElement
      ).click();
      expect(getTagName('[data-testid="table-dialog"]', shadowRoot)).to.not
        .undefined;
    });
  });

  describe("when table name is set", () => {
    beforeEach(() => {
      (
        shadowRoot.querySelector(
          '[data-testid="table-name"]'
        ) as HTMLInputElement
      ).value = "test";
    });
    it("should close the dialog on save", async () => {
      (
        shadowRoot.querySelector(
          '[data-testid="save-btn"]'
        ) as HTMLButtonElement
      ).click();
      await tableDialog.updateComplete;
      expect(getTagName('[data-testid="table-dialog"]', shadowRoot)).undefined;
    });
  });
});
