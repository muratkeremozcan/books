import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { BannerComponent } from './banner-external.component';


// [1] unit testing components
// setup the component with TestBed.configureTestingModule({..}) (satisfy the TS), and create the component with TestBed.createComponent(..) before each test (1.1)
// access the TS with fixture.debugElement.componentInstance / fixture.componentInstance (1.2)
// use fixture.detectChanges() to trigger the change detection (1.3), but not always!
// access the template with fixture.debugElement.nativeElement / fixture.debugElement (1.4.1),
// to test nativeElements (ex: @Input) use fixture.debugElement.nativeElement.querySelector('..').textContent (1.4.2)
// to test @Output subscribe to the event emitter and setup what will be emitted (1.5.1),
// access the debugElement with fixture.debugElement.query(By.css('')).nativeElement, trigger event (1.5.2) and verify what is emitted (1.5.3)

describe.skip('[1] Testing Components with TestBed', () => {
describe('unit testing components with TestBed, example 2', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;
  let bannerNative;
  let bannerDebug;
  let bannerDebugNative;

  beforeEach(() => {
    // setup the component with TestBed.configureTestingModule({..}) (satisfy the TS)...
    TestBed.configureTestingModule({
      declarations: [BannerComponent],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true } // with this, detectChanges is set to true automatically
      ]
    });
    // (1.1) and create the component with TestBed.createComponent(..) before each test
    fixture = TestBed.createComponent(BannerComponent);
    // (1.2) access the TS with fixture.debugElement.componentInstance / fixture.componentInstance
    component = fixture.componentInstance;

    // (1.4.1) access the template with fixture.debugElement.nativeElement / fixture.debugElement
    bannerNative = fixture.nativeElement;
    bannerDebug = fixture.debugElement;
    bannerDebugNative = fixture.debugElement.nativeElement;
  });

  it('with TestBed, you can use native, debug or debugNative element to access the DOM', () => {

    // to test nativeElements (ex: @Input) use fixture.debugElement.nativeElement.querySelector('..').textContent (1.4.2)
    expect(bannerNative.querySelector('h1').textContent).toEqual(component.title);
    expect(bannerDebugNative.querySelector('h1').textContent).toEqual(component.title);
    expect(bannerDebug.query(By.css('h1')).nativeElement.textContent).toEqual(component.title);

    // same
    expect(bannerNative.textContent).toContain(component.title);
    expect(bannerDebugNative.textContent).toContain(component.title);
  });
});
});
