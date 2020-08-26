import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { LoginGuard } from './login/login.guard';
import { UnsavedChangesGuard } from './product-detail/unsaved-changes.guard';

// [1] route guards canActivate and canDeactivate help mediate navigation to and from a route
// at a high level:  implement the guards canActivate & canDeactivate in .guard.ts files (1.1),
// set them up in routes in app-routing-module (1.2)
// and include them in providers  in app-routing-module (1.3)

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {
    path: 'product', component: ProductDetailComponent,
    // (1.2) set up the routes KEY: the guards from .guard.ts files need to be assigned to the property canActivate at app.routing.module.ts
    canActivate: [LoginGuard],
    canDeactivate: [UnsavedChangesGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  // (1.3) the guard classes need to be added to the providers of @NgModule (unless the @Inject with providedIn: 'root' )
  providers: [LoginGuard, UnsavedChangesGuard]

})
export class AppRoutingModule { }
