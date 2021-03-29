import { SpectatorHttp , createHttpFactory, HttpMethod } from '@ngneat/spectator/jest';

import { Hero } from './hero';
import { HeroService } from './hero.service';


// [3] testing http
// setup the http (much leaner with spectator, and similar to other spectator setups) (3.1)
// prep hardcoded data, initiate the client request and setup the assertion that will happen, match the url w/ expectOne- for spectator add a 2nd arg HttpMethod.GET/POST etc. (3.2)
// with spectator, afterEach verify() is not needed, flush is also not needed (3.3)  flush is only needed for concurrent get requests https://www.npmjs.com/package/@ngneat/spectator#testing-services
// in error testing, define the error response and bypass the success case (3.4)
// testing save requests PUTs and POSTs and DELETEs: test the method type and for PUT and POST request body that is going out from the client ' (3.6)

describe('[3] Testing Http', () => {
  // setup is much cleaner with spectator(3.1)
  let spectator: SpectatorHttp<HeroService>;
  let heroService: HeroService;
  const createHttp = createHttpFactory(HeroService);

  // for the hardcoded data that is shared between the tests
  let expectedHeroes: Hero[];
  let hero: Hero;

  beforeEach(() => {
    spectator = createHttp();
    heroService = spectator.service;
  });

  describe('GET requests' , () => {
    beforeEach(() => {
      // (3.2.1) prepare hardcoded data that will be used as the response
      expectedHeroes = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
      ] as Hero[];
    });

    it('(3.2.2) initiate the client request and setup the assertion that will happen,(3.2.3) match the url w/ spectator.expectOne', () => {
      // (3.2.2) initiate the client request, and setup the assertion that will happen once the observable is fulfilled
      heroService.getHeroes().subscribe(
        heroes => expect(heroes).toEqual(expectedHeroes),
        fail // the error case of the observable
      );

      // (3.2.3) expect that a single request has been made which matches the given URL, using spectator.expectOne
      spectator.expectOne(heroService.heroesUrl, HttpMethod.GET);

      // note : no need to flush with spectator
    });

    it('cover the Empty Response Case', () => {
      heroService.getHeroes().subscribe(
        heroes => expect(heroes.length).toEqual(0),
        fail
      );

      spectator.expectOne(heroService.heroesUrl, HttpMethod.GET);
    });

    it('(3.4) in error testing, define the error response and bypass the success', () => {
      const msg = 'Deliberate 404';

      heroService.getHeroes().subscribe(
        heroes => fail('expected to fail'),
        error => expect(error.message).toContain(msg) // 3.4.0 in error testing, define the error response and bypass the success case
      );

      spectator.expectOne(heroService.heroesUrl, HttpMethod.GET);

      // note: the flush and the optional response object in 3.4.1 of TestBed example are not needed with spectator
    });

    // TODO: @brian how do we test multiple requests with spectator?
    // fails with:  Expected one matching request for criteria "Match method: GET, URL: api/heroes", found 3 requests
    it.skip('(3.5) cover the Multiple Request Case, and check the request length', () => {

      heroService.getHeroes().subscribe(
        heroes => expect(heroes).toEqual([]),
        fail
      );
      heroService.getHeroes().subscribe(
        heroes => expect(heroes).toEqual([{ id: 1, name: 'bob' }]),
        fail
      );
      heroService.getHeroes().subscribe(
        heroes => expect(heroes).toEqual(expectedHeroes),
        fail
      );

      const requests = spectator.expectConcurrent([
        { url: heroService.heroesUrl, method: HttpMethod.GET },
        { url: heroService.heroesUrl, method: HttpMethod.GET },
        { url: heroService.heroesUrl, method: HttpMethod.GET },
      ]);

      spectator.flushAll(requests, [[], [{ id: 1, name: 'bob' }], expectedHeroes]);

      expect(requests.length).toEqual(3); // KEY check request length
    });
  });

  describe('PUT requests', () => {

    beforeEach(() => {
      hero = { id: 1, name: 'A' } as Hero;
    });

    it('(3.6) testing PUTs: test the method type and request body that is going out from the client', () => {

      heroService.updateHero(hero).subscribe(
        data => expect(data).toEqual(hero),
        fail
      );

      const req = spectator.expectOne(heroService.heroesUrl, HttpMethod.PUT);

      expect(req.request.body.id).toEqual(1);
      expect(req.request.body.name).toEqual('A');
    });

    it('cover the Error Case, same as the GET scenario in (3.4) ', () => {
      const msg = 'Deliberate 404';

      heroService.updateHero(hero).subscribe(
        heroes => fail('expected to fail'),
        error => expect(error.message).toContain(msg) // KEY (same as GET scenario IN 3.4) in error testing, define the error response and bypass the success
      );

      spectator.expectOne(heroService.heroesUrl, HttpMethod.PUT);

      // note: the flush and the optional response object in 3.4.1 of TestBed example is not needed with spectator
    });
  });

  describe('POST requests', () => {

    beforeEach(() => {
      hero = { id: 1, name: 'A' } as Hero;
    });

    it('(3.6) testing POSTs: test the method type and request body that is going out from the client', () => {

      heroService.addHero(hero).subscribe(
        data => expect(data).toEqual(hero),
        fail
      );

      const req = spectator.expectOne(heroService.heroesUrl, HttpMethod.POST);

      expect(req.request.body.id).toEqual(1);
      expect(req.request.body.name).toEqual('A');
    });

    it('cover the Error Case, same as the GET scenario in (3.4) ', () => {
      const msg = 'Deliberate 404';

      heroService.addHero(hero).subscribe(
        heroes => fail('expected to fail'),
        error => expect(error.message).toContain(msg) // KEY (same as GET scenario IN 3.4) in error testing, define the error response and bypass the success
      );

      spectator.expectOne(heroService.heroesUrl, HttpMethod.POST);

      // note: the flush and the optional response object in 3.4.1 of TestBed example is not needed with spectator
    });
  });

  describe('DELETE requests', () => {

    beforeEach(() => {
      hero = { id: 1, name: 'A' } as Hero;
    });

    it('(3.6) testing DELETE: test the method type', () => {

      heroService.deleteHero(hero).subscribe(
        data => expect(data).toEqual(hero),
        fail
      );

      spectator.expectOne(`${heroService.heroesUrl}/1`, HttpMethod.DELETE);
    });

    it('cover the Error Case, same as the GET scenario in (3.4) ', () => {
      const msg = 'Deliberate 404';

      heroService.deleteHero(hero).subscribe(
        heroes => fail('expected to fail'),
        error => expect(error.message).toContain(msg) // KEY (same as GET scenario IN 3.4) in error testing, define the error response and bypass the success
      );

      spectator.expectOne(`${heroService.heroesUrl}/1`, HttpMethod.DELETE);

      // note: the flush and the optional response object in 3.4.1 of TestBed example is not needed with spectator
    });
  });
});
