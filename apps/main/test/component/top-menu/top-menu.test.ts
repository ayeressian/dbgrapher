import "../../../src/components/top-menu/top-menu";
import TopMenu from "../../../src/components/top-menu/top-menu";
import { initComponentTest, removeElement } from "../../helper";
import { describe, beforeEach, afterEach, it, expect } from "vitest";
import toMatchHtmlSnapshot from "../../to-match-html-snapshot";

describe("top-menu", () => {
  let topMenu: TopMenu;

  const config = {
    items: [
      {
        id: "one",
        title: "oneTitle",
        items: [
          {
            id: "oneSubOne",
            title: "oneSubOneTilte",
          },
          {
            id: "oneSubTwo",
            title: "oneSubTwoTitle",
          },
          {
            id: "oneSubThree",
            title: "oneSubThreeTitle",
          },
        ],
      },
      {
        id: "two",
        title: "twoTitle",
        items: [
          {
            id: "twoSubOne",
            title: "twoSubOneTitle",
          },
        ],
      },
    ],
  };

  beforeEach(async () => {
    topMenu = await initComponentTest("dbg-top-menu");
    topMenu.config = config;
    await topMenu.updateComplete;
  });

  afterEach(() => {
    removeElement(topMenu);
  });

  it("renders propery", () => {
    toMatchHtmlSnapshot(topMenu.shadowRoot?.innerHTML);
  });

  it("should render correct number of top items", () => {
    const topLeftItems = topMenu
      .getShadowRoot()
      .querySelectorAll(".menu-bar .item");
    expect(topLeftItems.length).eq(config.items.length);
  });

  describe("when clicked on top item", () => {
    beforeEach(async () => {
      (
        topMenu.getShadowRoot().querySelector(".menu-bar .item") as HTMLElement
      ).click();
      await topMenu.updateComplete;
    });
    it("should open dropdown view", () => {
      const dropDown = topMenu.getShadowRoot().querySelector(".dropdown");
      expect(dropDown?.classList.contains("show")).eq(true);
    });

    it("should have correct number of subItems", () => {
      const subItems = topMenu.getShadowRoot().querySelectorAll(".dropdown li");
      expect(subItems.length).eq(config.items[0].items.length);
    });
  });
});
