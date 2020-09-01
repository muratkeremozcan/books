import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductComponent } from './product/product.component';
// import { ProductService } from './shared/product.service'; // no need with providedIn: 'root' at product.service.ts

// [1] Angular basics: cli, components, services, directives (ngFor, ngIf, pipe, ngModel)

// high level:
// generate your component & service hierarchy with cli (1.0)
// further configure the component if needed,  (constructor, ngOnInit...) it should be included in declarations of the root module (1.1)
// further configure the service if needed (service arg in its constructor) (with providedIn: root no need to include it in providers of the root module) (1.2)
// in the root component template (app.component) allocate and area for rendering child components using <router-outlet></router-outlet> (1.3)
// supercharge any & all templates with Angular directives (ngFor, ngIf, pipe, ngModel) and binding ( {{ }}, [], (), ([]))  (1.4)


/* CLI commands used

(1) ng g c product - will generate four files for a new product component in the src/app/product directory
and add the ProductComponent class to the declarations property of @NgModule

ng g s product - will generate the file product.service.ts containing a class decorated with @Injectable
and the file product.service.spec.ts in the src/app directory

(2) ng g s shared/product  - generate it under a folder called shared


related Anguler CLI commands

ng g c — Generates a new component
ng g s — Generates a new service
ng g d — Generates a new directive
ng g m — Generates a new module
ng g application — Generates a new app within the same project
ng g library — Starting with Angular 6, you can generate a library project

*/
// all elements of a small application can be located in one module (the root module),
// whereas larger apps may have more than one module (feature modules).
// All apps must have at least a root module that’s bootstrapped during app launch.
// From a syntax perspective, an Angular module is a class annotated with the @NgModule() decorator.
@NgModule({
  // declarations list all the components that belong in this module
  // Any component belongs to exactly one module of an app
  // and you have to include the name of the component’s class into the declarations property of the @NgModule() decorator
  declarations: [
    AppComponent,
    ProductComponent // got added after creating a component called Product with CLI command'ng g c product'
  ],
  // these modules are a must for apps that run in browsers
  // all needed modules  go here
  imports: [
    BrowserModule,
    // in SPAs, the entire browser’s page is not being refreshed
    // only a certain portion of the page (view) may be replacing another as the user navigates through your app.
    // Such client-side navigation is arranged with the help of the Angular router.
    AppRoutingModule,

    /* Including some of the Angular modules is a must (for example, @angular/core), whereas some modules are optional
    For example, if you’re planning to use the Angular Forms API and make HTTP requests,
    you should add @angular/forms and @angular/common/http in your package.json   */
    // FormsModule,
    // HttpClientModule,
  ],
  // services go in providers
  // if in the service @Injectable decorator, provideIn: 'root' is used
  // it allows you to skip the step of specifying the service in the providers property of the NgModule() decorator here.
  // providers: [ProductService], // got added after creating a service with CLI command 'ng g s shared/product'
  bootstrap: [AppComponent] // declares that AppComponent is the root component
})
export class AppModule { }
