import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {PreloadAllModules, RouterModule} from "@angular/router";
import {AppComponent} from "./app.component";
import {HomeComponent} from "./home.component";
import {ProductDetailComponent} from "./product.detail.component";
import {LocationStrategy, HashLocationStrategy} from "@angular/common";
import {CustomPreloadingStrategy} from "./custom.preloader";


@NgModule({
  imports: [ BrowserModule,
    RouterModule.forRoot([ // configures routes for the root module
      {path: '',        component: HomeComponent},
      {path: 'product', component: ProductDetailComponent},
      // instead of the property component, uses the loadChildren component for lazy loading
      {path: 'luxury', loadChildren: './luxury.module#LuxuryModule', data: {preloadme:true} } ]
      // optionally add preloading strategy
     , {preloadingStrategy: CustomPreloadingStrategy}
      )
  ],
  // Note that the imports section only includes BrowserModule and RouterModule. The
  // feature module LuxuryModule isn’t listed here. Also, the root module doesn’t mention
  // LuxuryComponent in its declarations section, because this component isn’t a part of
  // the root module. When the router parses the routes configuration from both root and
  // feature modules, it’ll properly map the luxury path to the LuxuryComponent that’s
  // declared in the LuxuryModule.
  declarations: [ AppComponent, HomeComponent, ProductDetailComponent],
  // because CustomPreloadingStrategy is an injectable service, you need to add it to the providers property of the root module in @NgModule decorator
  providers:[{provide: LocationStrategy, useClass: HashLocationStrategy}, CustomPreloadingStrategy],
  bootstrap:    [ AppComponent ]
})
export class AppModule {}
