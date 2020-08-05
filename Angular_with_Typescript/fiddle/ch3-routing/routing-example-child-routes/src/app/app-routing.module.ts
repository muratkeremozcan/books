import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home-component';
import { ProductComponent } from './product/product-component';
import { ProductDescriptionComponent } from './product/product-description/product-description.component';
import { SellerInfoComponent } from './product/seller-info/seller-info.component';
import { NotFoundComponent } from './not-found/not-found.component';

// [2] child routes: useful if you want to form a hierarchy that replicates the child component structure

// the flow is the same as basic routes example in [1], the key difference being only the children: property in routes
const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'product/:idProduct', component: ProductComponent,
    // KEY (2.1) : children property configures the child routes
    // VERY NICE: no extra config needed at the template compared to basic routes example in [1]
    children: [
      // productDescription will be at Product Component by default
      { path: '', component: ProductDescriptionComponent },
      // from ProductComponent the user will be able to navigate to SellerInfoComponent
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
