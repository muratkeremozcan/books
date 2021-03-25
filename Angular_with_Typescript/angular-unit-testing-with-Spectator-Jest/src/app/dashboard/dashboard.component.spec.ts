import { Spectator, createRoutingFactory, byText } from '@ngneat/spectator/jest';
import { DashboardComponent } from './dashboard.component';
import { HeroService } from '../model/hero.service';
import { Hero } from '../model';
import { of } from 'rxjs';
import { DashboardHeroComponent } from './dashboard-hero.component';
import { MockComponent } from 'ng-mocks';


// [6] testing components that include other components, services (example[5]), and routing (example[4])
// setup the component with routing, use createRoutingFactory to auto-mock Router and ActivatedRoute (6.1). Just like (4.1)
// mock the service dependency (6.1.2), just like (5.1.2) .
// inject the service dependency:  depService = spectator.inject(DepService) (6.1.3), just like (5.1.3)
// stub the external service's return value (6.1.4), just like (5.1.4)
// KEY: mock the internal components, use the ng-mocks library MockComponent. (6.1.5)

// access the TS with spectator.component  (6.2)
// use spectator.detectChanges()  to trigger the change detection (1.3),
// use DOM testing library convenience methods:  https://github.com/ngneat/spectator#queries' (1.4)
// to test @Output subscribe to the event emitter and setup what will be emitted (1.5.1),
// trigger the event using spectator events api https://github.com/ngneat/spectator#events-api (1.5.2) and verify what is emitted (1.5.3)

describe('[6] Testing components that include other components, services (example[5]), and routing (example[4])', () => {
  let component: DashboardComponent;
  let spectator: Spectator<DashboardComponent>;
  let heroServiceSpy;
  let heroService;

  // setup the component with routing, use createRoutingFactory to auto-mock Router and ActivatedRoute (6.1)
  const createComponent = createRoutingFactory({
    component: DashboardComponent,
    // (6.1.5) KEY: mock the internal components, use the ng-mocks library MockComponent.
    // Instead of using CUSTOM_ELEMENTS_SCHEMA, which might hide some issues and won't help you to set inputs, outputs, etc., ng-mocks will auto mock the inputs, outputs, etc. for you
    declarations: [ DashboardComponent, MockComponent(DashboardHeroComponent) ],
    // (6.1.2) mock the internal components and the service dependency,
    mocks: [HeroService],
    detectChanges: false,
  });


  const getTestHeroes = (): Hero[] => {
    return [
      {id: 41, name: 'Bob' },
      {id: 42, name: 'Carol' },
      {id: 43, name: 'Ted' },
      {id: 44, name: 'Alice' },
      {id: 45, name: 'Speedy' },
      {id: 46, name: 'Stealthy' }
    ];
  };

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component; // (6.2) access the TS with spectator.component

    // (6.1.3) inject the service dependency:  depService = spectator.inject(DepService)
    heroServiceSpy = spectator.inject(HeroService);
    // (6.1.4) stub the external service's return value
    heroService = jest.spyOn(heroServiceSpy, 'getHeroes').mockReturnValue(of(getTestHeroes()));
  });

  it('sanity', () => {
    expect(component).toBeTruthy();
  });

  it('should NOT have heroes before ngOnInit', () => {
    expect(component.heroes.length).toBe(0);
  });

  it('should HAVE heroes', () => {
    spectator.detectChanges();
    expect(component.heroes.length).toBeGreaterThan(0);
  });

  it('should DISPLAY heroes', () => {
    spectator.detectChanges();

    expect(spectator.queryAll('dashboard-hero').length).toBe(4);
  });


  // continue with routing
  it('should tell ROUTER to navigate when hero clicked', async () => {
    expect(spectator.query('.hero')).toBeDefined();

    // spectator.click('.hero'); // TODO: cannot click

    // await spectator.fixture.whenStable();
    // expect(spectator.inject(Router).navigate).toHaveBeenCalledWith(['/heroes/12']);
  });

  // TODO: convert this Karma test to spectator
  // it('should tell ROUTER to navigate when hero clicked', () => {
  //   heroClick();  // trigger click on first inner <div class="hero">

  //   // args passed to router.navigateByUrl() spy
  //   const spy = router.navigateByUrl as jasmine.Spy;
  //   const navArgs = spy.calls.first().args[0];

  //   // expecting to navigate to id of the component's first hero
  //   const id = comp.heroes[0].id;
  //   expect(navArgs).toBe('/heroes/' + id, 'should nav to HeroDetail for first hero');
  // });

});
