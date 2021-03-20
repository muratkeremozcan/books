import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';

import { Hero } from './hero';
import { HeroService } from './hero.service';


// [3] mocking external core services like Http
// to setup create an httpMock with the help of HttpTestingController from HttpClientTestingModule (3.1)
// prep hardcoded data, initiate the client request and setup the assertion that will happen, match the url w/ httpMock.expectOne, using httpMock.expectOne, (3.2)
// use .flush to send the data to the client and .error to emulate error (3.3)
// in error testing, define the error response and bypass the success case (3.4)
// cover the Multiple Request Case, and check the request length (3.5)
// testing PUTs: test the method type and request body that is going out from the client, Use req.event(new HttpResponse({ .. })) to respond' (3.6)
// cover the custom req.error(errorEvent) case for when something goes wrong at the network level (3.7)

describe.skip('[3] Testing Http with TestBed', () => {
  let heroService: HeroService;
  let httpMock: HttpTestingController;

  // for the hardcoded data that is shared between the tests
  let expectedHeroes: Hero[];
  let updatedHero: Hero;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule // (3.1.1) HttpClientTestingModule in imports
      ],
      providers: [HeroService]
    });

    // (3.1.2) inject the service under test (just like 2.2 )
    heroService = TestBed.inject(HeroService);
    // (3.1.3) mock http using  HttpTestingController
    httpMock = TestBed.inject(HttpTestingController);
    // (service injection similar to other external services, the key difference is the module being imported)
    // (HttpTestingController doesn’t make an HTTP request but allows you to emulate it using hardcoded data.)
  });

  // verify() is used to assert that there are no outstanding http requests
  afterEach(() => httpMock.verify());

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
      heroService.getHeroes().subscribe(
        heroes => expect(heroes).toEqual(expectedHeroes),
        fail // the error case of the observable
      );

      // (3.2.3) expect that a single request has been made which matches the given URL, using httpMock.expectOne
      const req = httpMock.expectOne(heroService.heroesUrl);
      // (3.3) use .flush to respond to the client
      req.flush(expectedHeroes);

      expect(req.request.method).toEqual('GET'); // extra
    });

    it('cover the Empty Response Case', () => {
      heroService.getHeroes().subscribe(
        heroes => expect(heroes.length).toEqual(0),
        fail
      );

      const req = httpMock.expectOne(heroService.heroesUrl);

      req.flush([]); // we control the response here
    });

    it('(3.4) in error testing, define the error response and bypass the success', () => {
      const msg = 'Deliberate 404';

      heroService.getHeroes().subscribe(
        heroes => fail('expected to fail'),
        error => expect(error.message).toContain(msg) // 3.4.0 in error testing, define the error response and bypass the success case
      );

      const req = httpMock.expectOne(heroService.heroesUrl);

      // 3.4.1 flush with the optional object: status and message
      req.flush(msg, {status: 404, statusText: 'Not Found'});
    });

    it('(3.5) cover the Multiple Request Case, and check the request length', () => {
      heroService.getHeroes().subscribe(); // KEY multiple subscribes
      heroService.getHeroes().subscribe();
      heroService.getHeroes().subscribe(
        heroes => expect(heroes).toEqual(expectedHeroes),
        fail
      );

      const requests = httpMock.match(heroService.heroesUrl);

      // Respond to each request with different mock hero results
      requests[0].flush([]);
      requests[1].flush([{ id: 1, name: 'bob' }]);
      requests[2].flush(expectedHeroes);

      expect(requests.length).toEqual(3); // KEY check request length
    });
  });

  describe('PUT requests', () => {

    beforeEach(() => {
      updatedHero = { id: 1, name: 'A' } as Hero;
    });

    it('(3.6) testing PUTs: test the method type and request body that is going out from the client, Use req.event(new HttpResponse({ .. })) to respond', () => {

      heroService.updateHero(updatedHero).subscribe(
        data => expect(data).toEqual(updatedHero),
        fail
      );

      const req = httpMock.expectOne(heroService.heroesUrl);
      // (3.6.0) KEY with testing PUTs: test the method type and request body that is going out from the client
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(updatedHero);

      // (3.6.1) KEY with PUT: use req.event(new HttpResponse({})) instead of req.flush()
      req.event(
        new HttpResponse({ status: 200, statusText: 'OK', body: updatedHero })
      );
    });

    it('cover the Error Case, same as the GET scenario in (3.4) ', () => {
      const msg = 'Deliberate 404';

      heroService.updateHero(updatedHero).subscribe(
        heroes => fail('expected to fail'),
        error => expect(error.message).toContain(msg) // KEY (same as GET scenario IN 3.4) in error testing, define the error response and bypass the success
      );

      const req = httpMock.expectOne(heroService.heroesUrl);

      // KEY: (same as GET scenario) flush with the optional object: status and message
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('(3.7) cover the custom req.error(errorEvent) case for when something goes wrong at the network level', () => {
      const msg = 'simulated network error';

      heroService.updateHero(updatedHero).subscribe(
        heroes => fail('expected to fail'),
        error => expect(error.message).toContain(msg)
      );

      const req = httpMock.expectOne(heroService.heroesUrl);

      // (3.7.0) Create mock ErrorEvent, raised when something goes wrong at the network level. Connection timeout, DNS error, offline, etc
      const errorEvent = new ErrorEvent('so sad', {
        message: msg,
        // The rest of this is optional and not used.
        // Just showing that you could provide this too.
        filename: 'HeroService.ts',
        lineno: 42,
        colno: 21
      });

      // (3.7.1): Respond with mock error
      req.error(errorEvent);
    });
  });
});
