// listing 6.11 6.12
// import asynchronous testing methods
import { TestBed, fakeAsync, flushMicrotasks, inject } from '@angular/core/testing';

import { BrowserStorageAsync } from "./browser-storage.service";
import { PreferencesAsyncService } from './preferences-async.service';

// when testing async services, the mocks for these services also have to be asynchronous
class BrowserStorageAsyncMock {
  getItem = (property: string) => Promise.resolve({ key: 'testKey', value: 'testValue' });
  setItem = ({ key: key, value: value }) => Promise.resolve(true);
}

describe('PreferencesAsyncService', () => {
  // TestBed is configured with PreferencesAsyncService before every test
     // BrowserStorageAsyncMock is used instead of the real service BrowserStorage
     // By using the token from BrowserStorage and supplying the same methods, you can use your mock for unit testing instead of relying on the real implementation
     // You only need to configure TestBed to use BrowserStorageAsyncMock whenever a service calls for BrowserStorage as a dependency
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PreferencesAsyncService, {
        provide: BrowserStorageAsync, useClass: BrowserStorageAsyncMock
      }]
    });
  });


  it('should get a value', fakeAsync(inject([PreferencesAsyncService, BrowserStorageAsync],
    (service: PreferencesAsyncService, browserStorage: BrowserStorageAsyncMock) => {
      // fakeasync test helper reduces the amount of boilerplate code and makes it easy to inject to provide instances
      // add a spy to browserStorage.getItem
      spyOn(browserStorage, 'getItem').and.callThrough();

      let results, error;

      // call getPropertyAsync method from preferences-async-service and save the results to results and error
        // getPropertyAsync triggers BrowserStorageAsyncMock.getItem, which takes property 'testProp',
        // returns key 'testKey and returns value 'testValue
      service.getPropertyAsync('testProp')
        .then(val => results = val)  // uses the BrowserStorageAsyncMock default return value
        .catch(err => error = err);  // catches the expected error and assigns it locally

      // you need to call flushMicrotasks to let Angular know that it's time to process promises in the test
        // this is a testing-only helper method to make it easier to test asynchronous services
        // with fakeAsync you do not need to use done() method at the end of an async test
        // you can use done, async await or fakeAsync, Angular team seems to prefer fakeAsync
      flushMicrotasks();

      expect(browserStorage.getItem).toHaveBeenCalledWith('testProp');
      expect(results.key).toEqual('testKey');
      expect(results.value).toEqual('testValue');
      expect(error).toBeUndefined(); // ensures error value wasn't assigned
    }))
  );

  it('should throw an error if the key is missing', fakeAsync(inject([PreferencesAsyncService],
    (service: PreferencesAsyncService) => {

      let result, error;
      service.getPropertyAsync('') // call getPropertyAsync with an invalid value
        .then(value => result = value) // uses the BrowserStorageAsyncMock default return value
        .catch((err) => error = err); // catches the expected error and assigns it locally
      // when something goes wrong calling a promise, the catch methods handles the error

      flushMicrotasks();
      expect(result).toBeUndefined();
      expect(error).toEqual('getPropertyAsync requires a property name');

    }))
  );

});
