import { ProductService } from './product.service';
import { SpectatorService , createServiceFactory } from '@ngneat/spectator';

// [2] [spectator version] testing services:
// (2.1) similar to [1.1]  setup the service
// (2.2) inject the service in the test

describe('Root app ProductService', () => {
  // (2.1) setup the service... replaces TestBed.configureTestingModule({...})
  let spectator: SpectatorService <ProductService>;
  const createService = createServiceFactory(ProductService);

  let service: ProductService;

  beforeEach(() => {
    spectator = createService(); // (2.1) setup the service
    service = spectator.inject(ProductService);  // (2.2) inject the service
    // note about services using services:  const restSvc = spectator.inject<SitesRestService>(SitesRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
