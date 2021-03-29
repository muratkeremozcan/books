import { Router, ActivatedRoute } from '@angular/router';
import { Spectator, createComponentFactory, mockProvider, createRoutingFactory, byText, byTextContent } from '@ngneat/spectator/jest';

import { Hero } from '../model/hero';
import { HeroService } from '../model/hero.service';
import { HeroDetailComponent } from './hero-detail.component';
import { HeroDetailService } from './hero-detail.service';
import { HeroModule } from './hero.module';
import { HeroRoutingModule } from './hero-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';



// [4] testing components that use routing and @Input / @Output properties // https://github.com/ngneat/spectator#testing-with-routing
// this component is a special case where there is an @Input that gets set after an ngOnInit with a service observable call

// setup the component with routing; use createRoutingFactory to auto-mock Router and ActivatedRoute (4.1)
// mock the ngOnInit service observable call or set the @Input manually in each test (4.2), and then use fakeAsync or fixture.whenStable() to access the dom (4.3)
// use convenience methods to trigger a navigation, if needed (4.4) https://github.com/ngneat/spectator#triggering-a-navigation

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

describe('module test', () => {
  let component: HeroDetailComponent;
  let spectator: Spectator<HeroDetailComponent>;
  let heroDetailServiceSpy: HeroDetailService;

  // (4.1) setup the component with routing. Use createRoutingFactory to auto-stub Router and ActivatedRoute
  const createComponent = createRoutingFactory({ // compared to createComponentFactory, Route and ActivatedRoute are auto-mocked
    component: HeroDetailComponent,
    // componentMocks: [HeroDetailService], // if we use automocking, we have to set the  hero property before every test so that it comes in as defined for the @Input to be available:  component.hero = { id: 2, name: 'Dork' };
    // instead of automocking and overriding hero in the tests, this is short form of providing a specific function inline, the rest are automocked and can be overridden in the individual tests though
    providers: [MockProvider(HeroDetailService, {  // (4.2)  mock the ngOnInit service observable call or set the @Input manually in each test,
      getHero: () => of({ id: 69, name: 'Murat the Super Tester' })
    })],
    imports: [FormsModule], // need formsModule for the template ngmodel
    detectChanges: false,
    // stubsEnabled: false, // (true by default) when stubsEnabled option is false, you can pass a real routing configuration and setup an integration test using the RouterTestingModule from Angular
  });

  beforeEach(() => {
    spectator = createComponent();    // (4.1) setup the component.. TestBed.configureTestingModule({..})
    component = spectator.component;  // (4.2) access the TS...     comp = fixture.debugElement.componentInstance
    // component.hero = { id: 2, name: 'Dork' }; // not needed if using MockProvider with custom mock function
  });

  it('sanity', () => {
    // when the component has @Input(s), in the tests you need to set the initial input, or emit a hero on your subscription with fakeasync, or your dom will never render
    spectator.detectChanges();
    expect(component).toBeTruthy();
  });

  // (4.3) use fakeAsync or fixture.whenStable() to access the dom
  it('query byText', fakeAsync(() => {
    // this is the point of doing detectchanges false initially and calling detect changes manually instead of in before each - i can set any inputs specific to each test scenario before detecting the changes
    // if i don't detect changes, the dom is never rendered (onInit does not get called, or the other lifecycle hooks, so i cannot test through dom)
    component.hero = { id: 2, name: 'Dork' };

    spectator.detectChanges();
    tick();

    // TODO: @brian why do these not work?
    // expect(spectator.query(byTextContent('Dork', {selector: '.qa-hero-name'}))).toBeTruthy();
    // expect(spectator.query(byTextContent('2', {selector: '.qa-hero-id'}))).toBeTruthy();
  }));

  // (4.3) use fakeAsync or fixture.whenStable() to access the dom
  it('async with await spectator.fixture.whenStable() version: should navigate when click cancel', async () => {
    spectator.detectChanges();

    // IMPORTANT: // after the fixture.whenStable(), the mock service call for getHero will get called, so you can verify the dom has changed to new hero
    await spectator.fixture.whenStable();

    spectator.click('.qa-cancel');

    expect(spectator.inject(Router).navigate).toHaveBeenCalled();
  });

  it('fakeAsync with tick() version: should navigate when click cancel ', fakeAsync(() => {
    spectator.detectChanges();

    // IMPORTANT: // after the tick, the mock service call for getHero will get called, so you can verify the dom has changed to new hero
    tick();

    spectator.click('.qa-cancel');
    expect(spectator.inject(Router).navigate).toHaveBeenCalled();
  }));


  // TODO: @brian : how do we correctly test cancel and save? It seems cancel passes incorrectly and Save fails regularly
  it('should save when click save but not navigate immediately', async () => {
    // Get service injected into component and spy on its`saveHero` method. Use callThrough to have it do nothing
    heroDetailServiceSpy = spectator.inject(HeroDetailService);
    spyOn(heroDetailServiceSpy, 'saveHero').and.callThrough();
    spectator.detectChanges();
    await spectator.fixture.whenStable();

    spectator.click('.qa-save');

    expect(spectator.inject(Router).navigate).not.toHaveBeenCalled();
  });

  // it('should navigate when saving', async () => {
  //   spectator.detectChanges();
  //   await spectator.fixture.whenStable();

  //   spectator.click('.qa-save');

  //   expect(spectator.inject(Router).navigate).toHaveBeenCalled();
  // });

  // TODO: @brian: this is the same as demo-component.spec.ts 'ReversePipeComp should reverse the input text' , but fails. How can it work?
  // it('should convert hero name to Title Case', async () => {
    // // get the name's input and display elements from the DOM
    // const nameInput: HTMLInputElement = spectator.query('input');
    // const nameDisplay: HTMLElement = spectator.query('span');

    // spectator.detectChanges();
    // await spectator.fixture.whenStable();

    // // simulate user entering new name in input
    // nameInput.value = 'quick BROWN  fOx';

    // // Dispatch a DOM event so that Angular learns of input value change.
    // // then wait while ngModel pushes input value to comp.text
    // nameInput.dispatchEvent(new Event('input'));
    // await spectator.fixture.whenStable();

    // // it takes one more change detection for the pipe operator to effect the dom
    // spectator.detectChanges();

    // expect(nameDisplay.textContent).toBe('Quick Brown  Fox');
  // });

});

