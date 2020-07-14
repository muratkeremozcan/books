import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { LoginGuard } from './login/login.guard';
import { UnsavedChangesGuard } from './product-detail/unsaved-changes.guard';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {
    path: 'product', component: ProductDetailComponent,
    // (2 CanActivate route) KEY: the guards need to be assigned to the property canActivate at app.routing.module.ts
    canActivate: [LoginGuard],
    // (4 CanDeactivate route):
    canDeactivate: [UnsavedChangesGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  // (4 / 5 both) the guard classes need to be added to the providers of @NgModule
  providers: [LoginGuard, UnsavedChangesGuard]

})
export class AppRoutingModule { }
