import { expect } from "chai";
import SidePanel from "../../src/components/side-panel";
import { initComponentTest, removeElement } from "../helper";

describe("side-panel", () => {
  let sidePanel: SidePanel;

  beforeEach(async () => {
    sidePanel = await initComponentTest("dbg-side-panel");
  });

  afterEach(() => {
    removeElement(sidePanel);
  });

  describe("actions", () => {
    it("should have 6 actions", () => {
      const actions = sidePanel.shadowRoot!.querySelectorAll("ul > li.action");
      expect(actions.length).eq(6);
    });

    it("should become active when clicked", async () => {
      const action = sidePanel.shadowRoot!.querySelector(
        "ul > li.action"
      ) as HTMLElement;
      action.click();
      await sidePanel.updateComplete;
      expect(action).have.class("active");
    });

    it("should deactivate when clicked twice", async () => {
      const action = sidePanel.shadowRoot!.querySelector(
        "ul > li.action"
      ) as HTMLElement;
      action.click();
      await sidePanel.updateComplete;
      action.click();
      await sidePanel.updateComplete;
      expect(action).not.have.class("active");
    });
  });
});
