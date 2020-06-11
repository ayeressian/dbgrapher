import { chromium, Browser, Page } from 'playwright';

describe('New file', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch({ headless: process.env.DEBUG !== 'true' });
  });
  
  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:9999/');
  });

  afterEach(async () => {
    await page.close();
  });

  it('should have correct title', async () => {
    expect(await page.title()).toBe('DBGrapher');
  });

  it('welcome dialog should be visible', async () => {
    const attr = await page.getAttribute('dbg-app dbg-welcome-dialog dbg-dialog', 'show');
    expect(attr).toBe('');
  });

  describe('when clicked on new file', () => {
    beforeEach(async () => {
      await page.click('dbg-app dbg-welcome-dialog dbg-dialog .new-file');
    });
    it ('should close the welcome dialog', async () => {
      const attr = await page.getAttribute('dbg-app dbg-welcome-dialog dbg-dialog', 'show');
      expect(attr).toBe(null);
    });

    describe('when cliking on new "create new table" side panel action', () => {
      beforeEach(async () => {
        await page.click('dbg-app dbg-side-panel .create_table');
      });
      it ('should be activated', async () => {
        const elem = await page.$('dbg-app dbg-side-panel .create_table.active');
        expect(elem).not.toBe(null);
      });

      describe('when clicking on viewer', () => {
        beforeEach(async () => {
          await page.click('dbg-app dbg-db-viewer db-viewer');
        });
        it('should open create table dialog', async () => {
          const attr = await page.getAttribute('dbg-app dbg-table-dialog dbg-dialog', 'show');
          expect(attr).toBe('');
        });

        describe('when table name is provided', () => {
          beforeEach(async () => {
            await page.fill('dbg-app dbg-table-dialog dbg-dialog [data-testid="table-name"]', 'test');
          });
          describe('when save button is clicked', () => {
            beforeEach(async () => {
              await page.click('dbg-app dbg-table-dialog dbg-dialog [data-testid="save-btn"]');
            });
            it('should close the create table dialog', async () => {
              const attr = await page.getAttribute('dbg-app dbg-table-dialog dbg-dialog', 'show');
              expect(attr).toBe(null);
            });
          });
        });
        describe('when table name is not provided', () => {
          describe('when save button is clicked', () => {
            beforeEach(async () => {
              await page.click('dbg-app dbg-table-dialog dbg-dialog [data-testid="save-btn"]');
            });
            it('should not close the create table dialog', async () => {
              const attr = await page.getAttribute('dbg-app dbg-table-dialog dbg-dialog', 'show');
              expect(attr).toBe('');
            });
          });
        });
      });
    });
  });
});
