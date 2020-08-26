import {ContactListPageObject} from '../po/contact-list.po';
import {browser, by, element, ExpectedConditions as EC} from 'protractor';
import {WebElement} from 'selenium-webdriver';

describe('the contact list', () => {
  // Before all tests, lets create a new page object.
  beforeAll(() => {
  });

  it('should be able to login', async() => {
    browser.waitForAngularEnabled(false);
    browser.get('/assets/login.html');
    await element(by.css('input.user')).sendKeys('username');
    await element(by.css('input.password')).sendKeys('password');
    await element(by.id('login')).click();

    // Should go to the contact list after logging in.
    browser.waitForAngularEnabled(true);
    const list = element(by.css('app-contact-list'));
    expect(await list.getText()).toContain('Jeff Pipe');
  });

  it('waits for list to load using Expected Conditions', () => {
    browser.waitForAngularEnabled(false);
    browser.get('https://testing-angular-applications.github.io');
    const list = element(by.css('app-contact-list'));
    const listReady = EC.not(EC.textToBePresentInElement(list, 'Loading contacts'));
    browser.wait(listReady, 20000, 'Waiting for list to load');
    expect(list.getText()).toContain('Jeff Pipe');
  });

});

describe('feed dialog', () => {
  let EC

  beforeEach(() => {
    browser.get('/#/contact/4')
    EC = browser.ExpectedConditions;
  });

  afterEach(() => {
    browser.waitForAngularEnabled(true);
  })

  it('should open the dialog with waitForAngular', () => {
    browser.waitForAngularEnabled(true);
    let feedButton = element(by.css('button.feed-button'));
    feedButton.click();

    let dialogTitle = element(by.css('app-contact-feed h2.mat-dialog-title'))
    expect(dialogTitle.getText()).toContain('Latest posts from Craig Service')

    let closeButton = element(by.css('button[mat-dialog-close]'))

    // This closes the dialog, but we need to wait for the animation to complete, even
    // with automatic angular waiting enable.
    closeButton.click();

    browser.wait(EC.stalenessOf(dialogTitle), 10000, 'Waiting for dialog to close');
    // This closes the dialog, but the expectation fails because the title is still displayed
    // while the dialog close animation runs.
    expect(dialogTitle.isPresent()).toBeFalsy();
  })

  it('should open the dialog with expected conditions', () => {
    browser.waitForAngularEnabled(false);
    let feedButton = element(by.css('button.feed-button'));
    browser.wait(EC.elementToBeClickable(feedButton),
      20000, 'waiting for feed button to be clickable');
    feedButton.click();

    let dialogTitle = element(by.css('app-contact-feed h2.mat-dialog-title'))
    browser.wait(EC.visibilityOf(dialogTitle),
      10000, 'waiting for close button to be clickable');
    expect(dialogTitle.getText()).toContain('Latest posts from Craig Service')

    let closeButton = element(by.css('button[mat-dialog-close]'))
    closeButton.click();
    browser.wait(EC.stalenessOf(dialogTitle), 10000, 'wait for dialog to close');
    expect(dialogTitle.isPresent()).toBeFalsy();
  });

  it('should enable the follow button with more than two posts', () => {
    let feedButton = element(by.css('button.feed-button'));
    feedButton.click();

    let followButton = element(by.css('button.follow'))
    expect(followButton.isEnabled()).toBeFalsy();
    let moreThanOnePost = () => {
      return element.all(by.css('app-contact-feed mat-list-item')).count()
        .then((count) => {
          return count >= 2;
        })
    };
    browser.wait(moreThanOnePost, 20000, 'Waiting for two posts');

    expect(followButton.isEnabled()).toBeTruthy();
  });

  // instead of using an element inder from Protractor, this uses a JavaScript function that runs in the browser an returns an array of WebElements
  it('should enable the follow button with more than two posts using executeScript', () => {
    let feedButton = element(by.css('button.feed-button'));
    feedButton.click();

    let followButton = element(by.css('button.follow'))
    expect(followButton.isEnabled()).toBeFalsy();

    // retrieving elements with custom finder
    function findAllPosts() {
      return document.querySelectorAll('app-contact-feed mat-list-item')
    }
    browser.wait(() => {
      return browser.driver.executeScript(findAllPosts)
        .then((posts: WebElement[]) => {
          return posts.length >= 2;
        })
    }, 20000, 'Waiting for two posts');

    expect(followButton.isEnabled()).toBeTruthy();
  });
});
