import { CanActivate, Router } from '@angular/router'; // the relevant interfaces
import { Injectable } from '@angular/core'; // needs to be Injectable like a service

// (1.1) : implement the route guard canActivate
// CanActivate route: To guard a route, you need to create a new class  (for example, LoginGuard)
// that implements the CanActivate interface, which declares one method, canActivate().
// In this method, you implement the validating logic that will return either true or false.
// If canActivate() of the guard returns true, the user can navigate to the route.
// (1.2 CanActivate route) You need to assign this guard to the property canActivate at app.routing.module.ts

// the recommendation is to start small in a small app with single routing file,
// and refactor to each feature having its own child routing file as app grows

@Injectable()
export class LoginGuard implements CanActivate {

  // (1.1.1) use a constructor and implement canActivate()
  //  router object of type Router needs to be injected to the constructor of the guard to enable navigate
  constructor(private router: Router) { }

  canActivate() {
    // A call to the actual login service would go here. For now we'll just randomly return true or false
    const authorized = Math.random() < 0.5;

    if (!authorized) {
      alert('You\'re not logged in and will be redirected to Login page');
      // redirect to login if not authorized
      this.router.navigate(['/login']);
    }
    // if authorized can go to path: 'product'  - (2) this is with canActivate: [LoginGuard] at app-routing.module.ts
    return authorized;
  }
}
