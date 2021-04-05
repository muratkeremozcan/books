import { fakeAsync } from '@angular/core/testing';
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { CanvasComponent } from './canvas.component';


// To make canvas work, had to add an npm package jest-canvas-mock
// Also had to add a specific import to our src/setupTests.ts file: import 'jest-canvas-mock'

describe('Canvas component', () => {
  let component: CanvasComponent;
  let spectator: Spectator<CanvasComponent>;

  const createComponent = createComponentFactory({
    component: CanvasComponent,
    detectChanges: false
  });

  (window as any).__zone_symbol__FakeAsyncTestMacroTask = [
    {
      source: 'HTMLCanvasElement.toBlob',
      callbackArgs: [{size: 200}],
    },
  ];

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('sanity', fakeAsync(() => {
    spectator.detectChanges();

    expect(component.blobSize).toBe(0);
    expect(spectator.fixture).toMatchSnapshot();

    spectator.tick();
    expect(component.blobSize).toBeGreaterThan(0);
    expect(spectator.fixture).toMatchSnapshot();
  }));
});
