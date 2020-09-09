import { TestBed, inject } from '@angular/core/testing';
import { PreferencesService } from './preferences.service';
import { BrowserStorage } from './browser-storage.service';

// [6] testing services:

// (6.1) [3.6] setup the service in providers: [yourService, {provide: anotherService, useValue/useClass: stubOfAnotherService}]
// (6.2) inject the service in the test [3.7]  ( service = TestBed.inject(yourService);  )
// (6.3) [3.5] KEY stub/mock the external services that that your service depends on (create a class or object for the parts you need)
// (6.4) identify what methods of your service invokes other services, and use spyOn(externalService, 'extSrvMethod').and.callThrough() or returnValue(..)
// to test the effect of your service under test, on external services
// (6.5) test error conditions using toThrowError() : expect(functionThatCallsTheErrThrowingFunction).toThrowError()


/*
  in Angular apps you use the provider’s token in the class constructor to inject a service,
  in tests, the injection is done differently;
  - you explicitly invoke the inject() function in the tests (shown here)
  - or use TestBed.inject() method in the setup (much better since no duplication, but only available in recent Angular) (6.2)
*/


// for this test, we are saying the service will store the preferences somewhere
// so we make a dumb mock of browser-storage.service which has the same function names and signatures
// in this pattern, we finish the combination with spyOn

// (6.3) stub the external services (create a class or object for the parts you need)
// note: why do we use a class or object instead of an interface?
// In JS there is no Interface, and we need Angular to resolve service dependencies by using a token - only possible with classes or objects
class BrowserStorageMock {
  getItem = (property: string) => ({ key: 'testProp', value: 'testValue '});
  setItem = ({ key: key, value: value }) => {};
}

describe('PreferencesService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      // (6.1) setup the service in providers ;   providers: [yourService, {provide: anotherService, useValue/useClass: stubOfAnotherService}]
      providers: [PreferencesService, {
        provide: BrowserStorage, useClass: BrowserStorageMock
      }]
    });

    // (6.2) in recent versions of Angular, you can inject the service to the setup instead of each test (better option, much shorter syntax)
    // service = TestBed.inject(PreferencesService, BrowserStorage);
  });

  it('should create the Preferences Service', inject([PreferencesService], (service: PreferencesService) => {
    expect(service).toBeTruthy();
  }));

  describe('save preferences', () => {

    it('should save a preference', inject([PreferencesService, BrowserStorage],
      (service: PreferencesService, browserStorage: BrowserStorageMock) => {

        // (6.4) identify what methods of your service invokes other services, and use spyOn(externalService, 'extSrvMethod').and.callThrough()
        // KEY test the effect of your service under test, on external services (saveProperty invokes setItem, getProperty invokes.getItem)
        spyOn(browserStorage, 'setItem').and.callThrough();
        service.saveProperty({ key: 'myProperty', value: 'myValue' });
        expect(browserStorage.setItem).toHaveBeenCalledWith('myProperty', 'myValue');
      })
    );

    it('saveProperty should require a non-zero length key', inject([PreferencesService],
      (service: PreferencesService) => {

        // (6.5) test error conditions using toThrowError() : expect(functionThatCallsTheErrThrowingFunction).toThrowError
        // the test needs to define a function that itself calls the function that throws the error
        const throws = () =>  service.saveProperty({ key: '', value: '' });

        expect(throws).toThrowError();
      })
    );
  });

  describe('get preferences', () => {

    it(`has a 'saveProperty' method`, inject([PreferencesService, BrowserStorage],
      (service: PreferencesService, browserStorage: BrowserStorageMock ) => {

        expect(service.getProperty).toBeDefined();
      })
    );

    it(`returns a ContactPreference`, inject([PreferencesService, BrowserStorage],
      (service: PreferencesService, browserStorage: BrowserStorageMock) => {

        // (6.4) identify what methods of your services invokes other services, and suse spyOn(externalService, 'extSrvMethod').and.returnValue(...)
        spyOn(browserStorage, 'getItem').and.returnValue({ key : 'myPref', value: 'myValue' });

        const prefs = service.getProperty('anyString');

        expect(prefs.key).toEqual('myPref');
        expect(prefs.value).toEqual('myValue');

      })
    );

  });
});
