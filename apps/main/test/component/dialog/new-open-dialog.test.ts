import "../../../src/components/dialog/new-open-dialog";
import NewOpenDialog from "../../../src/components/dialog/new-open-dialog";
import { initComponentTest, removeElement } from "../../helper";
import { describe, beforeEach, afterEach, it, expect } from "vitest";

describe("new-open-dialog", () => {
  let welcomeDialog: NewOpenDialog;

  beforeEach(async () => {
    welcomeDialog = await initComponentTest("dbg-new-open-dialog");
  });

  afterEach(() => {
    removeElement(welcomeDialog);
  });

  it("should have 3 actions", () => {
    expect(
      welcomeDialog.shadowRoot!.querySelectorAll("dbg-dialog-operation").length
    ).eq(3);
  });
});
