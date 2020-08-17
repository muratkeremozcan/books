import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home-component';
import { ProductComponent } from './product/product-component';
import { NotFoundComponent } from './not-found/not-found.component';




// [1] base routing example:  we create the components, and define the routes at app-routing-module.ts
// and use <router-outlet> to display the content of the component linked to that route.
// then we navigate with links or clicks+programmatic nav

// high level:
// (1.1) at app-routing-module.ts configure routes in an array of objects of type Route
// (1.2) at the template (root app.component.html), reference these routes. You have 2 options
// link reference:  <a> [routerLink]=['valueOfPath']  </a>
// programmatical reference (button usually): a custom function   this.router.navigate([`pathAsString`]);
// (1.3) at the template, use <router-outlet> to display the specified component
const routes: Routes = [
  { // if the path after the base URL is empty, render the HomeComponent in <router-outlet>
    path: '', component: HomeComponent
  },
  {
    // KEY note about route parameters: add on with /: to  define what the route parameter will be, 'id' in this case
    path: 'product/:id', component: ProductComponent
  },
  { // an application component that will be displayed whenever the application can’t find the matching component.
    path: '**', component: NotFoundComponent
  }
];

// remember: you saw @NgModule decorator being used at app.module.ts
// at app.module.ts, the @NgModule decorator lists all the components and other articfacts that should be included in this module

// route configuration is also done at module level, and we can add to the @NgModule decorator at app-routing.module.ts
// we could have it all happen at app.module.ts, but it is nicer and the default CLI behavior to have a seperate file for routing

// (1.5) add the route configuration to @NgModule  [RouterModule.forRoot(routeConfigurationVariable)]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

/* CLI commands used in setup

ng new routing-example
ng g c home
ng g c product
*/