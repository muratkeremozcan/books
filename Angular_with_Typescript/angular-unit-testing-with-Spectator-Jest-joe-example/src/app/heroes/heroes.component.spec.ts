import { HeroesComponent } from './heroes.component';
import { HeroService } from '../hero.service';
import { By } from '@angular/platform-browser';
import { HeroComponent } from '../hero/hero.component';
import { Spectator, createComponentFactory, byText } from '@ngneat/spectator/jest';
import { MockComponent, MockProvider } from 'ng-mocks';
import { of } from 'rxjs';

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

  it('should render each hero as a HeroComponent', () => {
    const heroComponentDEs = spectator.debugElement.queryAll(
      By.directive(HeroComponent)
    );
    expect(heroComponentDEs.length).toEqual(3);

    for (let i = 0; i < heroComponentDEs.length; i++) {
      expect(heroComponentDEs[i].componentInstance.hero).toEqual(HEROES[i]);
    }
  });

  it('should call HeroService deleteHero method when deleting a hero', () => {
    const heroServiceSpy = spectator.inject(HeroService);
    jest.spyOn(heroServiceSpy, 'deleteHero').mockReturnValue(of(null));
    component.heroes = HEROES;

    component.delete(HEROES[2]);

    expect(heroServiceSpy.deleteHero).toHaveBeenCalledWith(HEROES[2]);
    expect(component.heroes.length).toBe(2);
  });

  it('should check the properties of the inline component', () => {
    // (6.4) to access the in-line line component, query it. If there is an ngFor, use queryAll:  spectator.query/queryAll<ChildComponent>(ChildComponent)
    const heroComponent = spectator.query<HeroComponent>(HeroComponent);

    expect(heroComponent).toBeTruthy();
    // (6.5) access the (in-line) component inputs and verify them
    expect(heroComponent.hero.name).toBe('SpiderDude');
  });

  it(`should call heroService.deleteHero when the Hero Component's delete button is clicked`, () => {
    jest.spyOn(component, 'delete');

    // (6.6) access the (in-line) component outputs by emitting events selector.outputFunc.emit(payload)
    const heroComponents = spectator.queryAll<HeroComponent>(HeroComponent);
    heroComponents[0].delete.emit(HEROES[0]);

    // (6.7) spy on the impact of the output (could be routing, could be the component instance function being called) to verify that the event causes an effect
    expect(component.delete).toHaveBeenCalledWith(HEROES[0]);
  });

  it('should add a new hero to the hero list when the add button is clicked: 1 on 1 example', () => {
    const newHeroName = 'Mr Ice';
    jest.spyOn(spectator.inject(HeroService), 'addHero').mockReturnValue(of({id: 5, name: newHeroName, strength: 4}));

    const inputElement = spectator.debugElement.query(By.css('input')).nativeElement;
    const addButton = spectator.debugElement.queryAll(By.css('button'))[0];

    inputElement.value = newHeroName;
    addButton.triggerEventHandler('click', null);
    spectator.detectChanges();

    expect(component.heroes.length).toBe(4);
    expect(component.heroes[3].name).toBe(newHeroName);
  });

  it('should add a new hero to the hero list when the add button is clicked: with Spectator utilities ', () => {
    const newHeroName = 'Mr Ice';
    jest.spyOn(spectator.inject(HeroService), 'addHero').mockReturnValue(of({id: 5, name: newHeroName, strength: 4}));

    spectator.typeInElement(newHeroName, spectator.query('.qa-hero-input'));
    spectator.click(spectator.query('.qa-add-btn'));
    spectator.detectChanges();

    expect(component.heroes.length).toBe(4);
    expect(component.heroes[3].name).toBe(newHeroName);

    // @brian : how do we make the template update and get 4 in line components?
    // spectator.detectChanges();
    // const heroComponents = spectator.queryAll<HeroComponent>(HeroComponent);
    // expect(heroComponents.length).toBe(4);
  });

  it('should have the correct route for the first hero', () => {
    const heroComponents = spectator.queryAll<HeroComponent>(HeroComponent);

    expect(heroComponents.length).toBe(3);

    const firstHero = heroComponents[0];
    expect(firstHero.hero.name).toBe('SpiderDude');

    console.log(spectator.query('li'));
    // @brian, when we see something like this in the Dom, how do we query it? Want to click on routerLink and spy on navigation
    // "<app-hero ng-reflect-hero=\"[object Object]\"></app-hero>"

    // Joe Eames' Karma example is super contrived to provide any confidence
  });
});
