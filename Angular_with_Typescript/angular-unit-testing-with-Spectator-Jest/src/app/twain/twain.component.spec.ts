import { fakeAsync, waitForAsync } from '@angular/core/testing';
import { Spectator, createComponentFactory, byText } from '@ngneat/spectator/jest';

import { of, throwError } from 'rxjs';

import { TwainComponent } from './twain.component';
import { TwainService } from './twain.service';


// [5].2 testing components that have external service dependencies - SPECTATOR/JEST MOCK
// setup the component much less overhead with spectator (5.1)
// KEY contrast to [5].1 MANUAL MOCKs example: with spectator, you can fully mock the dependency using the mocks property  (5.1.2)
// KEY extra compared to basic example: inject the service dependency:  depService = spectator.inject(DepService) (5.1.3)
// KEY extra compared to CUSTOM MOCK example: stub the external service's return value, and exercise the main component under test (5.1.4)
// access the TS with  (5.2)
// use spectator.detectChanges()  to trigger the change detection (5.3),
// if needed by the component implementation, use fakeAsync and spectator.tick() (5.4)
// trigger the event using spectator events api https://github.com/ngneat/spectator#events-api (5.5.2) and verify what is emitted (5.5.3)


describe('[5] testing components that have external service dependencies - SPECTATOR/JEST MOCK', () => {
  let component: TwainComponent;
  let twainServiceSpy;
  let twainService;
  let testQuote;

  // (5.1) setup the component
  let spectator: Spectator<TwainComponent>;
  const createComponent = createComponentFactory({
    component: TwainComponent,
    // (5.1.2) mock the dependency using the mocks property
    mocks: [TwainService],
    // as an alternative shortcut, we could also use the MockProvider way of mocking like we did in (4.2) - would have to change some plumbing for this spec
    // providers: [MockProvider(TwainService, {
    //   getQuote: () => of('Test Quote')
    // })],
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
  });

  describe('(5.1.2) KEY contrast to manual mocks, use Spectator mocks, (5.1.3) inject the service dependency:  depService = spectator.inject(DepService)', () => {

    beforeEach(() => {
      // (5.1.4) stub the external service's return value, and exercise the component under test
      testQuote = 'Test Quote';
      twainService = jest.spyOn(twainServiceSpy, 'getQuote').mockReturnValue(of(testQuote));
      // twainService = jest.spyOn(twainServiceSpy, 'getQuote').mockImplementation(() => of(testQuote)); // same
      // twainService = twainServiceSpy.getQuote.mockImplementation(() => of(testQuote)); // same
    });

    it('(5.1.4) stub the external service\'s return value, and exercise the component under test', () => {
      expect(errorMessage()).toBeNull();
      expect(twainService).not.toHaveBeenCalled();
      expect(spectator.query(byText(testQuote))).toBeFalsy();
    });

    it('(5.3) use spectator.detectChanges()  to trigger the change detection ', () => {
      spectator.detectChanges();
      expect(twainService).toHaveBeenCalled();
      expect(spectator.query('.twain')).toHaveText(testQuote);
      expect(spectator.query(byText(testQuote))).toBeTruthy(); // same
    });
  });

  it('(5.4) if needed by the component implementation, use fakeAsync and spectator.tick()', fakeAsync(() => {
    twainService = jest.spyOn(twainServiceSpy, 'getQuote').mockReturnValue(throwError(new Error('TwainService test failure')));
    // twainService = jest.spyOn(twainServiceSpy, 'getQuote').mockImplementation(() => (throwError(new Error('TwainService test failure')))); // same
    // twainService = twainServiceSpy.getQuote.mockImplementation(() => (throwError(new Error('TwainService test failure')))); // same

    spectator.detectChanges();
    expect(twainService).toHaveBeenCalled();

    spectator.tick(); // tick is needed here to flush the setTimeout inside the catchError operator block

    expect(errorMessage()).toMatch(/test failure/);
    expect(errorMessage()).toBe('TwainService test failure'); // same

    expect(spectator.query(byText('...'))).toBeTruthy();
  }));

  it('(5.4) if needed by the component implementation, async await way)', async () => {
    twainService = jest.spyOn(twainServiceSpy, 'getQuote').mockReturnValue(throwError(new Error('TwainService test failure')));
    // twainService = jest.spyOn(twainServiceSpy, 'getQuote').mockImplementation(() => (throwError(new Error('TwainService test failure')))); // same
    // twainService = twainServiceSpy.getQuote.mockImplementation(() => (throwError(new Error('TwainService test failure')))); // same

    spectator.detectChanges();
    expect(twainService).toHaveBeenCalled();

    // flush the setTimeout inside the catchError operator block
    await spectator.fixture.whenStable();
    spectator.detectChanges();

    expect(errorMessage()).toMatch(/test failure/);
    expect(errorMessage()).toBe('TwainService test failure'); // same

    expect(spectator.query(byText('...'))).toBeTruthy();
  });

});
