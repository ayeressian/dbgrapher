import puppeteer from 'puppeteer';
import { expect } from 'chai';

describe('Google', () => {
  let page: puppeteer.Page;
  before(async () => {
    const browser = await puppeteer.launch();
    page = await browser.newPage();
    return page.goto('https://example.com');
  });

  it('should display "google" text on page', () => {
    expect(page).to.eq('google');
  });
});
