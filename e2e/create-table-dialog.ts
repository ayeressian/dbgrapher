import { Page } from "playwright";

export default (data: { page: Page }): void => {
  describe("create table dialog", () => {
    let page: Page;
    beforeEach(() => {
      page = data.page;
    });

    describe("when table name is provided", () => {
      beforeEach(async () => {
        await page.fill(
          'dbg-app dbg-table-dialog dbg-dialog [data-testid="table-name"]',
          "test"
        );
      });
      describe("when save button is clicked", () => {
        beforeEach(async () => {
          await page.click(
            'dbg-app dbg-table-dialog dbg-dialog [data-testid="save-btn"]'
          );
        });
        it("should close the create table dialog", async () => {
          const elemHandle = await page.$(
            'dbg-app dbg-table-dialog dbg-dialog [data-testid="table-dialog"]'
          );
          expect(elemHandle).toBeNull();
        });
        it("should create a new table on the viewer", async () => {
          const elems = await page.$$("dbg-app dbg-db-viewer db-viewer table");
          expect(elems.length).toBe(1);
        });
      });
    });

    describe("when table name is not provided", () => {
      describe("when save button is clicked", () => {
        beforeEach(async () => {
          await page.click(
            'dbg-app dbg-table-dialog dbg-dialog [data-testid="save-btn"]'
          );
        });
        it("should not close the create table dialog", async () => {
          const elemHandle = await page.$(
            'dbg-app dbg-table-dialog dbg-dialog [data-testid="table-dialog"]'
          );
          expect(elemHandle).toBeDefined();
        });
      });
    });
  });
};
