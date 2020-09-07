import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ContactService } from './contact.service';

// [6] testing Http and mocking external core services like Http

// to setup create an httpMock with the help of HttpTestingController from HttpClientTestingModule (6.1)
// test the TS function making the http call, using httpMock.expectOne, (6.2)
// use .flush to send the data to the client and .error to emulate error (6.3)



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
      // (6.1.3) mock http using  HttpTestingController
      // (service injection similar to other external services, the key difference was the module being imported)
      // (HttpTestingController doesn’t make an HTTP request but allows you to emulate it using hardcoded data.)
      // with spectator just put it under mocks array under createServiceFactory
      httpMock = TestBed.get(HttpTestingController);
    });

    it('should GET a list of contacts', () => {
      const mockContact = { id: 100, name: 'Erin Dee', email: 'edee@example.com' };
      // (6.2.2) subscribe to the response & assert
      contactService.getContacts().subscribe((contacts) => {
        expect(contacts[0]).toEqual(mockContact);
      });

      const request = httpMock.expectOne('app/contacts');

      request.flush([mockContact]);

      httpMock.verify();
    });
  });
});
