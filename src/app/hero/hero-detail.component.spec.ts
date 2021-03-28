import { Router, ActivatedRoute } from '@angular/router';
import {
  Spectator,
  createRoutingFactory,
  byText,
  byTextContent,
} from '@ngneat/spectator/jest';

import { HeroService } from '../model/hero.service';
import { HeroDetailComponent } from './hero-detail.component';
import { HeroDetailService } from './hero-detail.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { MockProvider } from 'ng-mocks';

// [4] testing components that use routing // https://github.com/ngneat/spectator#testing-with-routing
// setup the component with routing; use createRoutingFactory to auto-mock Router and ActivatedRoute (4.1)
// use convenience methods to trigger a navigation, if needed (4.2) https://github.com/ngneat/spectator#triggering-a-navigation

describe('module test', () => {
  let component: HeroDetailComponent;
  let spectator: Spectator<HeroDetailComponent>;

  // (4.1) setup the component with routing. Use createRoutingFactory to auto-stub Router and ActivatedRoute
  const createComponent = createRoutingFactory({
    // compared to createComponentFactory, Route and ActivatedRoute are auto-mocked
    component: HeroDetailComponent,
    mocks: [],  // @fixed @murat, dont mock HeroService, its not needed by the component, you got error before because you didnt mock herodetailservice as a component mock
    // componentMocks: [HeroDetailService], // @fixed - this is component provided - must be in component mocks!  (see line 12 in component)
    // but it was dumb to have it component provided, add it to root singleton and removed from component providers
    declarations: [],
    providers: [MockProvider(HeroDetailService, {  // instead of automocking and overriding in the test, this is short form of providing a specific function inline, the rest are automocked and can be overridden in the individual tests though
      getHero: () => of({ id: 69, name: 'Murat the Super Tester' })
    })],
    imports: [FormsModule, ReactiveFormsModule], // @fixed - need forms module for the template ngmodel
    detectChanges: false, // @murat - good heep this false, but must detecy changes in the tests, ideally after setting the input, or your dom will never render since you have an ngif
    stubsEnabled: false, // (true by default) when stubsEnabled option is false, you can pass a real routing configuration and setup an integration test using the RouterTestingModule from Angular
    params: { id: 41 }, // initial params to use in ActivatedRoute stub
    data: { name: 'Dr Nice' }, // initial data to use in ActivatedRoute stub
  });

  beforeEach(() => {
    spectator = createComponent(); // (4.1) setup the component.. TestBed.configureTestingModule({..})
    component = spectator.component; // (1.2) access the TS...     comp = fixture.debugElement.componentInstance
  });

  it('sanity', () => {
    component.hero = { id: 2, name: 'Dork' };
    spectator.detectChanges();
    expect(component).toBeTruthy();
  });

  /* DOM testing library-like approach
    spectator.query(byPlaceholder('Please enter your email address'));
    spectator.query(byValue('By value'));
    spectator.query(byTitle('By title'));
    spectator.query(byAltText('By alt text'));
    spectator.query(byLabel('By label'));
    spectator.query(byText('By text'));
    spectator.query(byText('By text', {selector: '#some .selector'}));
    spectator.query(byTextContent('By text content', {selector: '#some .selector'}));
  
  */

  it('query byText', () => {
    component.hero = { id: 2, name: 'Dork' };  // this is the point of doing detectchanges false initially and calling detect changes manually instead of in before each - i can set any inputs specific to each test scenario before detecting the changes
    // if i dont detect changes, the dom is never rendered (onInit does not get called, or the other lifecycle hooks, so i cannot test through dom)
    spectator.detectChanges(); // fixed
    expect(spectator.query(byText('Dr Nice'))).toBeDefined(); // @murat - this does not test what you think it does, tobedefined not valid test
    spectator.query(byTextContent('Dr Nice', { selector: '.qa-hero-name' }));// @murat - this does not test what you think it does, tobedefined not valid test
  });

  it('should navigate when click cancel', fakeAsync(() => {


    let foo = spectator.query('.qa-cancel'); // @murat - no this does not necesarrily exist, and will always be defined
    let bar = spectator.query(byText('Cancel')); // @murat - no this does not necesarrily exist, and will always be defined

    // see the on init has not completed, but the previous 2 lines dont fail - even if you check with exist!  if you set those to a variable and then do it again after the detect changes, you will see the difference if you put a breakpoint and inspect the variables
    component.hero = { id: 2, name: 'Dork' };
    spectator.detectChanges();

    foo = spectator.query('.qa-cancel'); // is foo after this line completes really the same as foo set on 77?
    bar = spectator.query(byText('Cancel'));  // is bar after this line completes really the same as bar set on 78?

    // @murat here you could test the dom now contains details of dork hero

    tick();  // with 

    // after the tick, the mock service call for get hero will get called, so you can vertify the dom has changed to new hero

    


    // and now that we have a dom rendered the following works
    spectator.click('.qa-cancel');
    spectator.click(byText('Cancel'));
  }));

  // convert to spectator

  // it('should save when click save but not navigate immediately', () => {
  //   // Get service injected into component and spy on its`saveHero` method.
  //   // It delegates to fake `HeroService.updateHero` which delivers a safe test result.
  //   const hds = fixture.debugElement.injector.get(HeroDetailService);
  //   const saveSpy = spyOn(hds, 'saveHero').and.callThrough();

  //   click(page.saveBtn);
  //   expect(saveSpy.calls.any()).toBe(true, 'HeroDetailService.save called');
  //   expect(page.navigateSpy.calls.any()).toBe(false, 'router.navigate not called');
  // });

  // it('should navigate when click save and save resolves', fakeAsync(() => {
  //      click(page.saveBtn);
  //      tick();  // wait for async save to complete
  //      expect(page.navigateSpy.calls.any()).toBe(true, 'router.navigate called');
  //    }));

  // it('should convert hero name to Title Case', () => {
  //   // get the name's input and display elements from the DOM
  //   const hostElement = fixture.nativeElement;
  //   const nameInput: HTMLInputElement = hostElement.querySelector('input');
  //   const nameDisplay: HTMLElement = hostElement.querySelector('span');

  //   // simulate user entering a new name into the input box
  //   nameInput.value = 'quick BROWN  fOx';

  //   // Dispatch a DOM event so that Angular learns of input value change.
  //   // In older browsers, such as IE, you might need a CustomEvent instead. See
  //   // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
  //   nameInput.dispatchEvent(new Event('input'));

  //   // Tell Angular to update the display binding through the title pipe
  //   fixture.detectChanges();

  //   expect(nameDisplay.textContent).toBe('Quick Brown  Fox');
  // });
});
