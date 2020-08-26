// COMPONENT TESTING Listing 3.3 3.4 3.5 3.6 3.7 3.8 3.9 3.10 3.11
// a component is a chunk of reusable code that encapsulates certain functionality
  // They are like directives, but they also include a view or HTML template

// import Test dependencies included in Angular
// DebugElement: to inspect an element during testing. DISTINCT in COMPONENT TESTING because of DOM validation
import { DebugElement } from '@angular/core';
// ComponentFixture: to create fixture
// fakeAsync: ensure all async tasks are complete before assertions (distinct in COMPONENT TESTING because of DOM manipulation)
// TestBed: to setup and config tests
// tick: simulate time (distinct in COMPONENT TESTING because of DOM manipulation)
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
// by: to select DOM elements: provides 3 methods: all, css, directive.
// the below are distinct in COMPONENT TESTING because of DOM manipulation
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; // to mock animations
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing'; // bootstrap the browser for testing
import { RouterTestingModule } from '@angular/router/testing'; // to setup routing for testing

// import non-testing Angular module
import { FormsModule } from '@angular/forms'; // ContactEditComponent uses it for form controls
// import dependencies relevant to the project
import { Contact, ContactService, FavoriteIconDirective, InvalidEmailModalComponent, InvalidPhoneNumberModalComponent } from '../shared';
import { AppMaterialModule } from '../../app.material.module';
import { ContactEditComponent } from './contact-edit.component';

import '../../../material-app-theme.scss';

describe('ContactEditComponent tests', () => {
  // the setup of component tests includes 3 parts
  // part 1 : declare the variables

  // fixture: stores an instance of the ComponentFixture, which contains methods that help debug and test a component
  let fixture: ComponentFixture<ContactEditComponent>; // the type is ContactEditComponent which we import on line 25
  // the component and rootElement are DISTINCT in COMPONENT TESTING
  let component: ContactEditComponent; // stores an instance of the ContactEditComponent
  // you can think of DebugElement as the HTMLElement with methods and properties that can be useful for debugging elements
  let rootElement: DebugElement; // stores the DebugElement for the component, which is how we access its children

  /* mock: simulates the real object, keeps track of when the object is called and the arguments it receives
  stub: simpler fake of the real object, no logic, always returns the same value

  Mock contactService: contactService makes http calls which would make the tests harder to run and non-deterministic
  we only want to really test ContactEditComponent, so we mock contactService */
  const contactServiceStub = {
    contact: {
      id: 1,
      name: 'janet'
    },

    save: async function (contact: Contact) { // sets the passed-in object to the component's contact property
      component.contact = contact;
    },

    getContact: async function () { // method that sets the current contact as the component's contact property and returns that contact
      component.contact = this.contact;
      return this.contact;
    },

    updateContact: async function (contact: Contact) { // method that updates the contact object
      component.contact = contact;
    }
  };

  // part 2 of component test: setup the TestBed

  // sets TestBed configuration. TestBed is a class that you use to setup and configure your tests.
    // use it any time you want to write a unit test that tests components, directives and services
  beforeEach(() => {
    TestBed.configureTestingModule({  // configure the test bed to be used in the tests
      // there are a lot more declarations and imports in COMPONENT TESTING, also additionally there are providers
      declarations: [ContactEditComponent, FavoriteIconDirective, InvalidEmailModalComponent, InvalidPhoneNumberModalComponent],
      imports: [
        AppMaterialModule,
        FormsModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      // this is where contactServiceStub is used instead of the real service
      providers: [{ provide: ContactService, useValue: contactServiceStub }]
    });

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      /* Distinct in COMPONENT TESTING:
         overrideModule is used to lazy load some components. Lazy load means dialogs won't be loaded until the user performs an action to
         currently, the only way to do this is to use overrideModule and set entryComponents value to an array that contains
         the two modal components that ContactEditComponent uses: InvalidEmailModalComponent and InvalidPhoneNumberModalComponent */
      set: {
        entryComponents: [InvalidEmailModalComponent, InvalidPhoneNumberModalComponent]
      }
    });
  });

  // part 3 of component test: initialize the variables

  beforeEach(() => {
    // fixture variable stores the component-like object from the TestBed.createComponent method
    fixture = TestBed.createComponent(ContactEditComponent);
    // component variable holds a component that you get from your fixture using the componentInstance property
    component = fixture.componentInstance;
    // detectChanges triggers a change detection cycle for the component. In Prod Angular uses Zones when to run change detection,
      // in unit tests we use detectChanges
    fixture.detectChanges();
    // this is distinct in COMPONENT TESTING because of DOM verification
    // you can think of DebugElement as the HTMLElement with methods and properties that can be useful for debugging elements
    rootElement = fixture.debugElement;
  });

  // saveContact() changes the component's state, which will be reflected in the DOM
  describe('saveContact() test', () => {
    // fakeAsync method is used to keep the tests from finishing until the component has finished updating
      // ensures that all asynchronous calls are completed within a test before the assertions are executed
    it('should display contact name after contact set', fakeAsync(() => {
      // create a contact object
      const contact = {
        id: 1,
        name: 'lorace'
      };

      // set isLoading false to hide progress bar, otherwise all that will render is the loading progress bar
      component.isLoading = false;
      // normally saveContact would use the real ContactService
        // but because you configured the testing module on line 80 to provide contactServiceStub, it will use the stub instead
      component.saveContact(contact); // save the contact object
      // after you make changes, you need to call detectChanges so that those changes are rendered in the DOM
      fixture.detectChanges();
      // query rootElement (defined at lines 38 & 107) by using by.css for the contact-name class
        // to get the input element that contains the contact name
      const nameInput = rootElement.query(By.css('.contact-name')); // gets the nameInput form field contact-name
      tick(); // simulate the passage of time
      // nativeElement object is an Angular wrapper around the built-in DOM native element
      expect(nameInput.nativeElement.value).toBe('lorace'); // check to see if the name property has been set correctly
    }));
  });

  describe('loadContact() test', () => {
    it('should load contact', fakeAsync(() => {
      component.isLoading = false;
      // here the only difference is that instead of saveContact, loadContact is used
      component.loadContact();
      fixture.detectChanges();
      const nameInput = rootElement.query(By.css('.contact-name'));
      tick();
      expect(nameInput.nativeElement.value).toBe('janet');  // assert that the default contact loaded has this value
    }));
  });

  describe('updateContact() tests', () => {
    it('should update the contact', fakeAsync(() => {
      // this time you set a contact and then update it
      const newContact = {
        id: 1,
        name: 'delia',
        email: 'delia@example.com',
        number: '1234567890'
      };

      component.contact = {
        id: 2,
        name: 'rhonda',
        email: 'rhonda@example.com',
        number: '1234567890'
      };

      // test the initial contact
      component.isLoading = false;
      fixture.detectChanges();
      const nameInput = rootElement.query(By.css('.contact-name'));
      tick();
      expect(nameInput.nativeElement.value).toBe('rhonda');

      // the major difference in this test is that it uses a 2nd assertion
      component.updateContact(newContact); // updates the existing contact to the newContact object
      fixture.detectChanges(); // trigger change detection
      tick(100);
      expect(nameInput.nativeElement.value).toBe('delia'); // check that the value in the nameInput form field has een changed
    }));

    // test what happens when you try to update the contact with invalid data
    it('should not update the contact if email is invalid', fakeAsync(() => {
      const newContact = {
        id: 1,
        name: 'london',
        email: 'london@example',
        number: '1234567890'
      };

      component.contact = {
        id: 2,
        name: 'chauncey',
        email: 'chauncey@example.com',
        number: '1234567890'
      };

      // initial check
      component.isLoading = false;
      fixture.detectChanges();
      const nameInput = rootElement.query(By.css('.contact-name'));
      tick();
      expect(nameInput.nativeElement.value).toBe('chauncey');

      // once updated we do not expect a change because the new contact object is not valid
      component.updateContact(newContact);
      fixture.detectChanges();
      tick(100);
      expect(nameInput.nativeElement.value).toBe('chauncey');
    }));

    it('should not update the contact if phone number is invalid', fakeAsync(() => {
      const newContact = {
        id: 1,
        name: 'london',
        email: 'london@example.com',
        number: '12345678901'
      };

      component.contact = {
        id: 2,
        name: 'chauncey',
        email: 'chauncey@example.com',
        number: '1234567890'
      };

      component.isLoading = false;
      fixture.detectChanges();
      const nameInput = rootElement.query(By.css('.contact-name'));
      tick();
      expect(nameInput.nativeElement.value).toBe('chauncey');

      // once updated we do not expect a change because the new contact object is not valid
      component.updateContact(newContact);
      fixture.detectChanges();
      tick(100);
      expect(nameInput.nativeElement.value).toBe('chauncey');
    }));
  });
});
