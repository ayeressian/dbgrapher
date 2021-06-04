import { expect } from "chai";
import { Browser, Page } from "playwright";
import createTableDialog from "./create-table-dialog";
import getBrowser from "./get-browser";

describe("New file", () => {
  let browser: Browser;
  let page: Page;
  const passData: { page?: Page } = {};

  before(async () => {
    browser = await getBrowser();
  });

  after(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto("http://localhost:9999/");
    await page.waitForLoadState("domcontentloaded");
    passData.page = page;
  });

  afterEach(async () => {
    await page.close();
  });

  it("should have correct title", async () => {
    expect(await page.title()).to.equal("DB Grapher");
  });

  it("should show cloud provider dialog", async () => {
    const attr = await page.getAttribute(
      "dbg-app dbg-cloud-provider-dialog dbg-dialog",
      "show"
    );
    expect(attr).to.equal("");
  });

  describe("when none has selected from cloud provider dialog", () => {
    beforeEach(async () => {
      await page.click(
        'dbg-app dbg-cloud-provider-dialog dbg-dialog [data-testid="none"]'
      );
    });
    it("should close cloud provider dialog", async () => {
      const attr = await page.getAttribute(
        "dbg-app dbg-cloud-provider-dialog dbg-dialog",
        "show"
      );
      expect(attr).to.equal(null);
    });
    it("should show new/open file dialog", async () => {
      const attr = await page.getAttribute(
        "dbg-app dbg-new-open-dialog dbg-dialog",
        "show"
      );
      expect(attr).to.equal("");
    });
    describe("when clicked on new file", () => {
      beforeEach(async () => {
        await page.click(
          'dbg-app dbg-new-open-dialog dbg-dialog [data-testid="new-file"]'
        );
      });
      it("should close the new/open file dialog", async () => {
        const attr = await page.getAttribute(
          "dbg-app dbg-new-open-dialog dbg-dialog",
          "show"
        );
        expect(attr).to.be.null;
      });
      it("should open db type dialog", async () => {
        const attr = await page.getAttribute(
          "dbg-app dbg-db-type-dialog dbg-dialog",
          "show"
        );
        expect(attr).to.equal("");
      });
      describe("when db type is selected", () => {
        beforeEach(async () => {
          await page.click(
            'dbg-app dbg-db-type-dialog dbg-dialog [data-testid="mssql"]'
          );
        });
        it("should close the db type dialog", async () => {
          const attr = await page.getAttribute(
            "dbg-app dbg-db-type-dialog dbg-dialog",
            "show"
          );
          expect(attr).to.equal(null);
        });
        describe('when cliking on new "create new table" side panel action', () => {
          beforeEach(async () => {
            await page.click("dbg-app dbg-side-panel .create_table");
          });
          it("should be activated", async () => {
            const elem = await page.$(
              "dbg-app dbg-side-panel .create_table.active"
            );
            expect(elem).not.to.equal(null);
          });

          describe("when clicking on viewer", () => {
            beforeEach(async () => {
              await page.click("dbg-app dbg-db-viewer db-viewer");
            });
            it("should open create table dialog", async () => {
              const attr = await page.getAttribute(
                "dbg-app dbg-table-dialog dbg-dialog",
                "show"
              );
              expect(attr).eq("");
            });
            createTableDialog(passData as { page: Page });
          });
        });
      });
    });
  });
});
