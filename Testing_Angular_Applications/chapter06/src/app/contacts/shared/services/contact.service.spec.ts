import { TestBed } from '@angular/core/testing';
// HttpClientTestingModule removes the need for manually blocking calls from HttpClient trying to reach a server
// HttpTestingController lets you interact with its testing module to verify that calls are being attempted and to supply canned responses
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'; // (6.1.1) imports
import { ContactService } from './contact.service';

// [6] testing Http and mocking external core services like Http (exact same as the example in the Angular book product.service.spec.ts)

// to setup create an httpMock with the help of HttpTestingController from HttpClientTestingModule (6.1)
// setup the expected response using httpMock.expectOne, (6.2)
// use .flush to propagate the response and .error to emulate error (6.3)

describe('ContactsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ], // (6.1.2) HttpClientTestingModule in imports
      providers: [ ContactService ]
    });
  });

  describe('getContacts', () => {

    let contactService: ContactService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
      contactService = TestBed.get(ContactService);
      // (6.1.3) to setup create an httpMock with the help of HttpTestingController from HttpClientTestingModule
      // (HttpTestingController doesn’t make an HTTP request but allows you to emulate it using hardcoded data.)
      httpMock = TestBed.get(HttpTestingController);
    });

    it('should GET a list of contacts', () => {
      // (6.2.1) prepare canned response
      const mockContact = { id: 100, name: 'Erin Dee', email: 'edee@example.com' };
      // (6.2.2) setup the subscription to expect the canned response
      contactService.getContacts().subscribe((contacts) => {
        expect(contacts[0]).toEqual(mockContact);
      });

      // setup the expected response using httpMock.expectOne (6.2.3)
      const request = httpMock.expectOne('app/contacts');
      // (6.3) use .flush to propagate the response
      request.flush([mockContact]);

      // verify() is used to assert that there are no outstanding http requests
      httpMock.verify();
    });
  });
});
