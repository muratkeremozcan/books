import { AppComponent } from './app.component';
import { Spectator, createRoutingFactory, byText } from '@ngneat/spectator/jest';
import { WelcomeComponent } from './welcome/welcome.component';
import { MockComponent } from 'ng-mocks';
import { BannerComponent } from './banner/banner.component';
import { RouterTestingModule } from '@angular/router/testing';
// [7] testing components that include other components
// setup the component
// KEY: mock the internal components, use the ng-mocks library MockComponent (7.1.5). just like (6.1.5)

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



});

