import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Any component belongs to exactly one module of an app, and you have to include the name of the component’s class
// into the declarations property of the @NgModule() decorator in the module file.
// the @NgModule decorator lists all the components and other articfacts that should be included in this module
@NgModule({
  // declarations list all the components that belong in this module
  declarations: [
    AppComponent
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
  providers: [], // mystery for now
  bootstrap: [AppComponent] // declares that AppComponent is the root component
})
export class AppModule { }
