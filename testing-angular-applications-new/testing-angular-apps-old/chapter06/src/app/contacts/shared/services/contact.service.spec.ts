// listing 6.13 Services

import { TestBed } from '@angular/core/testing';
// HttpClientTestingModule removes the need for manually blocking calls from HttpClient trying to reach a server
  // HttpTestingController lets you interact with its testing module to verify that calls are being attempted and to supply canned responses
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ContactService } from './contact.service';

// for tests involving HttpClient the asynchronous observable behavior is simulated without you having to add anything to your tests

describe('ContactsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ], // configure TestBed to use HttpClientTestingModule
      providers: [ ContactService ]
    });
  });

  describe('getContacts', () => {

    let contactService: ContactService;
    let httpTestingController: HttpTestingController;
    let mockContact: any;

    beforeEach(() => {
      contactService = TestBed.get(ContactService);
      // assign a reference to the HttpTestingController for interacting with the HttpClientTestingModule
      httpTestingController = TestBed.get(HttpTestingController);
      mockContact = { id: 100, name: 'Erin Dee', email: 'edee@example.com' };
    });

    it('should GET a list of contacts', () => {
      // with OBSERVABLES instead of then, you use subscribe. Observable callbacks are called whenever new values are emitted from an observable
        // on the other hand, promises are only resolved once
      // exercise the getContacts service method that makes a call to the server, which emits an observable later
      contactService.getContacts().subscribe((contacts) => {
        expect(contacts[0]).toEqual(mockContact);
      });

      const request = httpTestingController.expectOne('app/contacts');

      // causes the observable in #C to run
      request.flush([mockContact]);

      // verifies there are no  outstanding requests
      httpTestingController.verify();
    });
  });
});
