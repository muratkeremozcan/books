import { Location } from '@angular/common';
import { By } from '@angular/platform-browser';
import {TestBed, fakeAsync, async, tick} from '@angular/core/testing';
// (4.1.1) import the RouterTestingModule, Router, Location modules
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import {AppComponent} from './app.component';
import {ProductDetailComponent} from './product.detail.component';
import {routes} from './app.routing'; // (4.1.1) import the routes from app.routing module to setup the route
import {HomeComponent} from './home.component';

// [4] testing components that use routing
// import RouterTestingModule (intercepts nav), Router (for nav), Location (for url check) modules, the routes from app.routing module and set them up (4.1)
// use navigate() and navigateByUrl(), click in the template and check the path (4.2)

describe('Router app AppComponent', () => {
  let fixture;
  // (4.1.2) setup router and location objects
  let router: Router; // the router object is responsible for the navigation
  let location: Location; // the location object represents the url

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule.withRoutes(routes)], // (4.1.3) setup RouterTestingModule: RouterTestingModule.withRoutes(routes)
        declarations: [
          AppComponent, ProductDetailComponent, HomeComponent
        ]
      }).compileComponents();
    }));

  beforeEach(fakeAsync(() => {
    // (4.1.4) inject the router and location before every test
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    fixture = TestBed.createComponent(AppComponent);

    // (4.2.1) use navigate() and navigateByUrl()
    router.navigateByUrl('/');
    tick();
    fixture.detectChanges();
  }));

  it('can navigate and pass params to the product detail view', fakeAsync(() => {
    // (4.2.2) click in the template and check the path
    const productLink = fixture.debugElement.query(By.css('#product'));
    productLink.triggerEventHandler('click', { button: 0 });
    tick();
    fixture.detectChanges();
    expect(location.path()).toEqual('/product/1234');
  }));
});
