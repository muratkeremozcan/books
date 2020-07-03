import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductComponent } from './product/product.component';
import { ProductService } from './shared/product.service';

// Any component belongs to exactly one module of an app,
// and you have to include the name of the component’s class into the declarations property of the @NgModule() decorator 
@NgModule({
  // declarations list all the components that belong in this module
  declarations: [
    AppComponent,
    ProductComponent
  ],
  // these modules are a must for apps that run in browsers
  // all needed modules (and services? - components w/o UIs) go here
  imports: [
    BrowserModule,
    // in SPAs, the entire browser’s page is not being refreshed
    // only a certain portion of the page (view) may be replacing another as the user navigates through your app.
    // Such client-side navigation is arranged with the help of the Angular router.
    AppRoutingModule
  ],
  // services go in providers
  // if in the service @Injectable decorator, provideIn: 'root' is used
  // it allows you to skip the step of specifying the service in the providers property of the NgModule() decorator here.
  providers: [ProductService],
  bootstrap: [AppComponent] // declares that AppComponent is the root component
})
export class AppModule { }
