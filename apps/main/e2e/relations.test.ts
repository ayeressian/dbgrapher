import { test, expect } from "@playwright/test";
import twoTableSchema from "./two-table-schema.js";

const { describe, beforeEach } = test;

describe("Relations", () => {
  beforeEach(async ({ page }) => {
    await page.goto("http://localhost:9999/");
    await page.waitForLoadState("domcontentloaded");

    // Upload buffer from memory
    await page.setInputFiles("dbg-app dbg-file-inputs #dbgFileInput", {
      name: "file.txt",
      mimeType: "json/application",
      buffer: Buffer.from(JSON.stringify(twoTableSchema)),
    });
  });

  describe("when a one to one relation is created", () => {
    beforeEach(async ({ page }) => {
      await page.click("dbg-app dbg-side-panel .create_relation_one_to_one");
      const tables = await page.$$("dbg-app dbg-db-viewer db-viewer table");
      await tables[0]?.click();
      await tables[1]?.click();
    });

    test("should display relation between tables", async ({ page }) => {
      await page.waitForSelector("dbg-app dbg-db-viewer db-viewer path");
      const paths = await page.$$("dbg-app dbg-db-viewer db-viewer path");
      expect(paths.length).toBe(2);
    });
  });

  describe("when a one to many relation is created", () => {
    beforeEach(async ({ page }) => {
      await page.click("dbg-app dbg-side-panel .create_relation_one_to_many");
      const tables = await page.$$("dbg-app dbg-db-viewer db-viewer table");
      await tables[0]?.click();
      await tables[1]?.click();
    });

    test("should display relation between tables", async ({ page }) => {
      await page.waitForSelector("dbg-app dbg-db-viewer db-viewer path");
      const paths = await page.$$("dbg-app dbg-db-viewer db-viewer path");
      expect(paths.length).toBe(2);
    });
  });

  describe("when a zero to many relation is created", () => {
    beforeEach(async ({ page }) => {
      await page.click("dbg-app dbg-side-panel .create_relation_zero_to_many");
      const tables = await page.$$("dbg-app dbg-db-viewer db-viewer table");
      await tables[0]?.click();
      await tables[1]?.click();
    });

    test("should display relation between tables", async ({ page }) => {
      await page.waitForSelector("dbg-app dbg-db-viewer db-viewer path");
      const paths = await page.$$("dbg-app dbg-db-viewer db-viewer path");
      expect(paths.length).toBe(2);
    });
  });

  describe("when a zero to one relation is created", () => {
    beforeEach(async ({ page }) => {
      await page.click("dbg-app dbg-side-panel .create_relation_zero_to_one");
      const tables = await page.$$("dbg-app dbg-db-viewer db-viewer table");
      await tables[0]?.click();
      await tables[1]?.click();
    });

    test("should display relation between tables", async ({ page }) => {
      await page.waitForSelector("dbg-app dbg-db-viewer db-viewer path");
      const paths = await page.$$("dbg-app dbg-db-viewer db-viewer path");
      expect(paths.length).toBe(2);
    });
  });
});
