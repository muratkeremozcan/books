import { Spectator, createRoutingFactory, byText } from '@ngneat/spectator/jest';
import { HeroDetailComponent } from "./hero-detail.component";
import { MockProvider } from 'ng-mocks';
import { HeroService } from '../hero.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { fakeAsync, flush } from '@angular/core/testing';

describe('HeroDetailComponent)', () => {
  let component: HeroDetailComponent;
  let spectator: Spectator<HeroDetailComponent>;

  const createComponent = createRoutingFactory({
    component: HeroDetailComponent,
    providers: [
      MockProvider(HeroService, {
        getHero: () => of({id: 3, name: 'SuperDude', strength: 100})
      }),
    ],
    imports: [FormsModule],  // need formsModule for the template ngmodel
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    spectator.detectChanges();
  });

  it('should render hero name in a h2 tag', () => {
    expect(spectator.query('h2').textContent).toContain('SUPERDUDE');
  });

  it('should call updateHero when save is called', () => {
    const heroServiceSpy = spectator.inject(HeroService);
    jest.spyOn(heroServiceSpy, 'updateHero').mockReturnValue(of({}));

    component.save();

    expect(heroServiceSpy.updateHero).toHaveBeenCalled();
  });

  it('should call updateHero when save is called: fakeAsync', fakeAsync(() => {
    const heroServiceSpy = spectator.inject(HeroService);
    jest.spyOn(heroServiceSpy, 'updateHero').mockReturnValue(of({}));

    component.save();
    flush(); // flush() seems interchangeable with detectChanges + tick
    // spectator.detectChanges();
    // spectator.tick();

    expect(heroServiceSpy.updateHero).toHaveBeenCalled();
  }));
});
