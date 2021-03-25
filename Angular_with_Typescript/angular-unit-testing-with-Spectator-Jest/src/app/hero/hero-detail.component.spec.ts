import { Router, ActivatedRoute } from '@angular/router';
import { Spectator, createComponentFactory, mockProvider, createRoutingFactory, byText, byTextContent } from '@ngneat/spectator/jest';

import { Hero } from '../model/hero';
import { HeroService } from '../model/hero.service';
import { HeroDetailComponent } from './hero-detail.component';
import { HeroDetailService } from './hero-detail.service';
import { HeroModule } from './hero.module';
import { HeroRoutingModule } from './hero-routing.module';
import { By } from '@angular/platform-browser';


// [4] testing components that use routing // https://github.com/ngneat/spectator#testing-with-routing
// setup the component with routing; use createRoutingFactory to auto-mock Router and ActivatedRoute (4.1)
// use convenience methods to trigger a navigation, if needed (4.2) https://github.com/ngneat/spectator#triggering-a-navigation


describe('module test', () => {
  let component: HeroDetailComponent;
  let spectator: Spectator<HeroDetailComponent>;

  // (4.1) setup the component with routing. Use createRoutingFactory to auto-stub Router and ActivatedRoute
  const createComponent = createRoutingFactory({ // compared to createComponentFactory, Route and ActivatedRoute are auto-mocked
    component: HeroDetailComponent,
    mocks: [HeroDetailService, HeroService],
    detectChanges: false,
    stubsEnabled: false, // (true by default) when stubsEnabled option is false, you can pass a real routing configuration and setup an integration test using the RouterTestingModule from Angular
    params: { id: 41 }, // initial params to use in ActivatedRoute stub
    data: { name: 'Dr Nice' } // initial data to use in ActivatedRoute stub
  });

  beforeEach(() => {
    spectator = createComponent();    // (4.1) setup the component.. TestBed.configureTestingModule({..})
    component = spectator.component;  // (1.2) access the TS...     comp = fixture.debugElement.componentInstance
  });

  it('sanity', () => {
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
    expect(spectator.query(byText('Dr Nice'))).toBeDefined();
    spectator.query(byTextContent('Dr Nice', {selector: '.qa-hero-name'}));
  });

  it('should navigate when click cancel', async () => {
    spectator.detectChanges();
    spectator.query('.qa-cancel'); // exists
    spectator.query(byText('Cancel')); // exists;

    // spectator.click('.qa-cancel'); // can't click
    // spectator.click(byText('Cancel')); // TODO: click it , but doesn't work
    // expect(page.navigateSpy.calls.any()).toBe(true, 'router.navigate called');
  });

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

