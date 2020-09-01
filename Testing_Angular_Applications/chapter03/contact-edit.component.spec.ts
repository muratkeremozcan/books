// import dependencies

// (3.0) Testing dependencies that come from Angular
// DebugElement is used to inspect elements
// ComponentFixture: use it to create a fixture that you then can use for debugging.
// fakeAsync: ensure asssertions run async at the end
// tick: When using fakeAsync, you can use tick to simulate the passage of time
// TestBed: setup and config for all unit testing
// By: to select DOM elements.  By.css, By.all By.directive
// NoopAnimationsModule: skip animations in the unit testsgg
// BrowserDynamicTestingModule: readies the browser for unit testing
// RouterTestingModule: to test routing
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';

// (3.1) Dependencies that are included with Angular (the component uses forms with mat-form in the template)
import { FormsModule } from '@angular/forms';

// (3.1) Dependencies that you created for this project (from the TS and Template)
import { Contact, ContactService, FavoriteIconDirective, InvalidEmailModalComponent, InvalidPhoneNumberModalComponent } from '../shared';
import { AppMaterialModule } from '../../app.material.module';
import { ContactEditComponent } from './contact-edit.component';

import '../../../material-app-theme.scss';

// [3] unit test at a high level
// setup the component with TestBed.configureTestingModule({..}) (satisfy the TS), and create the component with TestBed.createComponent(..) before each test (3.1)
// test/access the TS with fixture.componentInstance / fixture.debugElement.componentInstance (3.2)
// test/access the template with fixture.debugElement.nativeElement/ fixture.debugElement (3.4), using fixture.detectChanges() to trigger the change (3.3)
// setup the services:
// stub the external services that you are not fully mocking (create a class or object for the parts you need) (3.5)
// setup the service in providers (3.6);   providers: [regularService, {provide: anotherService, useValue: stubOfAnotherService}]
//  inject the service in the test if it's a real service (3.7)  ( service = TestBed.inject(regularService);  )

describe('ContactEditComponent tests', () => {
  let fixture: ComponentFixture<ContactEditComponent>;
  let component: ContactEditComponent;
  let app: DebugElement;

  // (3.5) stub the external services that you are not fully using (create a class or object for the parts you need)
  // we want this because we do not want real http happening during the test
  const contactServiceStub = {
    contact: {
      id: 1,
      name: 'janet'
    },
    // the component has 3 public methods we are interested in testing. They all use the ContactService
    // the service has save, getContact, updateContact functions, which at the end get the same result as these stubs

    save: async function (contact: Contact) {
      component.contact = contact;
    },

    getContact: async function () {
      component.contact = this.contact;
      return this.contact;
    },

    updateContact: async function (contact: Contact) {
      component.contact = contact;
    }
  };

  beforeEach(() => {
    // (3.1) setup the component with TestBed.configureTestingModule({..})
    TestBed.configureTestingModule({
      declarations: [ContactEditComponent, FavoriteIconDirective, InvalidEmailModalComponent, InvalidPhoneNumberModalComponent],
      imports: [
        AppMaterialModule,
        FormsModule,
        NoopAnimationsModule,
        RouterTestingModule
      ],
      // (3.6) setup the service in providers (3.6);   providers: [regularService, {provide: anotherService, useValue: stubOfAnotherService}]
      providers: [{provide: ContactService, useValue: contactServiceStub}]
    });

    // if you were using a real service, this is where you would incject it   service = TestBed.inject(anotherService);

    // use TestBed.overrideModule when there are lazyloaded components
    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [InvalidEmailModalComponent, InvalidPhoneNumberModalComponent]
      }
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactEditComponent); // (3.1) TestBed.createComponent(): returns a ComponentFixture object which gives access to the TS & the template
    component = fixture.componentInstance; // (3.2) fixture.componentInstance gives access to the TS (also seen fixture.debugElement.componentInstance)
    fixture.detectChanges(); // (3.3) fixture.detectChanges() to trigger the change, because unit test don't have access to Angular's change detection.
    // / (3.4) fixture.debugElement: gives access to the template. Used in conjunction with fixture.detectChanges() (also seen fixture.debugElement.nativeElement)
    app = fixture.debugElement;
  });

  describe('saveContact() test', () => {
    it('should display contact name after contact set', fakeAsync(() => {
      const contact = {
        id: 1,
        name: 'lorace'
      };

      component.isLoading = false; // related to the template; to disable the loading bar setting it to false
      component.saveContact(contact); // the service being used by saveContact() method is stubbed, so we get the stubbed result at the TS
      fixture.detectChanges();
      const nameInput = app.query(By.css('.contact-name')); // setup the selector
      tick();  // call tick to simulate the passage of time so that the component updates
      expect(nameInput.nativeElement.value).toBe('lorace');
    }));
  });

  describe('loadContact() test', () => {
    it('should load contact', fakeAsync(() => {
      component.isLoading = false;
      component.loadContact();
      fixture.detectChanges();
      const nameInput = app.query(By.css('.contact-name'));
      tick();
      expect(nameInput.nativeElement.value).toBe('janet');
    }));
  });

  describe('updateContact() tests', () => {
    it('should update the contact', fakeAsync(() => {
      component.contact = {
        id: 2,
        name: 'rhonda',
        email: 'rhonda@example.com',
        number: '1234567890'
      };

      component.isLoading = false;
      fixture.detectChanges();
      const nameInput = app.query(By.css('.contact-name'));
      tick();
      expect(nameInput.nativeElement.value).toBe('rhonda');

      const newContact = {
        id: 1,
        name: 'delia',
        email: 'delia@example.com',
        number: '1234567890'
      };

      component.updateContact(newContact);
      fixture.detectChanges();
      tick(100);
      expect(nameInput.nativeElement.value).toBe('delia');
    }));

    it('should not update the contact if email is invalid', fakeAsync(() => {
      component.contact = {
        id: 2,
        name: 'chauncey',
        email: 'chauncey@example.com',
        number: '1234567890'
      };

      component.isLoading = false;
      fixture.detectChanges();
      const nameInput = app.query(By.css('.contact-name'));
      tick();
      expect(nameInput.nativeElement.value).toBe('chauncey');

      const newContact = {
        id: 1,
        name: 'london',
        email: 'london@example',
        number: '1234567890'
      };

      component.updateContact(newContact);
      fixture.detectChanges();
      tick(100);
      expect(nameInput.nativeElement.value).toBe('chauncey');
    }));

    it('should not update the contact if phone number is invalid', fakeAsync(() => {

      component.contact = {
        id: 2,
        name: 'chauncey',
        email: 'chauncey@example.com',
        number: '1234567890'
      };

      component.isLoading = false;
      fixture.detectChanges();
      const nameInput = app.query(By.css('.contact-name'));
      tick();
      expect(nameInput.nativeElement.value).toBe('chauncey');

      const newContact = {
        id: 1,
        name: 'london',
        email: 'london@example.com',
        number: '12345678901'
      };

      component.updateContact(newContact);
      fixture.detectChanges();
      tick(100);
      expect(nameInput.nativeElement.value).toBe('chauncey');
    }));
  });
});
