import { Component, OnInit } from '@angular/core';

@Component({
  // app- is the default prefix for apps
  // you can change the prefix with: ng g c product -prefix hello
  selector: 'app-product', 
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
 // OnInit is one of the lifecycle interfaces that require the implementation of ngOnInit().
export class ProductComponent implements OnInit {

  constructor() { }

  // ngOnInit is a lifecyle method
  // If implemented, ngOnInit() is invoked after the code in the constructor
  ngOnInit() {
  }

}


/* Anguler CLI commands

ng g c — Generates a new component
ng g s — Generates a new service
ng g d — Generates a new directive
ng g m — Generates a new module
ng g application — Generates a new app within the same project
ng g library — Starting with Angular 6, you can generate a library project


ng g c product - will generate four files for a new product component in the src/app/product directory
and add the ProductComponent class to the declarations property of @NgModule

ng g s product - will generate the file product.service.ts containing a class decorated with @Injectable
and the file product.service.spec.ts in the src/app directory

*/
