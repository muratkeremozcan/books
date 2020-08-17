import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home-component';
import { ProductComponent } from './product/product-component';
import { ProductDescriptionComponent } from './product/product-description/product-description.component';
import { SellerInfoComponent } from './product/seller-info/seller-info.component';
import { NotFoundComponent } from './not-found/not-found.component';

// [2] child routes: useful if you want to form a hierarchy that replicates the child component structure

// the flow is the same as basic routes example in [1], the key difference being only the children: property in routes
// high level [1]:
// (1.1) at app-routing-module.ts configure routes in an array of objects of type Route
// (1.2) at the template (root app.component.html), reference these routes. You have 2 options
// link reference:  <a> [routerLink]=['valueOfPath']  </a>
// programmatical reference (button usually): a custom function   this.router.navigate([`pathAsString`]);
// (1.3) at the template, use <router-outlet> to display the specified component

// another key difference is the child route with parameters getting the the parameter with route.snapshot.paramMap.get('idSeller'); (2.4)
const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'product/:idProduct', component: ProductComponent,
    // KEY (2.1) : children property configures the child routes
    // VERY NICE: no extra config needed at the template on top of basic routes configuration  in [1]
    children: [
      // productDescription will be at Product Component by default
      { path: '', component: ProductDescriptionComponent },
      // from ProductComponent the user will be able to navigate to SellerInfoComponent
      // (2.4) the key here is getting the route parameter at the child component with route.snapshot.paramMap.get('idSeller');
      { path: 'seller/:idSeller', component: SellerInfoComponent }
    ]
  },
  {
    path: '**', component: NotFoundComponent
  }
];

// exactly the same as basic routes example in [1]
@NgModule({
  imports: [RouterModule.forRoot(routes,
    { enableTracing: true } // optional: you can log router events in console for debugging with this
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
