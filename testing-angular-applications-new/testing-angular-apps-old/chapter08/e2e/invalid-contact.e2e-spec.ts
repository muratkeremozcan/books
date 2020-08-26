import { browser, by, element, ExpectedConditions as EC } from 'protractor';
import { async } from 'q';

describe('adding a new contact', () => {
  describe('with an invalid email', () => {
    beforeEach(async() => {
      browser.get('/#/add');
      await element(by.id('contact-name')).sendKeys('Bad Email');
    });

    it('should not create a new contact with baduser.com', async() => {
      let email = element(by.id('contact-email'));
      await email.sendKeys('baduser.com');
      await element(by.buttonText('Create')).click();

      let invalidEmailModal = element(by.tagName('app-invalid-email-modal'));
      expect(invalidEmailModal.isPresent()).toBe(true);

      let modalButton = invalidEmailModal.element(by.tagName('button'));
      await modalButton.click();
      // ExpectedConditions API combined with browser.wait method allows the test to wait for some condition
        // to occur on the web application withing a set period of time
      await browser.wait(EC.not(EC.presenceOf(invalidEmailModal)), 20000);
      expect(await invalidEmailModal.isPresent()).toBe(false);
      expect(await browser.getCurrentUrl()).toEqual(browser.baseUrl + '/#/add');
    });

    it('should not create a new contact with @baduser.com', async() => {
      let email = element(by.id('contact-email'));
      await email.sendKeys('@baduser.com');
      let invalidEmailModal = element(by.tagName('app-invalid-email-modal'));
      expect(invalidEmailModal.isPresent()).toBe(false);
    });
  });

  describe('with an invalid phone number', () => {
    beforeEach(() => {
      browser.get('/#/add');
      element(by.id('contact-name')).sendKeys('Bad Tel');
    });

    it('should not create a new contact with a formatted telephone number', async() => {
        let tel = element(by.css('input[type="tel"]'));
        tel.sendKeys('123-456-7890');
        element(by.buttonText('Create')).click();
        let invalidTelModal =
          element(by.tagName('app-invalid-phone-number-modal'));
        expect(invalidTelModal.isDisplayed()).toBe(true);
        let modalButton = invalidTelModal.element(by.tagName('button'));
        modalButton.click();

        browser.wait(EC.not(EC.presenceOf(invalidTelModal)), 20000);
        expect(invalidTelModal.isPresent()).toBe(false);
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/#/add');
      });

    it('should not create a new contact with too many numbers in the telephone number',
      () => {
        let tel = element(by.css('input[type="tel"]'));
        tel.sendKeys('12345678901');
        element(by.buttonText('Create')).click();
        let invalidTelModal =
          element(by.tagName('app-invalid-phone-number-modal'));
        browser.wait(EC.visibilityOf(invalidTelModal), 20000);
        expect(invalidTelModal.isDisplayed()).toBe(true);
        let modalButton = invalidTelModal.element(by.tagName('button'));
        modalButton.click();
        browser.wait(EC.not(EC.presenceOf(invalidTelModal)), 20000);
        expect(invalidTelModal.isPresent()).toBe(false);
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + '/#/add');
      });
  });
});