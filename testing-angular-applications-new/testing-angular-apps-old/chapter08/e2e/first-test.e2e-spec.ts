import {browser} from 'protractor';
import { async } from 'q';

// Listing 8.4
describe('our first Protractor test', () => {
  it('should load a page and verify the url', async() => {
    await browser.get('/');
    const currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toEqual(browser.baseUrl + '/#/');
  });
});
