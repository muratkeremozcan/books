import {browser, by, element, ElementFinder} from 'protractor';
import {promise as wdpromise} from 'selenium-webdriver';

export interface Contact {
  name?: string;
  email?: string;
  tel?: string;
}

describe('the contact list', () => {
  beforeAll(() => {
    browser.get('/#/');
  });

  it('with filter: should find existing contact "Craig Service"', () => {
    // first find the tbody web element using the by.tagName locator
    let tbody = element(by.tagName('tbody'));
    // within the tbody get all the table rows and assign them to trs
    let trs = tbody.all(by.tagName('tr'));
    // next, filter the table rows in trs to find the one we want
      // when FILTER is called, the returned object is an array of web elements that satisfy the callback function
    let craigService = trs.filter(elem => {
      // pass filter a callback function that evaluates to true if the text in the row matches 'Craig Service'
      // The tds: 0 = mood, 1 = name, 2 = email, 3 = phone number
      return elem.all(by.tagName('td')).get(1).getText().then(text => {
        return text === 'Craig Service';
      });
    });
    // Nothing happens here until you use it. Although we called getText in the
    // filter function, it is not executed until we use it. When you use it, the
    // promises enter the control flow and are resolved. This is similar to
    // calling element(), nothing happens until you do something like getText().
    expect(craigService.count()).toBeGreaterThan(0); // verify that craigService exists
    expect(craigService.all(by.tagName('td')).get(2).getText()) // verify the third colum is the correct email address
        .toEqual('craig.services@example.com');
  });

  let expectedContactList: Contact[] = [
    {
      name: 'Adrian Directive',
      email: 'adrian.directive@example.com',
      tel: '+1 (703) 555-0123'
    },
    {
      name: 'Rusty Component',
      email: 'rusty.component@example.com',
      tel: '+1 (441) 555-0122'
    },
    {
      name: 'Jeff Pipe',
      email: 'jeff.pipe@example.com',
      tel: '+1 (714) 555-0111'
    },
    {
      name: 'Craig Service',
      email: 'craig.services@example.com',
      tel: '+1 (514) 555-0132'
    }
  ];

  it('with map: should create a map object', () => {
    // first find the tbody web element using the by.tagName locator
    let tbody = element(by.tagName('tbody'));
    // within the tbody get all the table rows and assign them to trs
    let trs = tbody.all(by.tagName('tr'));
    // MAP converts elements returned from trs to an array
    // for each contact, run the map function callback for each tr element
    let contactList = trs.map(elem => {
      let contact: Contact = {};
      let tds = elem.all(by.tagName('td'));
      // We need to get the values of the contact name and email. Since these
      // are in a couple of different promises, we'll  create a promise array.
      let promises: any[] = [];

      // Getting the text returns a promise of a string then the next function
      // sets the contact's name. This function returns void so the final
      // promise saved is of Promise<void>. We set the promise array to be of
      // type any since we do not care about the promise type.

      // gets the text, sets the value to the corresponding contact property, then push the promise to the promise array
      promises.push(tds.get(1).getText().then(text => {
        contact.name = text;
      }));
      promises.push(tds.get(2).getText().then(text => {
        contact.email = text;
      }));
      promises.push(tds.get(3).getText().then(text => {
        contact.tel = text;
      }));

      // Resolve all the promises and return the contact.
      return Promise.all(promises).then(() => {
        return contact;
      });
    });

    // Check the results
    expect(contactList).toBeDefined();
    contactList.then((contacts: Contact[]) => { // cast the resolved contact list to a contact array

      // Spot check the results
      expect(contacts.length).toEqual(4);
      expect(contacts[0]).toBeDefined();
      expect(contacts[1].email).toEqual('rusty.component@example.com');
      expect(contacts[2].tel).toEqual('+1 (714) 555-0111');
      expect(contacts[3].name).toEqual('Craig Service');

      // Check all the contacts match
      expect(contacts).toEqual(expectedContactList);
    });
  });

  it('with reduce: get a list of contact names', () => {
    // first find the tbody web element using the by.tagName locator
    let tbody = element(by.tagName('tbody'));
    // within the tbody get all the table rows and assign them to trs
    let trs = tbody.all(by.tagName('tr'));
    // the reduce function applies a callback to each element of the array and accumulates the result in a single value
    let contacts = trs.reduce((acc, curr) => {
      // the curr parameter represents the table row element
        // the callback gets the text from the first column. Then you take the text and concatenate it into the accumulator
      let name = curr.all(by.tagName('td')).get(1);
      return name.getText().then(text => {
        return acc === '' ? text : acc + ', ' + text;
      });
    }, '');

    expect(contacts).toBe(
        'Adrian Directive, Rusty Component, Jeff Pipe, Craig Service');
  });
});
