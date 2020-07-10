import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home-component';
import { ProductComponent } from './product/product-component';
import { ProductDescriptionComponent } from './product/product-description/product-description.component';
import { SellerInfoComponent } from './product/seller-info/seller-info.component';
import { NotFoundComponent } from './not-found/not-found.component';


/* CLI commands used

ng new routing-example
ng g c home
ng g c product

under product folder, created 2 child components
ng g c product-description
ng g c seller-info
*/

// You configure routes in an array of objects of type Route
const routes: Routes = [
  { // if the path after the base URL is empty, render the HomeComponent in <router-outlet>
    path: '', component: HomeComponent
  },
  { // if the path contains 'product' fragment, render the ProductDetailComponent in <router-outlet>
    // Passing Data into Routes (1) : first we define what the route parameter will be, 'id' in this case
    path: 'product/:idProduct', component: ProductComponent,
    children: [ // new(1) : children property configures the child routes
      // productDescription will be at Product Component by default
      { path: '', component: ProductDescriptionComponent },
      // from ProductComponent the user will be able to navigate to SellerInfoComponent
      { path: 'seller/:idSeller', component: SellerInfoComponent }
    ]
  },
  { // an application component that will be displayed whenever the application can’t find the matching component.
    path: '**', component: NotFoundComponent
  }
];


// remember: you saw @NgModule decorator being used at app.module.ts
// at app.module.ts, the @NgModule decorator lists all the components and other articfacts that should be included in this module

// route configuration is also done at module level, and we can add to the @NgModule decorator at app-routing.module.ts
// we could have it all happen at app.module.ts, but it is nicer and the default CLI behavior to have a seperate file for routing

// adds the route configuration to @NgModule
@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    { enableTracing: true } // you can log router events in console for debugging with this
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
