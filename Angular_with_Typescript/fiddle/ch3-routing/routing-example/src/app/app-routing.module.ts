import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home-component';
import { ProductComponent } from './product/product-component';


/* CLI commands used

ng new routing-example
ng g c home
ng g c product

we create the components, and define the routes at app-routing-module.ts

then, all we need is to reference the routes(which are linked to components) at the html
[routerLink]=['pathValue']
and use <router-outlet> to display the content of the component linked to that route
*/

// You configure routes in an array of objects of type Route
const routes: Routes = [
  { // if the path after the base URL is empty, render the HomeComponent in <router-outlet>
    path: '', component: HomeComponent
  },
  { // if the path contains 'product' fagrment, render the ProductDetailComponent in <router-outlet>
    path: 'product', component: ProductComponent
  }
];


// remember: you saw @NgModule decorator being used at app.module.ts
// at app.module.ts, the @NgModule decorator lists all the components and other articfacts that should be included in this module

// route configuration is done at module level, and we can add to the @NgModule decorator at app-routing.module.ts
// we could have it all happen at app.module.ts, but it is nicer and the default CLI behavior to have a seperate file for routing

// adds the route configuration to @NgModule
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
