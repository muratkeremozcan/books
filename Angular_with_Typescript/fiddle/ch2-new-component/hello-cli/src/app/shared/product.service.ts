import { Injectable } from '@angular/core';

// (1.2) Angular services : think of services as components w/o UIs, where the business logic resides
// services take the @Injectable decorator

@Injectable({
  // provideIn: 'root' allows you to skip the step of specifying the service in the providers property of the NgModule() decorator.
  providedIn: 'root'
})
export class ProductService {

  // To have Angular instantiate and inject this service into any component,
  // you have to add the following argument to the component’s constructor:
  constructor(productService: ProductService) {
    // start using the service, e.g. productService.getMyData();
  }
}

/*

 ng g s shared/product

*/
