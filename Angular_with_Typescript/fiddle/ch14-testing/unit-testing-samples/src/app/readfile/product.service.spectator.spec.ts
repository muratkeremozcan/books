import { async } from '@angular/core/testing';
import { ProductService } from './product.service';
import {Product} from './product';
// (3.1.1) import  createHttpFactory, HttpMethod from spectator
import { SpectatorHttp , createHttpFactory, HttpMethod } from '@ngneat/spectator';

// [3] [spectator version] mocking external core services like Http
// setup the http (much leaner with spectator, and similar to other spectator setups) (3.1)
// test the TS function making the http call, using httpMock.expectOne - for spectator add a 2nd arg HttpMethod.GET/POST etc. (3.2)
// afterEach verify() is not needed, flush is only needed for concurrent get requests https://www.npmjs.com/package/@ngneat/spectator#testing-services

describe('Readfile app ProductService', () => {
  let spectator: SpectatorHttp<ProductService>;
  const createHttp = createHttpFactory(ProductService);

  beforeEach(() => spectator = createHttp());

  it('should successfully get products', async(() => {
    const productData: Product[] = [{ "id":"0", "title": "First Product", "price": 24.99 }]; // (3.2.1) prepare hardcoded data
    spectator.service.getProducts() // (3.2.2) subscribe to the response & assert
      .subscribe(
        res => expect(res).toEqual(productData)
      );

    // test the TS function making the http call, using httpMock.expectOne - for spectator add a 2nd arg HttpMethod.GET/POST etc (3.2.3)
    spectator.expectOne('/data/products.json', HttpMethod.GET);
  }));

  it('should return error if request for products failed', async( () => {
    const errorType = 'CANNOT_LOAD_PRODUCTS' ;  // (3.2.1) prepare hardcoded error data
    spectator.service.getProducts() // (3.2.2) subscribe to the response & assert . For error use .error.type
      .subscribe(() => {},
          errorResponse => expect(errorResponse.error.type).toEqual(errorType)
      );

    // test the TS function making the http call, using httpMock.expectOne - for spectator add a 2nd arg HttpMethod.GET/POST etc(3.2.3)
    spectator.expectOne('/data/products.json', HttpMethod.GET);
  }));
});
