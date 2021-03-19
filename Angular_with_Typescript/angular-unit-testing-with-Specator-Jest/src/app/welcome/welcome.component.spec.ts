import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { UserService } from '../model/user.service';
import { WelcomeComponent } from './welcome.component';

// [5] testing components that have external service dependencies
// setup the component with TestBed.configureTestingModule({..}) (satisfy the TS), and create the component with TestBed.createComponent(..) before each test (5.1)
// KEY extra compared to [1] inject the service dependency:  depService = TestBed.inject(DepService) (5.1.3)
// access the TS with fixture.debugElement.componentInstance / fixture.componentInstance (5.2)
// control the properties of the mocked service, use fixture.detectChanges() to trigger the change detection and verify results (1.3),
// access the template with fixture.debugElement.nativeElement (5.4.1), // to test nativeElements (ex: @Input) use fixture.debugElement.nativeElement.querySelector('..').textContent (5.4.2)

class MockUserService {
  isLoggedIn = true;
  user = { name: 'Test User'};
}

describe('[5] Testing Components with that have external service dependencies with TestBed', () => {
describe('testing components that have external service dependencies', () => {
  let comp: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;
  let userService: UserService; // the TestBed injected service
  let el: HTMLElement; // the DOM element with the welcome message

  beforeEach(() => {

    // (5.1.1) setup the component
    TestBed.configureTestingModule({
      declarations: [WelcomeComponent],
      providers: [ { provide: UserService, useClass: MockUserService } ]
    });

    // (5.1.2) TestBed.createComponent(): returns a ComponentFixture object which gives access to the TS & the template
    fixture = TestBed.createComponent(WelcomeComponent);
    // (5.1.3) KEY extra compared to [1] inject the service dependency
    userService = TestBed.inject(UserService);
    // (5.2) fixture.debugElement.componentInstance / fixture.componentInstance gives access to the TS
    comp = fixture.componentInstance;

    // access the template with fixture.debugElement.nativeElement (5.4.1)
    // to test nativeElements use fixture.debugElement.nativeElement.querySelector('..').textContent (5.4.2)
    el = fixture.debugElement.nativeElement.querySelector('.welcome');
  });

  it('(5.1) setup the component KEY: inject the service dependency, (5.2) access the TS with fixture.componentInstance ' , () => {
    expect(comp).toBeTruthy();
  });

  it('(5.3) control the properties of the mocked service, and trigger change detection to verify the results', () => {
    userService.isLoggedIn = false;
    fixture.detectChanges();
    expect(el.textContent).toContain('Please log in');
  });

  it('(5.4.1) fixture.debugElement.nativeElement to access the template, (5.4.2) fixture.debugElement.nativeElement.querySelector(..).textContent to assert', () => {
    fixture.detectChanges();
    expect(el.textContent).toContain('Test User');
  });

  it('This is all similar to testing components. The key difference is Injecting the service dependency, Mocking it, and controlling it in the tests', () => {
    userService.user .name = 'Bubba';
    fixture.detectChanges();
    expect(el.textContent).toContain('Bubba');
  });
});
});
