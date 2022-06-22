import { expect } from "chai";
import TopMenu from "../../../src/components/top-menu/top-menu";
import { initComponentTest, removeElement } from "../../helper";

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

  it("should render correct number of top items", () => {
    const topLeftItems =
      topMenu.shadowRoot!.querySelectorAll(".menu-bar .item")!;
    expect(topLeftItems.length).eq(config.items.length);
  });

  describe("when clicked on top item", () => {
    beforeEach(async () => {
      (
        topMenu.shadowRoot!.querySelector(".menu-bar .item") as HTMLElement
      ).click();
      await topMenu.updateComplete;
    });
    it("should open dropdown view", () => {
      const dropDown = topMenu.shadowRoot!.querySelector(".dropdown");
      expect(dropDown).to.have.class("show");
    });

    it("should have correct number of subItems", () => {
      const subItems = topMenu.shadowRoot!.querySelectorAll(".dropdown li");
      expect(subItems.length).eq(config.items[0].items.length);
    });
  });
});
