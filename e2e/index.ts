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
  });
});
