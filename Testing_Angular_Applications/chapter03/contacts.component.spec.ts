import { ContactsComponent } from './contacts.component';
import { Contact } from './shared/models/contact.model';

// [3.1] example of an isolated test; no Angular dependencies needed, just regular TS
// assertions: toBeNull, toBe, toEqual
// other: Array(number).fill(arrayElement);

describe('ContactsComponent Tests', () => {
  let contactsComponent: ContactsComponent;

  beforeEach(() => {
    contactsComponent = new ContactsComponent();
  });

  it('should set instance', () => {
    expect(contactsComponent).not.toBeNull();
  });

  it('should be no contacts if there is no data', () => {
    expect(contactsComponent.contacts.length).toBe(0);
  });

  describe('contact list', () => {
    let newContact: Contact;

    beforeEach(() => {
      newContact = {
        id: 1,
        name: 'Jason'
      };
    });

    it('should have contacts in the list if there is data', () => {
      const contactList: Array<Contact> = [newContact];

      contactsComponent.contacts = contactList;

      expect(contactsComponent.contacts.length).toEqual(1);
    });

    it('should be able to handle more than one contact', () => {
      const mockContactList = (numContacts: number, contact: Contact): Contact[] => Array(numContacts).fill(contact);

      contactsComponent.contacts = mockContactList(5, newContact);

      expect(contactsComponent.contacts.length).toEqual(5);
    });
  });
});
