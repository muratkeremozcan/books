import { MasterService, ValueService } from './demo';
import { fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { SpectatorService , createServiceFactory } from '@ngneat/spectator/jest';

// [2] testing services:
// (2.1) setup the service and satisfy the TS with TestBed.configureTestingModule({..})
// (2.2) inject the service in the test
// (2.3) use waitForAsync() or fakeAsync() pattern for testing promises or observables

// (2.4.0) KEY: with spectator, you can fully mock the dependency using the mocks property (no need for custom mocks unless you need them)
// (2.4.1) inject the service under test and the mock dependency
// (2.4.2) stub the external service's return value, and exercise the main service under test


describe('[2] Testing Services Using Spectator', () => {
  describe('Testing a service: (2.1) setup the service, (2.2) inject the service to the setup', () => {
    let valueService: ValueService;

    // (2.1) setup the service... replaces TestBed.configureTestingModule({...}). Mind that the setup is prior to beforeEach block
    const createService = createServiceFactory(ValueService);
    let spectator: SpectatorService<ValueService>;

    beforeEach(() => {
      spectator = createService();
      valueService = spectator.inject(ValueService); // (2.2) inject the service to the setup
    });

    it('synchronous: should use ValueService getValue()', () => {
      expect(valueService.getValue()).toBe('real value');
    });

    // (2.3) use waitForAsync() or fakeAsync() pattern for testing promises or observables
    describe('(2.3) use waitForAsync() or fakeAsync() pattern for testing promises or observables', () => {
      describe('waitForAsync()', () => {
        it(
          'waitForAsync() : ValueService.getPromiseValue',
          waitForAsync(() => {
            valueService
              .getPromiseValue()
              .then((value) => expect(value).toBe('promise value'));
          })
        );

        it(
          'waitForAsync() : ValueService.getObservableValue',
          waitForAsync(() => {
            valueService
              .getObservableValue()
              .subscribe((value) => expect(value).toBe('observable value'));
          })
        );

        it(
          'waitForAsync() : ValueService.getObservableDelayValue',
          waitForAsync(() => {
            valueService
              .getObservableDelayValue()
              .subscribe((value) => expect(value).toBe('observable delay value'));
          })
        );
      });

      describe('fakeAsync()', () => {

        it('fakeAsync() : Value.getPromiseValue ', fakeAsync(() => {
          let value: any;
          valueService.getPromiseValue().then((val) => (value = val));
          tick(); // Trigger JS engine cycle until all promises resolve.
          expect(value).toBe('promise value');
        }));

        it('fakeAsync() : Value.getObservableValue. KEY: using tick() for control ', fakeAsync(() => {
          let value: any;
          valueService.getObservableValue().subscribe((val) => (value = val));
          tick(); // Trigger JS engine cycle until all promises resolve.
          expect(value).toBe('observable value');
        }));

        it('fakeAsync() : Value.getObservableDelayValue. KEY: tick(ms) by the delay amount ', fakeAsync(() => {
          let value: any;
          valueService.getObservableDelayValue().subscribe((val) => (value = val));
          tick(10); // Trigger JS engine cycle until all promises resolve.
          expect(value).toBe('observable delay value');
        }));
      });

      it('done() : Almost never use done() over fakeAsync() or waitForAsync()  . ValueService.getObservableDelayValue', (done) => {
        valueService.getObservableDelayValue().subscribe((value) => {
          expect(value).toBe('observable delay value');
          done();
        });
      });

    });
  });


  describe(`Testing a service with a dependency: (2.4.0) KEY: with spectator, you can fully mock the dependency using the mocks property,
  (2.4.1) inject the service under test and the mock dependency`, () => {
    let masterService: MasterService;
    let valueServiceSpy;
    let stubValue;


    const createService = createServiceFactory({
      service: MasterService,
      mocks: [ValueService] // (2.4.0) KEY: with spectator, you can fully mock the dependency using the mocks property
    });
    let spectator: SpectatorService<MasterService>;

    beforeEach(() => {
      spectator = createService();
      // (2.4.1) inject the service under test and the mock dependency
      masterService = spectator.inject(MasterService);
      valueServiceSpy = spectator.inject(ValueService);

      stubValue = 'stub value';
      // (2.4.2) stub the external service's return value, and exercise the main service under test
      jest.spyOn(valueServiceSpy, 'getValue').mockReturnValue(stubValue);
      // jest.spyOn(valueServiceSpy, 'getValue').mockImplementation(() => stubValue); // same
      // valueServiceSpy.getValue.mockImplementation(() => stubValue); // same
    });

    it('(2.4.2) stub the external service\'s return value, and exercise the main service under test', () => {
      expect(masterService.getValue()).toBe(stubValue);
      expect(valueServiceSpy.getValue).toHaveBeenCalledTimes(1);
      // expect(valueServiceSpy.getValue).toHaveBeenCalled(); // ^ same
      expect(valueServiceSpy.getValue).toHaveReturnedWith(stubValue);
    });

  });
});
