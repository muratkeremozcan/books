import { Component, DebugElement, Injectable, OnInit } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
// (7.1.1) import the RouterTestingModule, Router, Location modules
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

// [7] routing tests
// import RouterTestingModule (intercepts nav), Router (for nav), Location (for url check) modules, the routes from app.routing module and set them up (4.1)
// use navigate() and navigateByUrl(), click in the template and check the path (4.2)


@Injectable()
class NavConfigService {
  menu = [{ label: 'Home', path: '/target/12' }];
}

@Component({
  selector: `navigation-menu`,
  template: `<div><a *ngFor="let item of menu" [id]="item.label" [routerLink]="item.path">{{ item.label }}</a></div>`,
})
class NavigationMenu implements OnInit {
  menu: any;
  constructor(private navConfig: NavConfigService) { }

  ngOnInit() {
    this.menu = this.navConfig.menu;
  }
}


@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
})
class AppComponent { }

@Component({
  selector: `simple-component`,
  template: `simple`
})
class SimpleComponent { }

describe('Testing routes', () => {
  let fixture;
  // (7.1.2) setup router and location objects
  let router: Router; // the router object is responsible for the navigation
  let location: Location; // the location object represents the url

  beforeEach(() => {
    TestBed.configureTestingModule({
      // (7.1.3) setup RouterTestingModule: RouterTestingModule.withRoutes(routes)
      imports: [RouterTestingModule.withRoutes([
        { path: '', component: NavigationMenu },
        { path: 'target/:id', component: SimpleComponent }
      ])],
      providers: [{
        provide: NavConfigService,
        useValue: { menu: [{ label: 'Home', path: '/target/fakeId' }] }
      }],
      declarations: [NavigationMenu, SimpleComponent, AppComponent],
    });

  });

  beforeEach(fakeAsync(() => {
    // (7.1.4) inject the router and location before every test (with new Angular we don't use .get, instead use .inject)
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    fixture = TestBed.createComponent(AppComponent);

    // (7.2.1) use navigate() and navigateByUrl()
    router.navigateByUrl('/');
    advance();
  }));

  function advance(): void {
    tick();
    fixture.detectChanges();
  }

  it('Tries to route to a page', fakeAsync(() => {
    // (7.2.2) click in the template and check the path
    // To emulate the click, you need to get access to the corresponding DOM object, which you do by using the By.css()
    const menu = fixture.debugElement.query(By.css('a'));
    // for clicking you use the triggerEventHandler() method with two arguments.
    // the first argument has the value click that represents the click event.
    // the second argument has the value {button: 0} that represents the event object.
    // the RouterLink directive expects the value to include the property button with the number that represents the mouse button, and zero is for the left mouse button
    menu.triggerEventHandler('click', { button: 0 });
    // the tick() function assures that the asynchronous navgitation finishes before we run the assertion
    advance();
    expect(location.path()).toEqual('/target/fakeId');
  }));
});
