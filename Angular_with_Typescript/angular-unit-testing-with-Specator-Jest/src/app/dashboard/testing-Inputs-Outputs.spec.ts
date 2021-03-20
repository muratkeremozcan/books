import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Hero } from '../model/hero';

import { DashboardHeroComponent } from './dashboard-hero.component';

// [1] unit testing components with @Input and @Output properties
// setup the component with TestBed.configureTestingModule({..}) (satisfy the TS), and create the component with TestBed.createComponent(..) before each test (1.1)
// access the TS with fixture.debugElement.componentInstance / fixture.componentInstance (1.2)
// use fixture.detectChanges() to trigger the change detection (1.3),
// access the template with fixture.debugElement.nativeElement / fixture.debugElement (1.4.1),
// to test nativeElements (ex: @Input) use fixture.debugElement.nativeElement.querySelector('..').textContent (1.4.2)
// to test @Output subscribe to the event emitter and setup what will be emitted (1.5.1),
// access the debugElement with fixture.debugElement.query(By.css('')).nativeElement, trigger event (1.5.2) and verify what is emitted (1.5.3)


describe.skip('[1] Testing Components with TestBed', () => {
describe('unit testing components with @Input and @Output properties', () => {
  let comp: DashboardHeroComponent;
  let fixture: ComponentFixture<DashboardHeroComponent>;

  // (1.1.1) setup the component
  beforeEach(() => {
    TestBed
    .configureTestingModule({
      declarations: [DashboardHeroComponent]
    }); // a few versions ago, we had to wrap this in waitForAsync and use .compileComponents() because the file had an external html and css. Not anymore
  });

  beforeEach(() => {
    // (1.1.2) TestBed.createComponent(): returns a ComponentFixture object which gives access to the TS & the template
    fixture = TestBed.createComponent(DashboardHeroComponent);
    // (1.2) fixture.debugElement.componentInstance / fixture.componentInstance gives access to the TS
    comp = fixture.componentInstance;
  });

  it('(1.1) setup the component, (1.2) access the TS with fixture.componentInstance ' , () => {
    expect(comp).toBeTruthy();
  });

  describe('(1.3) detectChanges() to trigger change detection' , () => {
    let mockHeroInput: Hero;

    beforeEach(() => {
      // this component has an @Input property. So, simulate the @Input hero property being set by the parent
      mockHeroInput = comp.hero =  {id: 42, name: 'new Hero Name'};

      // (1.3) detectChanges() : to update the bindings / trigger change detection
      fixture.detectChanges();
    });

    it('Testing @Input: , (1.4.1) fixture.debugElement.nativeElement to access the template, (1.4.2) fixture.debugElement.nativeElement.querySelector(..).textContent to assert', () => {
      // (1.4.1) fixture.debugElement.nativeElement: gives access to the template native elements.=
      const heroNativeElement = fixture.debugElement.nativeElement;

      // (1.4.2) to test nativeElements use fixture.debugElement.nativeElement.querySelector('..').textContent to assert
      expect(heroNativeElement.querySelector('.hero').textContent).toContain(mockHeroInput.name.toUpperCase());
    });

    it('Testing the @Output: (1.5.1) subscribe to the event emitter and set up what will be emitted, (1.5.2) access the debugElement with fixture.debugElement.query(By.css()).nativeElement and trigger click' , () => {
      let emittedHero: Hero;

      // (1.5.1) subscribe to the event emitter and set up what will be emitted (this.hero will be emitted which we emulate as emittedHero)
      comp.selected.subscribe((hero: Hero) => emittedHero = hero );

      // (1.5.2)  access the debugElement with fixture.debugElement.query(By.css('')).nativeElement and trigger click
      const heroDebugElement =  fixture.debugElement.query(By.css('.hero')).nativeElement;
      heroDebugElement.click();

      // (1.5.3) verify that what is emitted
      expect(emittedHero).toBe(mockHeroInput);
    });
  });

});
});
