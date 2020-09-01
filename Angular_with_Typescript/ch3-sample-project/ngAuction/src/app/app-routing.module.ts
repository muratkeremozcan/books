import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

const routes: Routes = [
  { // for default route, render the HomeComponent in <router-outlet>
    path: '', component: HomeComponent
  },
  { // Configuring a route for the URL fragments, like products/123
    // 2 things this has to match:
    // productId at product.service.ts:
    // getProductById(productId: number): Product {
    //   return products.find(p => p.id === productId);
    // }
    // it also matches the routerLink at product-item-component.html
    // <a [routerLink]="['/products', product.id]">{{product.title}}</a>
    path: 'products/:productId', component: ProductDetailComponent
  }
];

// remember: you saw @NgModule decorator being used at app.module.ts
// at app.module.ts, the @NgModule decorator lists all the components and other articfacts that should be included in this module

// route configuration is also done at module level, and we can add to the @NgModule decorator at apwp-routing.module.ts
@NgModule({
  // creates a RouterModule for the app root module
  imports: [RouterModule.forRoot(routes)],
  // re-exports the RouterModule so that other modules can access it
  exports: [RouterModule]
})
export class AppRoutingModule { }
