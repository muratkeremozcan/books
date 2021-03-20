import { SpectatorHttp , createHttpFactory, HttpMethod } from '@ngneat/spectator/jest';

import { Hero } from './hero';
import { HeroService } from './hero.service';


// [3] [spectator version] mocking external core services like Http
// setup the http (much leaner with spectator, and similar to other spectator setups) (3.1)
// prep hardcoded data, initiate the client request and setup the assertion that will happen, match the url w/ expectOne- for spectator add a 2nd arg HttpMethod.GET/POST etc. (3.2)
// with spectator, afterEach verify() is not needed, flush is also not needed (3.3)  flush is only needed for concurrent get requests https://www.npmjs.com/package/@ngneat/spectator#testing-services
// in error testing, define the error response and bypass the success case (3.4)
// cover the Multiple Request Case, and check the request length (3.5)
// testing PUTs: test the method type and request body that is going out from the client, Use req.event(new HttpResponse({ .. })) to respond' (3.6)

describe('[3] Testing Http with Spectator', () => {
  // setup is much cleaner with spectator(3.1)
  let spectator: SpectatorHttp<HeroService>;
  const createHttp = createHttpFactory(HeroService);

  // for the hardcoded data that is shared between the tests
  let expectedHeroes: Hero[];
  let updatedHero: Hero;

  beforeEach(() => spectator = createHttp());

  describe('GET requests' , () => {

    beforeEach(() => {
      // (3.2.1) prepare hardcoded data that will be used as the response
      expectedHeroes = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
      ] as Hero[];
    });

    it('(3.2.2) initiate the client request and setup the assertion that will happen,(3.2.3) match the url w/ httpMock.expectOne, (3.3) use .flush to respond to the client ', () => {

      // (3.2.2) initiate the client request, and setup the assertion that will happen once the observable is fulfilled
      spectator.service.getHeroes().subscribe(
        heroes => expect(heroes).toEqual(expectedHeroes),
        fail // the error case of the observable
      );

      // (3.2.3) expect that a single request has been made which matches the given URL, using httpMock.expectOne
      spectator.expectOne(spectator.service.heroesUrl, HttpMethod.GET);

      // note : no need to flush with spectator
    });

    it('cover the Empty Response Case', () => {
      spectator.service.getHeroes().subscribe(
        heroes => expect(heroes.length).toEqual(0),
        fail
      );

      spectator.expectOne(spectator.service.heroesUrl, HttpMethod.GET);
    });

    it('(3.4) in error testing, define the error response and bypass the success', () => {
      const msg = 'Deliberate 404';

      spectator.service.getHeroes().subscribe(
        heroes => fail('expected to fail'),
        error => expect(error.message).toContain(msg) // 3.4.0 in error testing, define the error response and bypass the success case
      );

      spectator.expectOne(spectator.service.heroesUrl, HttpMethod.GET);

      // note: the flush and the optional response object in 3.4.1 of TestBed example are not needed with spectator
    });

    xit('(3.5) cover the Multiple Request Case, and check the request length', () => {
      // TODO: how do we test multiple requests with spectator
      // could not make the concurrency example work in this 1:1 conversion to https://www.npmjs.com/package/@ngneat/spectator#testing-services

      // spectator.service.getHeroes().subscribe(); // KEY multiple subscribes
      // spectator.service.getHeroes().subscribe();
      // spectator.service.getHeroes().subscribe(
      //   heroes => expect(heroes).toEqual(expectedHeroes),
      //   fail
      // );

      // const requests = httpMock.match(spectator.service.heroesUrl);

      // // Respond to each request with different mock hero results
      // requests[0].flush([]);
      // requests[1].flush([{ id: 1, name: 'bob' }]);
      // requests[2].flush(expectedHeroes);

      // expect(requests.length).toEqual(3, 'calls to getHeroes()'); // KEY check request length
    });
  });

  describe('PUT requests', () => {

    beforeEach(() => {
      updatedHero = { id: 1, name: 'A' } as Hero;
    });

    it('(3.6) testing PUTs: test the method type and request body that is going out from the client, Use req.event(new HttpResponse({ .. })) to respond', () => {

      spectator.service.updateHero(updatedHero).subscribe(
        data => expect(data).toEqual(updatedHero),
        fail
      );

      spectator.expectOne(spectator.service.heroesUrl, HttpMethod.PUT);

      // TODO: how do we test the request body and http response with spectator?

      // (3.6.0) KEY with testing PUTs: test the method type and request body that is going out from the client
      // expect(req.request.method).toEqual('PUT');
      // expect(req.request.body).toEqual(updatedHero);

      // (3.6.1) KEY with PUT: use req.event(new HttpResponse({})) instead of req.flush()
      // req.event(
      //   new HttpResponse({ status: 200, statusText: 'OK', body: updatedHero })
      // );
    });

    it('cover the Error Case, same as the GET scenario in (3.4) ', () => {
      const msg = 'Deliberate 404';

      spectator.service.updateHero(updatedHero).subscribe(
        heroes => fail('expected to fail'),
        error => expect(error.message).toContain(msg) // KEY (same as GET scenario IN 3.4) in error testing, define the error response and bypass the success
      );

      spectator.expectOne(spectator.service.heroesUrl, HttpMethod.PUT);

      // note: the flush and the optional response object in 3.4.1 of TestBed example is not needed with spectator
    });

    it('(3.7) cover the custom req.error(errorEvent) case for when something goes wrong at the network level', () => {
      const msg = 'simulated network error';

      spectator.service.updateHero(updatedHero).subscribe(
        heroes => fail('expected to fail'),
        error => expect(error.message).toContain(msg)
      );

      spectator.expectOne(spectator.service.heroesUrl, HttpMethod.PUT);
    });
  });
});
