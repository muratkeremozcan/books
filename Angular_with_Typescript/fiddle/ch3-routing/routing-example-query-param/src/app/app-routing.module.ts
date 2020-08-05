import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home-component';
import { ProductComponent } from './product/product-component';
import { NotFoundComponent } from './not-found/not-found.component';

// [3] Query parameters: it's not an alternative to child routes, it's for a different purpose; to maintain state
// the router in angular, each page generally has its own route.
// in the pages, you can use query params to maintain state for the page instead of relying on cookies or local storage
// For example site/123/devices?page=5,sort=asc,search=foo
// you can book mark that, and then instead of going to the first page of devices, you bookmarked the 5th page of a ascending sorted search for 'foo'

const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    // (3.1) different from [1, 2]: query parameters aren’t scoped to a particular route and can be accessed by any active route,
    // the route configuration doesn’t need to include them.
    path: 'product', component: ProductComponent
    // path: 'product/:id', component: ProductComponent // this just shows how it was in basic routes [1] for comparison
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
