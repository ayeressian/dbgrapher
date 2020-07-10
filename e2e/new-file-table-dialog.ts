import { chromium, Browser, Page } from 'playwright';
import createTableDialog from './create-table-dialog';

describe('New file', () => {
  let browser: Browser;
  let page: Page;
  const passData: {page?: Page} = {};

  beforeAll(async () => {
    browser = await chromium.launch({ headless: process.env.DEBUG !== 'true' });
  });
  
  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:9999/');
    passData.page = page;
  });

  afterEach(async () => {
    await page.close();
  });

  it('should have correct title', async () => {
    expect(await page.title()).toBe('DBGrapher');
  });

  it('should show cloud provider dialog', async () => {
    const attr = await page.getAttribute('dbg-app dbg-cloud-provider-dialog dbg-dialog', 'show');
    expect(attr).toBe('');
  });

  describe('when none has selected from cloud provider dialog', () => {
    beforeEach(async () => {
      await page.click('dbg-app dbg-cloud-provider-dialog dbg-dialog .no-drive');
    });
    it('should show new open file dialog', async () => {
      const attr = await page.getAttribute('dbg-app dbg-new-open-dialog dbg-dialog', 'show');
      expect(attr).toBe('');
    });
    describe('when clicked on new file', () => {
      beforeEach(async () => {
        await page.click('dbg-app dbg-new-open-dialog dbg-dialog .new-file');
      });
      it ('should close the new open file dialog', async () => {
        const attr = await page.getAttribute('dbg-app dbg-new-open-dialog dbg-dialog', 'show');
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
          createTableDialog(passData as {page: Page});
        });
      });
    });
  });
});
