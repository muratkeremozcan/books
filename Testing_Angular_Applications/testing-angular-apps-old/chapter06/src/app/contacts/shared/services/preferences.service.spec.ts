// listing 6.1 6.2 6.3 6.4 6.5 6.6
/* SERVICES
Services are the part of your application that do not generally interact with the UI.
  They allow you to write non-UI code that's modular, reusable and testable
  They are singletons; you write them once and can use them anywhere in the application
Angular services implement the @Injectable class decorator, which adds metadata that Angular uses for resolving dependencies
Angular uses the class itself to create a provider token that other components will use for defining provider dependencies
A Service is instantiated only once. Components that define that service as a dependency will share that instance,
  which allows for services to act as brokers for sharing data between components and saves memory use

DEPENDENCY INJECTION is a system that supplies instances of a dependency at the time your class is instantiated:
  you don't need the service to import and instantiate a dependency, the dependency injection system does it for you.
When the constructor of your service executes, it will receive an instance of a dependency that the dependency injection system already created.
  The service will use the injected code instead of the imported class

A DECORATOR is a Typescript feature that adds some properties or behavior to a class or method
@Injectable is the Angular decorator for Services: marks the service as a class that can serve as a provider for Angular's dependency injection system.
*/


import { TestBed, inject } from '@angular/core/testing';
import { PreferencesService } from './preferences.service';
import { BrowserStorage } from "./browser-storage.service";

import { logging } from "selenium-webdriver";
import Preferences = logging.Preferences;

// create BrowserStorageMock
class BrowserStorageMock {
  getItem = (property: string) => ({ key: 'testProp', value: 'testValue ' });
  setItem = ({ key: key, value: value }) => { };
}

describe('PreferencesService', () => {

  beforeEach(() => {
    // TestBed is configured with PreferencesService before every test
      // BrowserStorageMock is used instead of the real service BrowserStorage
      // By using the token from BrowserStorage and supplying the same methods, you can use your mock for unit testing instead of relying on the real implementation
      // You only need to configure TestBed to use BrowserStorageMock whenever a service calls for BrowserStorage as a dependency
    TestBed.configureTestingModule({
      providers: [PreferencesService, {
        provide: BrowserStorage, useClass: BrowserStorageMock
      }]
    });

  });

  // check that the service is setup right
  it('should create the Preferences Service', inject([PreferencesService],
    (service: PreferencesService) => {
    expect(service).toBeTruthy();
  }));

  describe('save preferences', () => {

    // uses inject to get BrowserStorageMock
    it('should save a preference', inject([PreferencesService, BrowserStorage],
      (service: PreferencesService, browserStorage: BrowserStorageMock) => {

        // add a spy to browserStorage.setItem
        spyOn(browserStorage, 'setItem').and.callThrough();
        service.saveProperty({ key: 'myProperty', value: 'myValue' });

        //checks the spy to make sure it was called saveProperty()
        expect(browserStorage.setItem).toHaveBeenCalledWith('myProperty', 'myValue');
      })
    );

    it('saveProperty should require a non-zero length key', inject([PreferencesService],
      (service: PreferencesService) => {

        // creates a wrapper for any function that's supposed to throw an error
        const throws = () => service.saveProperty({ key: '', value: 'foo' });
        expect(throws).toThrowError();
      })
    );
  });

  describe('get preferences', () => {

    it(`has a 'saveProperty' method`, inject([PreferencesService, BrowserStorage],
      (service: PreferencesService, browserStorage: BrowserStorageMock) => {

        expect(service.getProperty).toBeDefined();
      })
    );

    it(`returns a ContactPreference`, inject([PreferencesService, BrowserStorage],
      (service: PreferencesService, browserStorage: BrowserStorageMock) => {

        // add a spy to browserStorage.getItem
        spyOn(browserStorage, 'getItem').and.returnValue({ key: 'pref', value: 'myValue' });

        const prefs = service.getProperty('getItem');
        expect(prefs.key).toEqual('pref');
        expect(prefs.value).toEqual('myValue');

      })
    );

  });
});
