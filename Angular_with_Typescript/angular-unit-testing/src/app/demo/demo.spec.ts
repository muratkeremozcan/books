import {
  DemoModule,
  BankAccountComponent,
  BankAccountParentComponent,
  LightswitchComponent,
  Child1Component,
  Child2Component,
  Child3Component,
  MasterService,
  ValueService,
  ExternalTemplateComponent,
  InputComponent,
  IoComponent,
  IoParentComponent,
  MyIfComponent,
  MyIfChildComponent,
  MyIfParentComponent,
  NeedsContentComponent,
  ParentComponent,
  TestProvidersComponent,
  TestViewProvidersComponent,
  ReversePipeComponent,
  ShellComponent,
} from './demo';
import { By } from '@angular/platform-browser';
import { Component, DebugElement, Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';
// Forms symbols imported only for a specific test below
import { NgModel, NgControl } from '@angular/forms';
import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';

// [2] testing services:
// (2.1) setup the service and satisfy the TS with TestBed.configureTestingModule({..})
// (2.2) inject the service in the test
// (2.3) use waitForAsync() or fakeAsync() pattern for testing promises or observables
// (2.4) When testing a service with a dependency, provide the mock in the providers array.

/*
The TestBed creates a dynamically-constructed Angular test module that emulates an Angular @NgModule.
We use the TestBed to provide and create services

in Angular apps you use the provider’s token in the class constructor to inject a service,
in tests, the injection is done differently;  use the TestBed.inject() method in the setup to inject the service
*/

describe('Testing 1 service (no dependencies)', () => {
  // (2.1) setup the service
  let service: ValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValueService], // the service still has to be in providers
    });
    // (2.2) inject the service to the setup
    service = TestBed.inject(ValueService);
  });

  it('sanity', () => {
    expect(service).toBeTruthy();
  });

  it('synchronous: should use ValueService getValue()', () => {
    expect(service.getValue()).toBe('real value');
  });

  // (2.3) use waitForAsync() or fakeAsync() pattern for testing promises or observables
  describe('asynchronous functions such as promises & observables', () => {
    describe('waitForAsync()', () => {
      it(
        'waitForAsync() : ValueService.getPromiseValue',
        waitForAsync(() => {
          service
            .getPromiseValue()
            .then((value) => expect(value).toBe('promise value'));
        })
      );

      it(
        'waitForAsync() : ValueService.getObservableValue',
        waitForAsync(() => {
          service
            .getObservableValue()
            .subscribe((value) => expect(value).toBe('observable value'));
        })
      );

      it(
        'waitForAsync() : ValueService.getObservableDelayValue',
        waitForAsync(() => {
          service
            .getObservableDelayValue()
            .subscribe((value) => expect(value).toBe('observable delay value'));
        })
      );
    });

    describe('fakeAsync()', () => {

      it('fakeAsync() : Value.getPromiseValue ', fakeAsync(() => {
        let value: any;
        service.getPromiseValue().then((val) => (value = val));
        tick(); // Trigger JS engine cycle until all promises resolve.
        expect(value).toBe('promise value');
      }));

      it('fakeAsync() : Value.getObservableValue. KEY: using tick() for control ', fakeAsync(() => {
        let value: any;
        service.getObservableValue().subscribe((val) => (value = val));
        tick(); // Trigger JS engine cycle until all promises resolve.
        expect(value).toBe('observable value');
      }));

      it('fakeAsync() : Value.getObservableDelayValue. KEY: tick(ms) by the delay amount ', fakeAsync(() => {
        let value: any;
        service.getObservableDelayValue().subscribe((val) => (value = val));
        tick(10); // Trigger JS engine cycle until all promises resolve.
        expect(value).toBe('observable delay value');
      }));
    });

    it('done() : Almost never use done() over fakeAsync() or waitForAsync()  . ValueService.getObservableDelayValue', (done: DoneFn) => {
      service.getObservableDelayValue().subscribe((value) => {
        expect(value).toBe('observable delay value');
        done();
      });
    });

  });
});


describe('Testing a service with a dependency on another service', () => {
  // (2.4) When testing a service with a dependency, provide the mock in the providers array.

});
