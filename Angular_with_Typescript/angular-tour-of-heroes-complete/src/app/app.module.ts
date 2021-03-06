import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Router } from '@angular/router';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ComposeMessageComponent } from './compose-message/compose-message.component';

import { AppRoutingModule } from './app-routing.module';
import { HeroesModule } from './heroes/heroes.module';
import { AuthModule } from './auth/auth.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';
import { TemplateFormExampleComponent } from './template-form-example/template-form-example.component';
import { ReactiveFormComplexComponent } from './reactive-form-complex/reactive-form-complex.component';


// Common modules:
// BrowserModule	     :	When you want to run your app in a browser
// CommonModule	       :	When you want to use NgIf, NgFor
// FormsModule         :	When you want to build template driven forms (includes NgModel)
// ReactiveFormsModule : 	When you want to build reactive forms
// RouterModule	       :	When you want to use RouterLink, .forRoot(), and .forChild()
// HttpClientModule	   :	When you want to talk to a server


// The order of route configuration is important
// because the router accepts the first route that matches a navigation request path
// lazy loaded modules should not be here, they are imported at app-routing.module

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests and returns simulated server responses.
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    ),
    // these 2 feature modules are loaded immediately as the app starts: routes: hero/superhero, heroId/superheroId, login
    HeroesModule,
    AuthModule,
    // after that, the routes in AppRoutingModule are evaluated
    AppRoutingModule,
    // preloaded modules are loaded first
    // then the declarations array components (below) are loaded
    // the rest of the modules (listed in AppRoutingModule) are lazy-loaded, only when requested by the user
  ],
  declarations: [
    AppComponent,
    ComposeMessageComponent,
    PageNotFoundComponent,
    TemplateFormExampleComponent,
    ReactiveFormComplexComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
  // Diagnostic only: inspect router configuration to determine if your routes are actually evaluated in the proper order
  // constructor(router: Router) {
  //   // Use a custom replacer to display function names in the route configs
  //   const replacer = (key, value) => (typeof value === 'function') ? value.name : value;

  //   console.log('Routes: ', JSON.stringify(router.config, replacer, 2));
  // }
}
