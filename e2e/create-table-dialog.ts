import { test, expect } from "@playwright/test";

const { describe, beforeEach } = test;

export default (): void => {
  describe("create table dialog", () => {
    describe("when table name is provided", () => {
      beforeEach(async ({ page }) => {
        await page.fill(
          'dbg-app dbg-table-dialog dbg-dialog [data-testid="table-name"]',
          "test"
        );
      });
      describe("when save button is clicked", () => {
        beforeEach(async ({ page }) => {
          await page.click(
            'dbg-app dbg-table-dialog dbg-dialog [data-testid="save-btn"]'
          );
        });
        test("should close the create table dialog", async ({ page }) => {
          const elemHandle = await page.$(
            'dbg-app dbg-table-dialog dbg-dialog [data-testid="table-dialog"]'
          );
          expect(elemHandle).toBeNull();
        });
        test("should create a new table on the viewer", async ({ page }) => {
          const elems = await page.$$("dbg-app dbg-db-viewer db-viewer table");
          expect(elems.length).toBe(1);
        });
      });
    });

    describe("when table name is not provided", () => {
      describe("when save button is clicked", () => {
        beforeEach(async ({ page }) => {
          await page.click(
            'dbg-app dbg-table-dialog dbg-dialog [data-testid="save-btn"]'
          );
        });
        test("should not close the create table dialog", async ({ page }) => {
          const elemHandle = await page.$(
            'dbg-app dbg-table-dialog dbg-dialog [data-testid="table-dialog"]'
          );
          expect(elemHandle).not.toBeUndefined();
        });
      });
    });
  });
};
