import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';

// [1] unit test at a high level
// setup the component with TestBed.configureTestingModule({..}) (satisfy the TS), and create the component with TestBed.createComponent(..) before each test (1.1)
// test/access the TS with fixture.debugElement.componentInstance (1.2)
// test/access the template with fixture.debugElement.nativeElement (1.4), using fixture.detectChanges() to trigger the change (1.3)
// assert the results. Easy with the TS, but for the template utilize .querySelector

describe('Root app AppComponent', () => {
  beforeEach(async(() => {
    // (1.1.1) setup the component
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ]
    }).compileComponents();
  }));


  let fixture, app;
  beforeEach(() => {
    // (1.1.2) TestBed.createComponent(): returns a ComponentFixture object which gives access to the TS & the template
    fixture = TestBed.createComponent(AppComponent);
    // (1.2) fixture.debugElement.componentInstance gives access to the TS
    app = fixture.debugElement.componentInstance;
  });
  it('should create the app', async(() => {
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'my app'`, async(() => {
    expect(app.title).toEqual('my app');
  }));
  it('should render title in a h1 tag', async(() => {
    // (1.3) detectChanges() : to update the bindings / trigger change detection
    fixture.detectChanges();
    // (1.3) fixture.debugElement.nativeElement: gives access to the template. Used in conjunction with fixture.detectChanges()
    const compiled = fixture.debugElement.nativeElement;
    // (1.4) .querySelector(...) to query the CSS, .textContent to access the text
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to my app!');
  }));
  it('should render updated title', async(() => {
    app.title = 'updated app!';
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to updated app!');
  }));
});

  /* notes
  If you want change detection to be triggered automatically, you can configure the testing module with the provider for the ComponentFixtureAutoDetect service.
  Although this seems to be a better choice than manually invoking detectChanges(), this service only notices the asynchronous activities
  May be the default in spectator and you do not have to provide ComponentFixtureAutoDetect service

  you have to use async functions if the TS and the css are in seperate files (reading the css file is a async operation)

  any service a component uses should be mocked, but also tested seperately for the service itself

  with spectator services we use createServiceFactory, with components we use createComponentFactory
  ex:

  describe('CanActivate Guard', () => {
  let spectator: SpectatorService<CanActivateGetSiteById>;
  const createService = createServiceFactory({
    service: CanActivateGetSiteById,
    mocks: [SessionStoreService, SitesRestService, Router]
  });

  beforeEach(() => (spectator = createService()));

  it('should activate when a valid site is retrieved', () => {
    const restSvc = spectator.inject<SitesRestService>(SitesRestService);
    jest.spyOn(restSvc, 'getSiteById').mockReturnValue(of({}));
  */