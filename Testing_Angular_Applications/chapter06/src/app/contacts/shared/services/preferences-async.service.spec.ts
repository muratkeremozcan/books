import { TestBed, fakeAsync, flushMicrotasks, inject } from '@angular/core/testing';

import { BrowserStorageAsync } from './browser-storage.service';
import { PreferencesAsyncService } from './preferences-async.service';

// [6] async service testing: the only difference is using fakeAsync(..) and flushMicrotasks()

// (6.1) [3.6] setup the service in providers: [yourService, {provide: anotherService, useValue/useClass: stubOfAnotherService}]
// (6.2) inject the service in the test [3.7]  ( service = TestBed.inject(yourService);  )
// (6.3) [3.5] KEY stub/mock the external services that that your service depends on (create a class or object for the parts you need)
// (6.4) identify what methods of your service invokes other services, and use spyOn(externalService, 'extSrvMethod').and.callThrough() or returnValue(..)
// to test the effect of your service under test, on external services



// (6.3) [3.5] KEY stub/mock the external services that that your service depends on (create a class or object for the parts you need)
class BrowserStorageAsyncMock {
  getItem = (property: string) => Promise.resolve({key: 'testProp', value: 'testValue'});
  setItem = ({key: key, value: value}) => Promise.resolve(true);
}

describe('PreferencesAsyncService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
       // (6.1) setup the service in providers ;   providers: [yourService, {provide: anotherService, useValue/useClass: stubOfAnotherService}]
      providers: [PreferencesAsyncService, {
        provide: BrowserStorageAsync, useClass: BrowserStorageAsyncMock
      }]
    });
    // (6.2) in recent versions of Angular, you can inject the service to the setup instead of each test (better option, much shorter syntax)
    // service = TestBed.inject(PreferencesService, BrowserStorage);
  });

  it('should get a value', fakeAsync(inject([PreferencesAsyncService, BrowserStorageAsync],
    (service: PreferencesAsyncService, browserStorage: BrowserStorageAsyncMock) => {
      // (6.4) identify what methods of your service invokes other services, and use spyOn(externalService, 'extSrvMethod').and.callThrough() or returnValue(..)
      spyOn(browserStorage, 'getItem').and.callThrough();

      let results, error;

      service.getPropertyAsync('testProp')
        .then(val => results = val)
        .catch(err => error = err);

      // when testing asynchronous services, use flushMicrotasks()
      flushMicrotasks();

      // test the positive branch results and the argument
      expect(results.key).toEqual('testProp');
      expect(results.value).toEqual('testValue');
      expect(browserStorage.getItem).toHaveBeenCalledWith('testProp');
      expect(error).toBeUndefined();
    }))
  );

it('should throw an error if the key is missing', fakeAsync(inject([PreferencesAsyncService],
  (service: PreferencesAsyncService) => {

    let result, error;
    service.getPropertyAsync('')
      .then(value => result = value)
      .catch((err) => error = err);

    flushMicrotasks();
    expect(result).toBeUndefined();
    expect(error).toEqual('getPropertyAsync requires a property name');

  }))
);

});
