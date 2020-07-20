import { Component } from '@angular/core';
import { ProductService, Product } from "./product.service";

@Component({
  selector: 'di-product-page',
  template: `<div>
  <h1>Product Details</h1>
  <h2>Title: {{product.title}}</h2>
  <h2>Description: {{product.description}}</h2>
  <h2>Price: \${{product.price}}</h2>
</div>`,

  // Specifies ProductService as a token (in Angular, an object with a unique ID)
  // instructs Angular to provide an instance of the ProductService class when ProductComponent is created.
  providers: [ProductService]
  // long version :   providers:[{provide: ProductService, useClass: ProductService}].
})

export class ProductComponent {
  product: Product;

  // the component can request the injection of the service by declaring the constructor argument with a type
  // usually the argument is given the same name as the service being injected
  constructor(productService: ProductService) {
  // longer way:
  // constructor(@Inject(ProductService) productService)

    this.product = productService.getProduct();
  }
}
/* (1)
Dependency Injection (DI)

If object A depends on an object B, object A won’t explicitly use the new operator to instantiate B. Rather, it will have B injected
Because object A does not want to be in control of creating instances and is ready to let the framework control this process.

Here Angular has the role of Inversion of Control (IoC) container and implements DI to provide the required objects
Benefits:
- loose coupling
- easier to test

In Angular either services (no UI, only business logic) or constants are injected
A service can be injected in a component, another service or a @NgModule decorator for global access by all components

*/