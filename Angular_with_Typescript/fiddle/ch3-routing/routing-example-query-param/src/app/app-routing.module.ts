import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home-component';
import { ProductComponent } from './product/product-component';
import { NotFoundComponent } from './not-found/not-found.component';



const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    // (1) new: query parameters aren’t scoped to a particular route and can be accessed by any active route,
    // the route configuration doesn’t need to include them:
    path: 'product', component: ProductComponent
    // path: 'product/:id', component: ProductComponent
  },
  {
    path: '**', component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
