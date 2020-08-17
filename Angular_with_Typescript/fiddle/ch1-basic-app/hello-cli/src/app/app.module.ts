import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// [1] components are grouped into Angular modules. Every component belongs in a module.
// the @NgModule decorator lists all the components and other articfacts that should be included in this module
@NgModule({
  // declarations list all the components that belong in this module
  declarations: [
    AppComponent
  ],
  // imports lists the modules that this module imports
  imports: [
    // this module is a must for apps that run in browsers
    BrowserModule,
    // in SPAs, the entire browser’s page is not being refreshed
    // only a certain portion of the page (view) may be replacing another as the user navigates through your app.
    // Such client-side navigation is arranged with the help of the Angular router.
    AppRoutingModule
  ],
  providers: [], // services go in providers. Think of them as components without UIs
  bootstrap: [AppComponent] // declares that AppComponent is the root component
})
export class AppModule { }
