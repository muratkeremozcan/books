import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';

import { of, throwError } from 'rxjs';
import { last } from 'rxjs/operators';

import { TwainComponent } from './twain.component';
import { TwainService } from './twain.service';


// [5] testing components that have external service dependencies - SPECTATOR/JEST MOCK (very similar to [2] testing service that have external service dependencies)
// setup the component much less overhead with spectator (5.1)
// KEY contrast to [5] MANUAL MOCKs example: with spectator, you can fully mock the dependency using the mocks property (no need for custom mocks unless you need them) (5.1.2) . Similar to (2.4.0) testing services with other service dependencies.
// KEY extra compared to [1] inject the service dependency:  depService = spectator.inject(DepService) (5.1.3) . Same as (2.4.1) inject the mock service dependency
// stub the external service's return value, and exercise the main service under test (5.1.4) . Similar to (2.4.2) ,stubbing the external service and testing the service under test.
// access the TS with spectator.component  (5.2)
// use spectator.detectChanges()  to trigger the change detection (5.3),
// use DOM testing library convenience methods:  https://github.com/ngneat/spectator#queries' (5.4)
// trigger the event using spectator events api https://github.com/ngneat/spectator#events-api (5.5.2) and verify what is emitted (5.5.3)


describe('TwainComponent', () => {
  let component: TwainComponent;
  let twainServiceSpy;
  let twainService;
  let quoteEl;
  let stubValue;

  // (5.1) setup the component
  let spectator: Spectator<TwainComponent>;
  const createComponent = createComponentFactory({
    component: TwainComponent,
    // (5.1.2) with spectator you still have the option to create a custom mock, but if you are not customizing it, there is no need to
    // providers: [{ provide: TwainService, useValue: twainService}], // this is where the custom mock would go if we were not mocking with SPECTATOR/JEST
    mocks: [TwainService],
    detectChanges: false
  });

  /** Helper function to get the error message element value */
  const errorMessage = () => {
    const el = spectator.query('.error');
    return el ? el.textContent : null;
  };

  beforeEach(() => {
    spectator = createComponent();    // (5.1) setup the component..
    component = spectator.component;  // (5.2) access the TS...

    // (5.1.3) inject the service dependency:  depService = spectator.inject(DepService)
    twainServiceSpy = spectator.inject(TwainService);
    stubValue = 'Test Quote';
    // (5.1.4) stub the external service's return value, and exercise the component under test
    twainService = jest.spyOn(twainServiceSpy, 'getQuote').mockReturnValue(of(stubValue));
    // twainService = jest.spyOn(twainServiceSpy, 'getQuote').mockImplementation(() => of(stubValue)); // same
    // twainService = twainServiceSpy.getQuote.mockImplementation(() =>() => of(stubValue)); // same

    quoteEl = spectator.query('.twain').textContent;
  });

  it('sanity', () => {
    expect(component).toBeTruthy();
  });

  it('should not show quote before OnInit', () => {
    expect(quoteEl).toBe('');
    expect(errorMessage()).toBeNull();
    expect(twainService).not.toHaveBeenCalled();
  });


});
