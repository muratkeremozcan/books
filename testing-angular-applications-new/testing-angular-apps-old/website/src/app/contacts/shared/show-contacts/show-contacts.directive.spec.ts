// STRUCTURAL DIRECTIVE listing 4.2
// structural directive adds or removes elements from the DOM

// import Angular dependencies
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
// import dependencies for contacts directive
import { ShowContactsDirective } from './show-contacts.directive';
import { getElement } from '../../testing';

// to test a structural directive (adds or removes elements from the DOM, ex: ngIf, ngShow) you need a host component that uses it
// each div is for a test case
@Component({
  // appShowContacts is the name used in the template for ShowContactsDirective, think of it like an alias
  // what is the asterisk *? The asterisk transforms the DOM element the directive is attached to into a template
  // the directive then controls how that template is rendered to the DOM, which is how it can alter the structure of the page
  template: `
    <div *appShowContacts="true">
      <p>This is shown</p>
    </div>
    <div *appShowContacts="false">
      <p>This is hidden</p>
    </div>
  `
})
class TestComponent { }

describe('Directive: ShowContactsDirective', () => {
  // part 1: declare the fixture variable
  // fixture: stores an instance of the ComponentFixture, which contains methods that help debug and test a component
  let fixture: ComponentFixture<any>;

  beforeEach(() => {
    // part 2 & 3: setup the TestBed and initialize the fixture variable
    // TestBed is a class that you use to setup and configure your tests
    // use it any time you want to write a unit test that tests components, directives and services
    // configureTestingModule configures the TestBed, we use declarations to specify how the TestBed is to be configured
    // createComponent is used to return an instance of ComponentFixture
    fixture = TestBed.configureTestingModule({
      declarations: [ShowContactsDirective, TestComponent]
    }).createComponent(TestComponent);
    // detectChanges: invoke change detection in unit tests and render updated data whenever an event occurs
    fixture.detectChanges();
  });
  // cleanup
  afterEach(() => { fixture = null; });

  // every test will follow this pattern
    // set the initial state of an element
    // perform an action
    // check that the expected change occurs

  it('should be displayed when the input evaluates to true', () => {
    // check to see if an element is rendered if the input is set to true. Will pass because line 17 is set to true
    const element = getElement(fixture);
    expect(element.innerText).toContain('This is shown');
  });

  it('should be hidden when the input evaluates to false', () => {
    // check to see content from the second div (line 19) does not show in the rendered HTML
    const element = getElement(fixture);
    expect(element.innerText).not.toContain('This is hidden');
  });

});

// Summary
// Angular has 3 types of directives. They all encapsulate re-usable functionality
//   * components: they have a view, directives do not
//   * attribute directives: changes the appearance of a DOM element, ex: background color when a user rolls over a row
//   * structural directives: adds or removes elements from the DOM, ex: ngIf, ngShow

// configureTestingModule method takes in an object which uses the TestModuleMetadata interface
//   * either create a variable that sets the type to TestModuleMetadata, then pass the variable into configureTestModule
//   * or create an object with the relevant configuration data, then pass that into configureTestModule}
