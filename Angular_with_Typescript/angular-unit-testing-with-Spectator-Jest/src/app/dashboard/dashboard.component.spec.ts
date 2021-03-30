import { Spectator, createRoutingFactory, byText } from '@ngneat/spectator/jest';
import { DashboardComponent } from './dashboard.component';
import { HeroService } from '../model/hero.service';
import { Hero } from '../model';
import { of } from 'rxjs';
import { DashboardHeroComponent } from './dashboard-hero.component';
import { MockComponent, MockProvider } from 'ng-mocks';
import { fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';


// [6] testing components that include other components, services (example[5]), and routing (example[4])
// setup the component with routing, use createRoutingFactory to auto-mock Router and ActivatedRoute (6.1). Just like (4.1)
// mock the service dependency (6.1.2), just like (5.1.2) .
// inject the service dependency:  depService = spectator.inject(DepService) (6.1.3), just like (5.1.3)
// stub the external service's return value (6.1.4), just like (5.1.4)
// KEY: mock the internal components, use the ng-mocks library MockComponent. (6.1.5)

// access the TS with spectator.component  (6.2)
// use spectator.detectChanges()  to trigger the change detection (6.3),

describe('[6] Testing components that include other components, services (example[5]), and routing (example[4])', () => {
  let component: DashboardComponent;
  let spectator: Spectator<DashboardComponent>;
  let heroServiceSpy;
  let heroService;

  const heroes: Hero[] = [
      {id: 41, name: 'Bob' },
      {id: 42, name: 'Carol' },
      {id: 43, name: 'Ted' },
      {id: 44, name: 'Alice' },
      {id: 45, name: 'Speedy' },
      {id: 46, name: 'Stealthy' }
    ];

  // setup the component with routing, use createRoutingFactory to auto-mock Router and ActivatedRoute (6.1)
  const createComponent = createRoutingFactory({
    component: DashboardComponent,
    // (6.1.5) KEY: mock the internal components, use the ng-mocks library MockComponent.
    // Instead of using CUSTOM_ELEMENTS_SCHEMA, which might hide some issues and won't help you to set inputs, outputs, etc., ng-mocks will auto mock the inputs, outputs, etc. for you
    declarations: [ DashboardComponent, MockComponent(DashboardHeroComponent) ],
    // mock the ngOnInit service observable call or set the @Input manually in each test,
    // (6.1.2) mock the service dependency,
    mocks: [HeroService],
    // IMPORTANT: as an alternative shortcut, instead of (6.1.2, 3, 4), we could also use the MockProvider way of mocking like we did in (4.2)
    // providers: [MockProvider(HeroService, {
    //   getHeroes: () => of(heroes)
    // })],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component; // (6.2) access the TS with spectator.component

    // (6.1.3) inject the service dependency:  depService = spectator.inject(DepService)
    heroServiceSpy = spectator.inject(HeroService);
    // (6.1.4) stub the external service's return value
    heroService = jest.spyOn(heroServiceSpy, 'getHeroes').mockReturnValue(of(heroes));
  });

  it('sanity', () => {
    expect(component).toBeTruthy();
  });

  it('should NOT have heroes before ngOnInit', () => {
    expect(component.heroes.length).toBe(0);
  });

  it('should HAVE heroes after ngOnInit', () => {
    spectator.detectChanges();
    expect(component.heroes.length).toBeGreaterThan(0);
  });

  it('should DISPLAY heroes', () => {
    spectator.detectChanges();

    expect(spectator.queryAll('dashboard-hero').length).toBe(4);
  });


  // continue with routing
  it('should tell ROUTER to navigate when hero clicked: fakeAsync version', fakeAsync(() => {
    spectator.detectChanges();

    tick();

    expect(spectator.query('.qa-hero-list')).toBeTruthy();

    spectator.detectChanges();
    tick();

    spectator.click('.qa-hero-list'); // TODO: @brian how to get the inner component ngFor and test a route?
    // these come as
    // <dashboard-hero class="col-1-4 qa-hero-list'" ng-reflect-hero="[object Object]"></dashboard-hero>
    // <dashboard-hero class="col-1-4 qa-hero-list" ng-reflect-hero="[object Object]"></dashboard-hero>
    // <dashboard-hero class="col-1-4 qa-hero-list" ng-reflect-hero="[object Object]"></dashboard-hero>
    // <dashboard-hero class="col-1-4 qa-hero-list" ng-reflect-hero="[object Object]"></dashboard-hero>

    // jest.spyOn(component, 'gotoDetail').mockReturnValue(null);
    // expect(component.gotoDetail).toHaveBeenCalled();
    // expect(spectator.inject(Router).navigate).toHaveBeenCalled();
  }));

  // it('should tell ROUTER to navigate when hero clicked: async whenStable version', async () => {
  //   spectator.detectChanges();

  //   await spectator.fixture.whenStable();

  //   expect(spectator.query('.qa-heroes')).toBeTruthy();

  //   spectator.click('.qa-hero');

  //   expect(spectator.inject(Router).navigateByUrl).toHaveBeenCalled();
  // });


  // TODO: convert this Karma test to spectator
  // it('should tell ROUTER to navigate when hero clicked', () => {
    // heroClick();  // trigger click on first inner <div class="hero">

    // // args passed to router.navigateByUrl() spy
    // const spy = router.navigateByUrl as jasmine.Spy;
    // const navArgs = spy.calls.first().args[0];

    // // expecting to navigate to id of the component's first hero
    // const id = comp.heroes[0].id;
    // expect(navArgs).toBe('/heroes/' + id, 'should nav to HeroDetail for first hero');
  // });

});
