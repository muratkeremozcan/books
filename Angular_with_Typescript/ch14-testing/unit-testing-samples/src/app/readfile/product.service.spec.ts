import { TestBed, async } from '@angular/core/testing';
// (3.1.1) import  HttpClientTestingModule, HttpTestingController
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import {Product} from './product';

// [3] mocking external core services like Http
// to setup create an httpMock with the help of HttpTestingController from HttpClientTestingModule (3.1)
// test the TS function making the http call, using httpMock.expectOne, (3.2)
// use .flush to send the data to the client and .error to emulate error (3.3)

describe('Readfile app ProductService', () => {
  let productService: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule // (3.1.2) HttpClientTestingModule in imports
      ],
      providers: [
        ProductService
      ]
    });

    productService = TestBed.get(ProductService);
    // (3.1.3) mock http using  HttpTestingController
    // (service injection similar to other external services, the key difference was the module being imported)
    // (HttpTestingController doesn’t make an HTTP request but allows you to emulate it using hardcoded data.)
    // with spectator just put it under mocks array under createServiceFactory
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should successfully get products', async(() => {
    const productData: Product[] = [{ "id":"0", "title": "First Product", "price": 24.99 }]; // (3.2.1) prepare hardcoded data
    productService.getProducts() // (3.2.2) setup the subscription with a canned response
      .subscribe(
        res => expect(res).toEqual(productData)
      );

    // test the TS function making the http call, using httpMock.expectOne (3.2.3)
    let productsRequest = httpMock.expectOne('/data/products.json');
    // (3.3) use .flush to send the data to the client
    productsRequest.flush(productData); // this is a good debug point where we flush
  }));

  it('should return error if request for products failed', async( () => {
    const errorType = 'CANNOT_LOAD_PRODUCTS' ;  // (3.2.1) prepare hardcoded error data
    productService.getProducts() // (3.2.2) setup the subscription . For error use .error.type
      .subscribe(() => {},
          errorResponse => expect(errorResponse.error.type).toEqual(errorType)
      );

    // test the TS function making the http call, using httpMock.expectOne (3.2.3)
    let productsRequest = httpMock.expectOne('/data/products.json');

    // (3.3) use .error to send the error to the client
    productsRequest.error(new ErrorEvent (errorType) );
  }));

  // verify() is used to assert that there are no outstanding http requests
  afterEach(() => httpMock.verify());
});

/* note about spyOn
Jasmine offers a spyOn() function that could intercept the specified function (for example, getProducts()),
 where you could just return a stub object with the expected data. But using such a spy wouldn’t make an HTTP request.
 Because you use HttpTestingController, the HTTP request is made and will be intercepted by HttpTestingController,
 which won’t be making a real HTTP request to read products.json but will take the hardcoded product data and send it through the HTTP machinery.
*/