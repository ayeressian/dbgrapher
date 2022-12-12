import "../../../src/components/dialog/dialog";
import Dialog from "../../../src/components/dialog/dialog";
import { initComponentTest, removeElement } from "../../helper";
import { describe, beforeEach, afterEach, it, expect } from "vitest";

describe("dialog", () => {
  let dialog: Dialog;

  beforeEach(async () => {
    dialog = await initComponentTest("dbg-dialog");
  });

  afterEach(() => {
    removeElement(dialog);
  });

  it("should not be visible", () => {
    expect(
      dialog.shadowRoot!.querySelector("div")?.classList.contains("hide")
    ).eq(true);
  });

  it("should be visible when show attribute exist", async () => {
    dialog.setAttribute("show", "");
    await dialog.updateComplete;
    expect(
      dialog.shadowRoot!.querySelector("div")?.classList.contains("hide")
    ).eq(false);
  });
});
