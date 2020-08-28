// listing 8.7
import {browser, by, element, ExpectedConditions as EC} from 'protractor';

describe('adding a new contact with only a name', () => {
  beforeAll(() => {
    browser.get('/#/');
  });

  it('should find the add contact button', async() => {
    await element(by.id('add-contact')).click();
    const currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toEqual(browser.baseUrl + '/#/add');
  });

  it('should write a name', async() => {
    await element(by.id('contact-name')).sendKeys('Ada');
    expect(element(by.id('contact-name')).getAttribute('value')).toEqual('Ada');
  });

  it('should click the create button', async() => {
    await element(by.css('.create-button')).click();
    const currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).toEqual(browser.baseUrl + '/#/');
  });
});