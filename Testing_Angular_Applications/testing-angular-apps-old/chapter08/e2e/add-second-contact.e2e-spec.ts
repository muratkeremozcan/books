// listing 8.9
import {browser, by, element, ExpectedConditions as EC} from 'protractor';

describe('adding a new contact with name, email, and phone number', () => {
  beforeAll(async() => {
    browser.get('/#/');
    await element(by.id('add-contact')).click();
    await element(by.id('contact-name')).sendKeys('Grace\'s Directive');
  });

  it('should send an email address', async() => {
    let email = element(by.id('contact-email'));
    await email.sendKeys('grace@example.com');
    expect(await email.getAttribute('value')).toEqual('grace@example.com');
  });

  it('should send a phone number', async() => {
    let tel = element(by.css('input[type="tel"]'));
    await tel.sendKeys('1234567890');
    expect(await tel.getAttribute('value')).toEqual('1234567890');
  });
});