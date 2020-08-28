import ContactClass from './contact';

describe('Contact class tests', () => {

  let contact: ContactClass; // declare the contact variable as a ContactClass type
  // let contact: ContactClass = null; // same thing

  beforeEach(() => {
    contact = new ContactClass(); // instantiate the class  before each test
  });

  afterEach(() => { // teardown to make sure instances of variables get destroyed, helps avoid mem leaks
    contact = null;
  });

  const myContactInfo = {
    id: 1,
    name: 'Liz',
    email: 'liz@sample.com',
    number: '1234567890',
    country: 'United States',
    favorite: true
  }

  it('should have a valid constructor', () => {
    // if instantiation worked, constructor will be used: if contact is not null, we prove this
    contact; //?
    expect(contact).not.toBeNull();
  });

  it('should set the name correctly through the constructor, and then test it with get', () => {
    contact = new ContactClass('Liz');

    contact; //?
    expect(contact.name).toBe('Liz');
    expect(contact.name).toEqual('Liz');
  });

  it('should set and get id correctly', () => {
    // set id
    contact.id = myContactInfo.id; //?
    // get id
    expect(contact.id).toBe(myContactInfo.id);
  });

  it('should set and get name correctly', () => {
    // set name
    contact.name = myContactInfo.name; //?
    // get name
    expect(contact.name).toEqual(myContactInfo.name);
  });

  it('should set and get email correctly', () => {
    // set email
    contact.email = myContactInfo.email; //?
    // get email
    expect(contact.email).toEqual(myContactInfo.email);
  });

  it('should set and get number correctly', () => {
    contact.number = myContactInfo.number; //?
    expect(contact.number).toEqual(myContactInfo.number);
  });

  it('should set and get country correctly', () => {
    contact.country = myContactInfo.country; //?
    expect(contact.country).toEqual(myContactInfo.country);
  });

  it('should set and get favorite', () => {
    contact.favorite = myContactInfo.favorite; //?
    expect(contact.favorite).toBe(myContactInfo.favorite);
  });

});
