import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'products/:productId', component: ProductDetailComponent} // configuring a route for the URL fragments like products/123
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // creating a router module and service for the app root module
  exports: [RouterModule] // re-exporting the RouterModule so other modules can access it
})
export class AppRoutingModule { }
