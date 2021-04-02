import { HeroesComponent } from './heroes.component';
import { HeroService } from '../hero.service';
import { By } from '@angular/platform-browser';
import { HeroComponent } from '../hero/hero.component';
import { Spectator, createComponentFactory, byText } from '@ngneat/spectator/jest';
import { MockComponent, MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { fakeAsync, flush } from '@angular/core/testing';
import { Router } from '@angular/router';

// [6] testing components that include other components, services
// setup the component (6.1)
// mock the service dependency (6.1.2)
// KEY: mock the internal components, use the ng-mocks library MockComponent. (6.1.5)
// access the TS with spectator.component  (6.2)
// use spectator.detectChanges()  to trigger the change detection (6.3)
// to access the in-line line component, query it. If there is an ngFor, use queryAll:  spectator.query/queryAll<ChildComponent>(ChildComponent)  (6.4)
// access the (in-line) component inputs and verify them (6.5)
// access the (in-line) component outputs by emitting events selector.outputFunc.emit(payload) (6.6)
// spy on the impact of the output (could be routing, could be the component instance function being called) to verify that the event causes an effect (6.7)
// KEY: to have the template update you might need fakeAsync + flush (6.8)

describe('HeroesComponent (deep tests)', () => {
  let component: HeroesComponent;
  let spectator: Spectator<HeroesComponent>;
  let HEROES;

  HEROES = [
    { id: 1, name: 'SpiderDude', strength: 8 },
    { id: 2, name: 'Wonderful Woman', strength: 24 },
    { id: 3, name: 'SuperDude', strength: 55 },
  ];

  // setup the component (6.1)
  const createComponent = createComponentFactory({
    component: HeroesComponent,
    // (6.1.2) mock the service dependency
    providers: [
      MockProvider(HeroService, {
        getHeroes: () => of(HEROES)
      }),
    ],
    //  (6.1.5) mock the internal components, use the ng-mocks library MockComponent.
    declarations: [MockComponent(HeroComponent)],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    // (6.2) access the TS with spectator.component
    component = spectator.component;
    // (6.3) use spectator.detectChanges()  to trigger the change detection
    spectator.detectChanges();
  });

  it('sanity', () => {
    expect(component).toBeTruthy();
  });

  it('should check the properties of the inline component', () => {
    // (6.4) to access the in-line line component, query it. If there is an ngFor, use queryAll:  spectator.query/queryAll<ChildComponent>(ChildComponent)
    const heroComponent = spectator.query<HeroComponent>(HeroComponent);

    expect(heroComponent).toBeTruthy();
    // (6.5) access the (in-line) component inputs and verify them
    expect(heroComponent.hero.name).toBe('SpiderDude');
  });


  // these two tests do the same thing, but the first is much better
  it('should render each hero as a HeroComponent', () => {
    const heroComponents = spectator.queryAll<HeroComponent>(HeroComponent);
    expect(heroComponents.length).toEqual(3);

    for (let i = 0; i < heroComponents.length; i++) {
      expect(heroComponents[i].hero).toEqual(HEROES[i]);
    }
  });

  it('should render each hero as a HeroComponent', () => {
    const heroComponentDEs = spectator.debugElement.queryAll(
      By.directive(HeroComponent)
    );
    expect(heroComponentDEs.length).toEqual(3);

    for (let i = 0; i < heroComponentDEs.length; i++) {
      expect(heroComponentDEs[i].componentInstance.hero).toEqual(HEROES[i]);
    }
  });

  // these 2 tests do the same thing, but I think testing through the template is better than testing through the component

  it(`should call HeroService deleteHero when deleting a hero via via the template output emit`, () => {
    const heroServiceSpy = spectator.inject(HeroService);
    jest.spyOn(heroServiceSpy, 'deleteHero').mockReturnValue(of(null));

    // (6.6) access the (in-line) component outputs by emitting events selector.outputFunc.emit(payload)
    const heroComponents = spectator.queryAll<HeroComponent>(HeroComponent);
    heroComponents[2].delete.emit(HEROES[2]);

    // (6.7) spy on the impact of the output (could be routing, could be the component instance function being called) to verify that the event causes an effect
    expect(heroServiceSpy.deleteHero).toHaveBeenCalledWith(HEROES[2]);
  });

  it('should call HeroService deleteHero method when deleting a hero via the component delete method', () => {
    const heroServiceSpy = spectator.inject(HeroService);
    jest.spyOn(heroServiceSpy, 'deleteHero').mockReturnValue(of(null));

    // call the component's delete method
    component.delete(HEROES[2]);

    expect(heroServiceSpy.deleteHero).toHaveBeenCalledWith(HEROES[2]);
    expect(component.heroes.length).toBe(2);
  });

  it('should add a new hero to the hero list when the add button is clicked: with Spectator utilities & fakeAsync + flush, ', fakeAsync(() => {
    const newHeroName = 'Mr Ice';
    jest.spyOn(spectator.inject(HeroService), 'addHero').mockReturnValue(of({id: 5, name: newHeroName, strength: 4}));

    spectator.typeInElement(newHeroName, spectator.query('.qa-hero-input'));
    spectator.click(spectator.query('.qa-add-btn'));
    flush(); // (6.8) KEY: flush was the only way to have the template update and get 4 in-line components, not even detectChanges + tick worked!

    const heroComponents = spectator.queryAll<HeroComponent>(HeroComponent); // it is important to query the dom AFTER the flush

    expect(component.heroes.length).toBe(4);
    expect(heroComponents.length).toBe(4);

    expect(component.heroes[3].name).toBe(newHeroName);
    expect(heroComponents[3].hero.name).toBe(newHeroName);
  }));
});
