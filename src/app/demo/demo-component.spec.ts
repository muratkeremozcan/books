import {
  DemoModule,
  BankAccountComponent, BankAccountParentComponent,
  LightswitchComponent,
  Child1Component, Child2Component, Child3Component,
  ExternalTemplateComponent,
  InputComponent,
  IoComponent, IoParentComponent,
  MyIfComponent, MyIfChildComponent, MyIfParentComponent,
  NeedsContentComponent, ParentComponent,
  TestProvidersComponent, TestViewProvidersComponent,
  ReversePipeComponent, ShellComponent
} from './demo';
import { Spectator, createComponentFactory, byText } from '@ngneat/spectator/jest';

// [1] unit testing components
// setup the component much less overhead with spectator (1.1)
// access the TS with spectator.component  (1.2)
// use spectator.detectChanges()  to trigger the change detection (1.3), (do not have to do it always)
// use DOM testing library convenience methods:  https://github.com/ngneat/spectator#queries' (1.4)


describe('Child1Component', () => {

  it('should create a component with inline template', () => {

    const spectator: Spectator<Child1Component> = createComponentFactory({
      component: Child1Component,
    })();

    expect(spectator.query(byText('Child'))).toBeDefined();
  });

  it('should create a component with external template', () => {

    const spectator: Spectator<ExternalTemplateComponent> = createComponentFactory({
      component: ExternalTemplateComponent,
    })();

    expect(spectator.query(byText('from external template'))).toBeDefined();
  });

  it('should allow changing members of the component', () => {

    const spectator: Spectator<MyIfComponent> = createComponentFactory({
      component: MyIfComponent,
      detectChanges: false
    })();
    const component = spectator.component;

    expect(spectator.query(byText('MyIf()'))).toBeDefined();

    component.showMore = true;
    spectator.detectChanges();
    expect(spectator.query(byText('MyIf(More)'))).toBeDefined();
  });


});
