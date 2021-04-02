import { SpectatorHttp , createHttpFactory, HttpMethod } from '@ngneat/spectator/jest';

import { HeroService } from './hero.service';
import { MessageService } from './message.service';

// [3] testing http

describe('getHero', () => {
  // setup is much cleaner with spectator(3.1)
  let spectator: SpectatorHttp<HeroService>;
  let heroService: HeroService;
  const createHttp = createHttpFactory({
    service: HeroService,
    mocks: [MessageService]
  });

  beforeEach(() => {
    spectator = createHttp();
    heroService = spectator.service;
  });

  it('should call get with the correct URL', () => {
    let expectedHero;

    heroService.getHero(4).subscribe(hero => expectedHero = hero);

    spectator
      .expectOne(`${heroService.heroesUrl}/4`, HttpMethod.GET)
      .flush(4);

    expect(expectedHero).toBe(4);
  });

});
