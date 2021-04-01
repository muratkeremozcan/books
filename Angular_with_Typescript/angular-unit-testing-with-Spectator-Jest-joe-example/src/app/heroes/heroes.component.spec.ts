import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroesComponent } from './heroes.component';
import { NO_ERRORS_SCHEMA, Component, Input, Directive } from '@angular/core';
import { HeroService } from '../hero.service';
import { Hero } from '../hero';
import { By } from '@angular/platform-browser';
import { HeroComponent } from '../hero/hero.component';
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { MockComponent, MockProvider } from 'ng-mocks';
import { of } from 'rxjs';

// [6] testing components that include other components, services

describe('HeroesComponent (deep tests)', () => {
  let component: HeroesComponent;
  let spectator: Spectator<HeroesComponent>;
  let HEROES;

  HEROES = [
    { id: 1, name: 'SpiderDude', strength: 8 },
    { id: 2, name: 'Wonderful Woman', strength: 24 },
    { id: 3, name: 'SuperDude', strength: 55 },
  ];

  const createComponent = createComponentFactory({
    component: HeroesComponent,
    declarations: [ MockComponent(HeroComponent) ],
    providers: [ MockProvider(HeroService, {
        getHeroes: () => of(HEROES)
      })
    ],
    detectChanges: false
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    spectator.detectChanges();
  });

  it('sanity', () => {
    expect(component).toBeTruthy();
  });

  it('should render each hero as a HeroComponent', () => {

    const heroComponentDEs = spectator.debugElement.queryAll(By.directive(HeroComponent));
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
    const inlineComponent = spectator.query<HeroComponent>(HeroComponent);

    expect(inlineComponent).toBeTruthy();
    expect(inlineComponent.hero.name).toBe('SpiderDude');
    expect(inlineComponent.delete).toBeTruthy();
  });
});
