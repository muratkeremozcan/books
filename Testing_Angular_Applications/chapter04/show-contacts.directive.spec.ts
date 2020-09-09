import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowContactsDirective } from './show-contacts.directive';
import { getElement } from '../../testing';

// [4.2] testing structural directives (changes the structure of DOM)

// (same idea as 4.1.0) in the test, create a component that uses the structural directive, and an empty class to feed into the TestBed (4.2.0)
// (same as in [3.1]) setup the component with TestBed.configureTestingModule({..}) (satisfy the TS),
//  and create the component with TestBed.createComponent(..) before each test (4.1.1)
// (same as [3.3]) use fixture.detectChanges() to trigger the change

// (4.2.0) create any basic component that uses the directive
@Component({
  template: `
      <div *appShowContacts="true">
        <p>This is shown</p>
      </div>
      <div *appShowContacts="false">
        <p>This is hidden</p>
      </div>
    `
})

// (4.2.0) empty class to feed in to the TestBed
class TestComponent { }

describe('Directive: ShowContactsDirective', () => {
  let fixture: ComponentFixture<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowContactsDirective, TestComponent]
    })
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  it('should be displayed when the input evaluates to true.', () => {
    const element = getElement(fixture);
    expect(element.innerHTML).toContain('This is shown');
  });

  it('should be hidden when the input evaluates to false.', () => {
    const element = getElement(fixture);
    expect(element.innerHTML).not.toContain('This is hidden');
  });

  afterEach(() => { fixture = null; });
});
