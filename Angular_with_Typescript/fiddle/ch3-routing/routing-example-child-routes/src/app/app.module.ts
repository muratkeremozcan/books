import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home-component';
import { ProductComponent } from './product/product-component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProductDescriptionComponent } from './product/product-description/product-description.component';
import { SellerInfoComponent } from './product/seller-info/seller-info.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductComponent,
    NotFoundComponent,
    ProductDescriptionComponent,
    SellerInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

/* CLI commands used

ng new routing-example
ng g c home
ng g c product
*/
