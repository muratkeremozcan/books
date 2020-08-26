// listing 7.10 7.11 7.12 7.13

import { Component, Injectable, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { Router, CanActivate } from "@angular/router";

// 2: testing route guards.
// if a route guard method returns true, navigation attempt can continue

// a fake service is used to demonstrate separating the responsibility of the route guard from the user authentication service
@Injectable()
class UserAuthentication {
  private isUserAuthenticated: boolean = false;
  authenticateUser() {
    this.isUserAuthenticated = true;
  }
  getAuthenticated() {
    return this.isUserAuthenticated;
  }
}

// the route guard implements the CanActivate interface which is the focus of the test
@Injectable()
class AuthenticationGuard implements CanActivate {
  constructor(private userAuth: UserAuthentication) { }
  canActivate(): Promise<boolean> | boolean {
    return new Promise((resolve) => resolve(this.userAuth.getAuthenticated()));
  }
}

// the setup generates 2 components to facilitate the test, one for app fixture, one for the target
// you need  to configure at least 2 routes: initial route and a 2nd route to be the target of the navigation attempts
@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
})
class AppComponent { }

@Component({
  selector: `target`,
  template: `target`
})
class TargetComponent { }

describe('Testing routing guards', () => {
  let router;
  let location;
  let fixture;
  let userAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // uses RouterTestingModule
      // RouterTestingModule helps you write tests for your components that interact with the router by providing test router configurations
        // and inspecting the calls to the router itself
      imports: [RouterTestingModule.withRoutes([
        { path: '', component: AppComponent },
        {
          path: 'protected',
          component: TargetComponent,
          // specifies the route guard for the test
          canActivate: [AuthenticationGuard],
        },
      ])],
      providers: [AuthenticationGuard, UserAuthentication],
      declarations: [TargetComponent, AppComponent],
    });
    // AuthenticationGuard will check UserAuthentication when the route nav attempt occurs

    router = TestBed.get(Router);
    location = TestBed.get(Location);
    // allows the authentication check to pass
    // you capture a reference to the service and control it during the test
    userAuthService = TestBed.get(UserAuthentication);
  });

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(AppComponent);
    router.initialNavigation();
  }));

  it('tries to route to a page without authentication', fakeAsync(() => {
    // tries to navigate to the protected route before authentication
    router.navigate(['protected']);
    flush();
    expect(location.path()).toEqual('/');
  }));

  it('tries to route to a page after authentication', fakeAsync(() => {
    // authenticates first and tries again. This time it works
    userAuthService.authenticateUser();
    router.navigate(['protected']);
    flush();
    expect(location.path()).toEqual('/protected');
  }));

});

