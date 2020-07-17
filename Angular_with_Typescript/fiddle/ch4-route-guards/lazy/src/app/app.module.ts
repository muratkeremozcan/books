import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CustomPreloadingStrategy } from './custom.preloader';
// import { LuxuryModule } from './luxury/luxury.module'; // no need with lazy loading


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // contrast to w/o lazy loading, there is no need to import the child module
    // LuxuryModule
  ],
  // (3) optional: because the preloading strategy is an injectable service, it has to be listed under providers
  providers: [CustomPreloadingStrategy],
  bootstrap: [AppComponent]
})
export class AppModule { }
