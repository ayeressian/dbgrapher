import { Browser, Page } from "playwright";
import twoTableSchema from "./two-table-schema.json";
import getBrowser from "./get-browser";

describe("Relations", () => {
  let browser: Browser;
  let page: Page;
  const passData: { page?: Page } = {};

  beforeAll(async () => {
    browser = await getBrowser();
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto("http://localhost:9999/");
    await page.waitForLoadState("domcontentloaded");
    passData.page = page;

    await page.click("dbg-app dbg-cloud-provider-dialog dbg-dialog .no-drive");

    // Upload buffer from memory
    await page.setInputFiles("dbg-app dbg-file-inputs #dbgFileInput", {
      name: "file.txt",
      mimeType: "json/application",
      buffer: Buffer.from(JSON.stringify(twoTableSchema)),
    });
  });

  afterEach(async () => {
    await page.close();
  });

  describe("when a one to one relation is created", () => {
    beforeEach(async () => {
      await page.click("dbg-app dbg-side-panel .create_relation_one_to_one");
      const tables = await page.$$("dbg-app dbg-db-viewer db-viewer table");
      await tables[0]?.click();
      await tables[1]?.click();
    });

    it("should display relation between tables", async () => {
      const paths = await page.$$("dbg-app dbg-db-viewer db-viewer path");
      expect(paths.length).toBe(2);
    });
  });

  describe("when a one to many relation is created", () => {
    beforeEach(async () => {
      await page.click("dbg-app dbg-side-panel .create_relation_one_to_many");
      const tables = await page.$$("dbg-app dbg-db-viewer db-viewer table");
      await tables[0]?.click();
      await tables[1]?.click();
    });

    it("should display relation between tables", async () => {
      const paths = await page.$$("dbg-app dbg-db-viewer db-viewer path");
      expect(paths.length).toBe(2);
    });
  });

  describe("when a zero to many relation is created", () => {
    beforeEach(async () => {
      await page.click("dbg-app dbg-side-panel .create_relation_zero_to_many");
      const tables = await page.$$("dbg-app dbg-db-viewer db-viewer table");
      await tables[0]?.click();
      await tables[1]?.click();
    });

    it("should display relation between tables", async () => {
      const paths = await page.$$("dbg-app dbg-db-viewer db-viewer path");
      expect(paths.length).toBe(2);
    });
  });

  describe("when a zero to one relation is created", () => {
    beforeEach(async () => {
      await page.click("dbg-app dbg-side-panel .create_relation_zero_to_one");
      const tables = await page.$$("dbg-app dbg-db-viewer db-viewer table");
      await tables[0]?.click();
      await tables[1]?.click();
    });

    it("should display relation between tables", async () => {
      const paths = await page.$$("dbg-app dbg-db-viewer db-viewer path");
      expect(paths.length).toBe(2);
    });
  });
});
