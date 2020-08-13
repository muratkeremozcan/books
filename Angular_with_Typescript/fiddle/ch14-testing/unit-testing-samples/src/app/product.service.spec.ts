import { TestBed, inject } from '@angular/core/testing';
import { ProductService } from './product.service';

// [2] testing services:
// (2.1) similar to [1.1] you have to setup the service and satisfy the TS with TestBed.configureTestingModule({..})
// (2.2) KEY inject the service in the test

/*
  if in Angular apps you use the provider’s token in the class constructor to inject a service,
  in tests, the injection is done differently;
  - you explicitly invoke the inject() function in the tests
  - or use TestBed.inject() method in the setup (much better since no duplication)
*/

describe('Root app ProductService', () => {
  let service: ProductService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductService] // the service still has to be in providers
    });
    // (2.2) inject the service to the setup (better option) (with spectator, I think we do not have to this, but for services using services we inject them within the test)
    // const restSvc = spectator.inject<SitesRestService>(SitesRestService);
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // (2.2) alternative inject the service to the test (naah)
  // see how it gets: inject([ProductService, OtherService], (prodService: ProductService, otherService: OtherService) => {...})
  // it('should be created', inject([ProductService], (service: ProductService) => {
  //   expect(service).toBeFalsy();
  // }));
});
