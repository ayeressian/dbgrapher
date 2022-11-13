import "../../src/components/side-panel";
import SidePanel from "../../src/components/side-panel";

import { initComponentTest, removeElement } from "../helper";
import { describe, beforeEach, afterEach, it, expect } from "vitest";
import toMatchHtmlSnapshot from "../to-match-html-snapshot";

describe("side-panel", () => {
  let sidePanel: SidePanel;

  beforeEach(async () => {
    sidePanel = await initComponentTest("dbg-side-panel");
  });

  afterEach(() => {
    removeElement(sidePanel);
  });

  it("renders propery", () => {
    toMatchHtmlSnapshot(sidePanel.shadowRoot?.innerHTML);
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
      expect(action.classList.contains("active")).eq(true);
    });

    it("should deactivate when clicked twice", async () => {
      const action = sidePanel.shadowRoot!.querySelector(
        "ul > li.action"
      ) as HTMLElement;
      action.click();
      await sidePanel.updateComplete;
      action.click();
      await sidePanel.updateComplete;
      expect(action.classList.contains("active")).eq(false);
    });
  });
});
