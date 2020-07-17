import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CustomPreloadingStrategy } from "./custom.preloader";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'product', component: ProductDetailComponent },
  {
    path: 'luxury',
    // (2) KEY instead of the property 'component', use loadChildren custom function
    // When the router parses the routes configuration from both root and feature modules,
    // it’ll properly map the luxury path to the LuxuryComponent that’s declared in the LuxuryModule.
    loadChildren: () => import('./luxury/luxury.module').then(m => m.LuxuryModule),
    data: { preloadme: true }
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      { preloadingStrategy: CustomPreloadingStrategy } // (3): optinal preloading strategy
    )
  ],

  exports: [RouterModule]
})
export class AppRoutingModule { }
