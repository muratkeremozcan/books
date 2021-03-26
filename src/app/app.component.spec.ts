import { AppComponent } from './app.component';
import { Spectator, createRoutingFactory, byText } from '@ngneat/spectator/jest';
import { WelcomeComponent } from './welcome/welcome.component';
import { MockComponent } from 'ng-mocks';
import { BannerComponent } from './banner/banner.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, RouterLink } from '@angular/router';

// [7] testing components that include routerLinks
// setup the component with createRoutingFactory to auto-mock Router and ActivatedRoute
// KEY: mock the internal components, use the ng-mocks library MockComponent (7.1.5). just like (6.1.5)
// KEY: for <router-outlet> , import RouterTestingModule

describe('App component', () => {
  let component: AppComponent;
  let spectator: Spectator<AppComponent>;

  const createComponent = createRoutingFactory ({
    component: AppComponent,
    // (7.1.5) mock the internal components, use the ng-mocks library MockComponent
    declarations: [MockComponent(BannerComponent), MockComponent(WelcomeComponent)],
    imports: [RouterTestingModule],
    detectChanges: false
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('sanity', () => {
    expect(component).toBeTruthy();
  });

  it('read routerLinks with  { read: RouterLink } option', () => {
    const link1 = spectator.query('.qa-link-1', { read: RouterLink });
    const link2 = spectator.query('.qa-link-2', { read: RouterLink });
    const link3 = spectator.query('.qa-link-3', { read: RouterLink });

    expect(link1.routerLink).toEqual('/dashboard');
    expect(link2.routerLink).toEqual('/heroes');
    expect(link3.routerLink).toEqual('/about');
  });

  // it('click navigate to routes', () => {
    // spectator.detectChanges();

    // TODO: cannot click ....
    // spectator.click('.qa-link-1');
    // spectator.click(byText('Dashboard'));

    // expect(spectator.inject(Router).navigate).toHaveBeenCalled();
  // });
});

