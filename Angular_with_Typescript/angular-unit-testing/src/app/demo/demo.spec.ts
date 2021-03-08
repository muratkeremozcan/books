import {
  DemoModule,
  BankAccountComponent, BankAccountParentComponent,
  LightswitchComponent,
  Child1Component, Child2Component, Child3Component,
  MasterService,
  ValueService,
  ExternalTemplateComponent,
  InputComponent,
  IoComponent, IoParentComponent,
  MyIfComponent, MyIfChildComponent, MyIfParentComponent,
  NeedsContentComponent, ParentComponent,
  TestProvidersComponent, TestViewProvidersComponent,
  ReversePipeComponent, ShellComponent
} from './demo';
import { By } from '@angular/platform-browser';
import { Component,
         DebugElement,
         Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';
// Forms symbols imported only for a specific test below
import { NgModel, NgControl } from '@angular/forms';
import {
  ComponentFixture, fakeAsync, inject, TestBed, tick, waitForAsync
} from '@angular/core/testing';

// [2] testing services:
// (2.1) setup the service and satisfy the TS with TestBed.configureTestingModule({..})
// (2.2) KEY inject the service in the test

/*
The TestBed creates a dynamically-constructed Angular test module that emulates an Angular @NgModule.
We use the TestBed to provide and create services

in Angular apps you use the provider’s token in the class constructor to inject a service,
in tests, the injection is done differently;  use the TestBed.inject() method in the setup to inject the service
*/

describe('demo with TestBed', () => {
  // (2.1) setup the service
  let service: ValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValueService] // the service still has to be in providers
    });
    // (2.2) inject the service to the setup
    service = TestBed.inject(ValueService);
  });

  it('should test sanity', () => {
    expect(service).toBeTruthy();
  });
  it('should use ValueService getValue()', () => {
    expect(service.getValue()).toBe('real value');
  });
  it('test should wait for ValueService.getPromiseValue', waitForAsync(() => {
    service.getPromiseValue().then(value =>
      expect(value).toBe('promise value')
    );
  }));



});
