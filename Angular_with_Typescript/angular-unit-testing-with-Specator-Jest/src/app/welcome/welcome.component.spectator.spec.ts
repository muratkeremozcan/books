import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { UserService } from '../model/user.service';
import { WelcomeComponent } from './welcome.component';

// [5] testing components that have external service dependencies
// setup the component much less overhead with spectator (5.1)
// KEY extra compared to [1] inject the service dependency:  depService = spectator.inject(DepService) (5.1.3)
// access the TS with spectator.component  (5.2)
// use spectator.detectChanges()  to trigger the change detection (5.3),
// use DOM testing library convenience methods:  https://github.com/ngneat/spectator#queries' (5.4)
// trigger the event using spectator events api https://github.com/ngneat/spectator#events-api (5.5.2) and verify what is emitted (5.5.3)

class MockUserService {
  isLoggedIn = true;
  user = { name: 'Test User'};
}

describe('[5] Spectator Version: Testing Components with that have external service dependencies', () => {
describe('testing components that have external service dependencies', () => {
  let comp: WelcomeComponent;
  let userService: UserService; // the TestBed injected service

  // (5.1) setup the component
  let spectator: Spectator<WelcomeComponent>;
  const createComponent = createComponentFactory({
    component: WelcomeComponent,
    providers: [ { provide: UserService, useClass: MockUserService } ],
    detectChanges: false
  });

  beforeEach(() => {
    spectator = createComponent(); // (5.1) setup the component.. TestBed.configureTestingModule({..})
    comp = spectator.component;    // (5.2) access the TS...      comp = fixture.debugElement.componentInstance\

    userService = spectator.inject(UserService); // (5.1.3) inject the service to the setup
  });

  it('(5.1) setup the component. KEY: inject the service dependency depService = spectator.inject(DepService), (5.2) access the TS with spectator.component ' , () => {
    expect(comp).toBeTruthy();
  });

  it('(5.3) control the properties of the mocked service, and trigger change detection, (5.4) use DOM testing library convenience methods:  https://github.com/ngneat/spectator#queries ', () => {
    userService.isLoggedIn = false;
    spectator.detectChanges();
    expect(spectator.query('.welcome')).toHaveText('Please log in');
  });

  it('', () => {
    spectator.detectChanges();
    expect(spectator.query('.welcome')).toHaveText('Test User');
  });

  it('This is all similar to testing components. The key difference is Injecting the service dependency, Mocking it, and controlling it in the tests', () => {
    userService.user .name = 'Bubba';
    spectator.detectChanges();
    expect(spectator.query('.welcome')).toHaveText('Bubba');
  });
});
});
