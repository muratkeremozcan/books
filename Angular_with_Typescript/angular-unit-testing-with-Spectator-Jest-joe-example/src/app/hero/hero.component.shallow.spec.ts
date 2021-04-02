import { Spectator, createRoutingFactory, byText } from '@ngneat/spectator/jest';
import { HeroComponent } from './hero.component';

// [1].2 unit testing components with @Input and @Output properties

describe('HeroComponent (shallow tests)', () => {
  let component: HeroComponent;
  let spectator: Spectator<HeroComponent>;

  const createComponent = createRoutingFactory({
    component: HeroComponent,
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    // this component has an @Input property. So, simulate the @Input hero property being set by the parent
    // note: when the component has @Input(s), in the tests you need to set the initial input, or emit a hero on your subscription, or your dom will never render
    component.hero = { id: 1, name: 'SuperDude', strength: 3};

    // detectChanges() : to update the bindings / trigger change detection
    spectator.detectChanges();
  });

  it('should have the correct hero', () => {
    expect(component.hero.name).toEqual('SuperDude');
  });

  it('should render the hero name in an anchor tag', () => {
    expect(spectator.query('.qa-hero-link').innerHTML).toContain('SuperDude');
  });
});
