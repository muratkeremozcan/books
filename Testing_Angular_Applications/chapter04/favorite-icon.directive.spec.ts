import { Component } from '@angular/core';
import { ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';

import { constants } from './favorite-icon.constants';
import { FavoriteIconDirective } from './favorite-icon.directive';
import { getStarElement, doClassesMatch } from '../../testing';


// [4.1] testing an attribute directives (changes appearance of DOM elements)
// overall, I don't think it super important testing the directives. We can just test the templates that use the directives.

// in the test, create a component that uses the attribute directive, and an empty class to feed in TestBed (4.1.0)
// (same as in [3.1]) setup the component with TestBed.configureTestingModule({..}) (satisfy the TS),
//  and create the component with TestBed.createComponent(..) before each test (4.1.1)
// (same as [3.3]) use fixture.detectChanges() to trigger the change

// (4.1.0) create any basic component that uses the directive
@Component({
  template: `
      <i [appFavoriteIcon]="true"></i>
      <i [appFavoriteIcon]="false"></i>
      <i [appFavoriteIcon]="true" [color]="'blue'"></i>
      <i [appFavoriteIcon]="true" [color]="'cat'"></i>
    `
})
// (4.1.0) empty class to feed in to the TestBed

class TestComponent { }
describe('Directive: FavoriteIconDirective', () => {
  let fixture: ComponentFixture<any>;
  const expectedSolidStarList = constants.classes.SOLID_STAR_STYLE_LIST;
  const expectedOutlineStarList = constants.classes.OUTLINE_STAR_STYLE_LIST;

  beforeEach(() => {
    // const testModuleMetadata: TestModuleMetadata = {
    //   declarations: [FavoriteIconDirective, TestComponent]
    // };
    TestBed.configureTestingModule({
      declarations: [FavoriteIconDirective, TestComponent]
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  describe('when favorite icon is set to true', () => {
    let starElement = null;

    beforeEach(() => {
      const defaultTrueElementIndex = 0;
      starElement = getStarElement(fixture, defaultTrueElementIndex);
    });

    it('should display a solid gold star after the page loads', () => {
      expect(starElement.style.color).toBe('gold');
      expect(doClassesMatch(starElement.classList, expectedSolidStarList)).toBeTruthy();
    });

    it('should display a solid gold star if the user rolls over the star', () => {
      const event = new Event('mouseenter');
      starElement.dispatchEvent(event);

      expect(starElement.style.color).toBe('gold');
      expect(doClassesMatch(starElement.classList, expectedSolidStarList)).toBeTruthy();
    });

    it('should display a black outline of a star after the user clicks on the star', () => {
      const event = new Event('click');
      starElement.dispatchEvent(event);

      expect(starElement.style.color).toBe('black');
      expect(doClassesMatch(starElement.classList, expectedOutlineStarList)).toBeTruthy();
    });
  });

  afterEach(() => { fixture = null; });
});
