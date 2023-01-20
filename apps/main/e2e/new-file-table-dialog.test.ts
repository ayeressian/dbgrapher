import { test, expect } from "@playwright/test";
import createTableDialog from "./create-table-dialog.js";

const { describe, beforeEach } = test;

describe("New file", () => {
  beforeEach(async ({ page }) => {
    await page.goto("http://localhost:9999/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("should have correct title", async ({ page }) => {
    expect(await page.title()).toBe("DB Grapher");
  });

  test("should show new/open file dialog", async ({ page }) => {
    const attr = await page.getAttribute(
      "dbg-app dbg-new-open-dialog dbg-dialog",
      "show"
    );
    expect(attr).toBe("");
  });
  describe("when clicked on new file", () => {
    beforeEach(async ({ page }) => {
      await page.click(
        'dbg-app dbg-new-open-dialog dbg-dialog [data-testid="new-file"]'
      );
    });
    test("should close the new/open file dialog", async ({ page }) => {
      const attr = await page.getAttribute(
        "dbg-app dbg-new-open-dialog dbg-dialog",
        "show"
      );
      expect(attr).toBe(null);
    });
    test("should open db type dialog", async ({ page }) => {
      const attr = await page.getAttribute(
        "dbg-app dbg-db-type-dialog dbg-dialog",
        "show"
      );
      expect(attr).toBe("");
    });
    describe("when db type is selected", () => {
      beforeEach(async ({ page }) => {
        await page.click(
          'dbg-app dbg-db-type-dialog dbg-dialog [data-testid="mssql"]'
        );
      });
      test("should close the db type dialog", async ({ page }) => {
        const attr = await page.getAttribute(
          "dbg-app dbg-db-type-dialog dbg-dialog",
          "show"
        );
        expect(attr).toBe(null);
      });
      describe('when cliking on new "create new table" side panel action', () => {
        beforeEach(async ({ page }) => {
          await page.click("dbg-app dbg-side-panel .create_table");
        });
        test("should be activated", async ({ page }) => {
          const elem = await page.$(
            "dbg-app dbg-side-panel .create_table.active"
          );
          expect(elem).not.toBe(null);
        });

        describe("when clicking on viewer", () => {
          beforeEach(async ({ page }) => {
            await page.click("dbg-app dbg-db-viewer db-viewer");
          });
          test("should open create table dialog", async ({ page }) => {
            const attr = await page.getAttribute(
              "dbg-app dbg-table-dialog dbg-dialog",
              "show"
            );
            expect(attr).toBe("");
          });
          createTableDialog();
        });
      });
    });
  });
});
