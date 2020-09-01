// listing 7.6 7.7. 7.8 7.9

import { Component, OnInit, DebugElement } from '@angular/core';
import { Location } from '@angular/common';
import { By } from '@angular/platform-browser';
import { TestBed, inject, async } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from 'rxjs';

// 1: testing routes from the point of view of a component
// deep linking is the ability to link any website content to a route. In Angular this is done through route parameters
  // the router makes these route parameters available to components through ActivatedRoute service

// load the contact id from the ActivatedRoute service and use it in the template
@Component({
  selector: 'contact-edit',
  template: `<div class="contact-id"> {{ contactId }}</div>`,
})
class ContactEditComponent implements OnInit {
  private contactId: number;
  // inject the activatedRoute service during construction
  // Angular components can receive route information from the ActivatedRoute service
  constructor(private activatedRoute: ActivatedRoute) { }
  ngOnInit() {
    // assign the contactId on initialization
    this.activatedRoute.params.subscribe(({ id }) => {
      this.contactId = id;
    });
  }
}

// Components can subscribe to the values that ActivatedRoute publishes as an observable or snapshot
  // snapshot: an object holding the last updated values for all route parameters
  // using a snapshot is a good choice if a component only needs to use route parameters when it's constructed
  // subscribing to an observable is a good choice for a component that updates regularly (we are using this in this example)
describe('Testing activated routes', () => {
  // activatedRoute listens for data and then renders it in the template
    // the only mock required is a mock for activatedRoute. TestBed provides the mock value to the component
    // RouterTestingModule is not required because no navigation is occurring
    // the mock is the snapshot that ActivatedRoute would generate as part of a route event
  let fixture;
  const mockActivatedRoute = {
    snapshot: {
      params: {
        id: 'aMockId'
      }
    }
  };
  // if your component uses properties of ActivatedRoute that emit observables, then the mock is an observable emitting mocked properties
  const paramsMock = Observable.create((observer) => {
    observer.next({
      id: 'aMockId'
    });
    observer.complete();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      // inject the paramsMock as the value for activatedRoute
      providers: [{ provide: ActivatedRoute, useValue: { params: paramsMock }}],
      declarations: [ContactEditComponent],
    });
  });

  beforeEach( async(() => {
    // TestBed asynchronously initializes the TestBed fixture with the component under test
    fixture = TestBed.createComponent(ContactEditComponent);
    fixture.detectChanges();
  }));

  // when the router resolves a navigation event, activatedRoute produces a snapshot of the route data associated with the component
    // the test involves initializing the component and checking the result. When the component's ngOnInit method is activated,
    // the TestBed returns the mock snapshot for ActivatedRoute
  // the test is wrapped in the async helper because it is waiting for the component to initialize
  it('tries to route to a page', async(() => {
    const testEl = fixture.debugElement.query(By.css('div')); // reference to the DOM node where ContactId should be rendered
    // console.log('testEl', testEl);
    // verify the template is rendered with the contactId from ActivatedRoute
    expect(testEl.nativeElement.textContent).toEqual(' aMockId');
  }));

});
