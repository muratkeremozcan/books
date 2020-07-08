import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';


// You configure routes in an array of objects of type Route
const routes: Routes = [
  { // if the path after the base URL is empty, render the HomeComponent in <router-outlet>
    path: '', component: HomeComponent
  },
  { // if the path contains 'product' fagrment, render the ProductDetailComponent in <router-outlet>
    path: 'product', component: ProductDetailComponent
  }
];

// remember: you saw @NgModule decorator being used at app.module.ts
// at app.module.ts, the @NgModule decorator lists all the components and other articfacts that should be included in this module

// we also use @NgModule decorator at app-routing.module.ts, because route configuration is done at module level
// we have to let the app know about the routes being used, and we do it here at app-routing.module.ts
// we could have it all happen at app.module.ts, but it is nicer and the default CLI behavior to have a seperate file for routing
@NgModule({
  // creates a router module and a service for the root module
  imports: [RouterModule.forRoot(routes)],
  // note: if we were configuring routes for a feature module, we would use forChild(): RouterModule.forChild(routes)

  // makes this module accessible
  exports: [RouterModule]
})
export class AppRoutingModule { }
