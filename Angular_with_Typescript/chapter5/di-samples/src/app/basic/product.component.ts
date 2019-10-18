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
  // what are the benefits of having objects injected versus instantiating them with a new operator?
  // DI helps you write code in a loosely coupled way and makes your code more testable and reusable.
  // if the service being injected vs instantiated  is replaced, with DI there is no need to make changes at the component

  // In Angular, you inject services or constants. The services are instances of TypeScript
  // classes that don’t have a UI and just implement the business logic of your app. Con-
  // stants can be any value. Typically, you’ll be injecting either Angular services (such as
  // Router or ActivatedRoute) or your own classes that communicate with servers

  // A provider is an instruction to Angular about how to create an instance of an object
  // You map tokens to values for DI by specifying providers.
  providers: [ProductService] // specify the ProductService token (arbitrary key representing an object to be injected) as a provider for injection

})
// The next question is, when is the instance of the service created? That depends on
// the decorator in which you specified the provider for this service. In listing 5.1, you
// specify the provider inside the @Component() decorator . This tells Angular to create
// an instance of ProductService when ProductComponent is created. If you specify
// ProductService in the providers property inside the @NgModule() decorator , then
// the service instance would be created on the app level as a singleton so all components could reuse it.


  // you can specify a provider object for this class on the application level in the @NgModule() decorator, like this:
  //  @NgModule({
  //   ...
  //   providers: [{provide: ProductService, useClass: ProductService}]
  //   })

  //   When the token name is the same as the class name, you can use the shorter notation
  //
  //   @NgModule({
  //   ...
  //   providers: [ProductService]
  //   })

  // constructor(productService: ProductService)
  // There’s an alternative and more verbose syntax to specify the token using the decorator @Inject():
  // constructor(@Inject(ProductService) productService)

//   The providers line instructs the injector as follows: “When you need to construct an
// object that has an argument of type ProductService, create an instance of the regitered class
// for injection into this object.” When Angular instantiates a component that
// has the ProductService token as an argument of the component’s constructor, it’ll
// either instantiate and inject ProductService or just reuse the existing instance and
// inject it. In this scenario, we’ll have a singleton instance of the service for the entire
// application.

export class ProductComponent {
  product: Product;

  constructor(productService: ProductService) { // injects the object represented by the ProductService token

    this.product = productService.getProduct(); // uses the API of the injected object
  }
}
