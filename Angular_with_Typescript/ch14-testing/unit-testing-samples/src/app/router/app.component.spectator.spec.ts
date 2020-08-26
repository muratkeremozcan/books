import {AppComponent} from './app.component';
import {ProductDetailComponent} from './product.detail.component';
import {HomeComponent} from './home.component';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
// (4.1.1) import the Router, Location modules
import { routes } from './app.routing'; // (4.1.1) import the routes from app.routing module to setup the route
import { SpectatorRouting , createRoutingFactory } from '@ngneat/spectator';


// [4] testing components that use routing
// import Router (for nav), Location (for url check) modules, the routes from app.routing module and set them up (4.1)
// use navigate() and navigateByUrl(), click in the template and check the path (4.2)

describe('Router app AppComponent', () => {
  let spectator: SpectatorRouting<AppComponent>;
  const createComponent = createRoutingFactory({
    component: AppComponent,
    declarations: [HomeComponent, ProductDetailComponent],
    routes: routes, // (4.1.2 & 3) setup for routes is done differently...
    stubsEnabled: false // when stubsEnabled option is false, you can pass a real routing configuration and setup an integration test using the RouterTestingModule from Angular
  });

  beforeEach(() => {
    spectator = createComponent();
    // (4.1.4) inject the router to every test. With spectator location does not need to be injected, but location checking is different in the test
    const router = spectator.inject(Router);
    router.navigateByUrl('/');
  });

  it('can navigate and pass params to the product detail view', async() => { // have to use async function for await
    // (4.2.2) click in the template and check the path
    const productLink = spectator.debugElement.query(By.css('#product'));
    productLink.triggerEventHandler('click', { button: 0 });
    // KEY: with spectator, no need for tick() and detectChanges, instead we use  await spectator.fixture.whenStable() and an async function
    await spectator.fixture.whenStable();
    expect(spectator.get(Location).path()).toEqual('/product/1234'); // location checking is different with spectator
  });
});
