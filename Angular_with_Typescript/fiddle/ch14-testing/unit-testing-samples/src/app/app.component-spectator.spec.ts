import { async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Spectator, createComponentFactory } from '@ngneat/spectator';

// [1] [spectator version] unit test at a high level
// setup the component - much less overhead with spectator (1.1)
// test/access the TS with spectator.component (1.2)
// test/access the template with spectator.element (1.3), using spectator.detectChanges() to trigger the change if there is one (1.4)
// assert the results. Easy with the TS, but for the template utilize .querySelector (same)

describe('Root app AppComponent', () => {

  // 3 things were key in the vanilla Angular unit test
  // TestBed.configureTestingModule({...}) &  fixture = TestBed.createComponent(componentName)  : to setup the component (1.1)
  // fixture.debugElement.componentInstance  : to access the TS  (1.2)
  // fixture.debugElement.nativeElement   : to access the DOM   (1.3)

  // here is the spectator comparison:
  // (1.1) setup the component... TestBed.configureTestingModule({..})
  let spectator: Spectator<AppComponent>;
  const createComponent = createComponentFactory(AppComponent);

  let fixture, app, compiled;
  beforeEach(() => {
    spectator = createComponent();    // (1.1) setup the component.. TestBed.configureTestingModule({..})
    fixture = spectator.fixture;      // (extra info) not even used since we can access component and element! But for comparison this was  fixture = TestBed.createComponent(AppComponent);
    app = spectator.component;        // (1.2) access the TS....      app = fixture.debugElement.componentInstance
    compiled = spectator.element;     // (1.3) access the DOM....     compiled = fixture.debugElement.nativeElement
  });

  it('should create the app', async(() => {
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'my app'`, async(() => {
    expect(app.title).toEqual('my app');
  }));
  it('should render title in a h1 tag', async(() => {
    // no need to use detectChanges() unless something is actually being changed
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to my app!');
  }));
  it('should render updated title', async(() => {
    app.title = 'updated app!';
    spectator.detectChanges(); // (1.4)
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to updated app!');
  }));
});
