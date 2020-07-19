import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShippingComponent } from './shipping.component';


// Root module imports BrowserModule
// in contrast, Feature module imports CommonModule

/* generated with cli commands:

ng new hello-modules  - generates a project called hello-modules

cd hello-modules

ng g m shipping  - generates a new feature module called shippping

ng g c shipping -m shippping - creates shipping component in shipping module, adds the component to the declarations of the module */

@NgModule({
  declarations: [ShippingComponent],
  imports: [
    CommonModule
  ],
  // A feature module may declare its own components and services,
  // but to make all or some of the components visible to other modules, they need to be exported
  // (1) at the root module (app.module.ts ) include the sub modules you want to import in the imports property of @NgModule decorator
  exports: [ShippingComponent]

  // note: the shipping module may include other members, like classes, directives, and pipes.
  // If you don’t list them in the exports section, these members will remain private to the shipping module
  // and will be hidden from the rest of the app.
})

// (2) To have the browser render the shipping component in the root component (app.component.html)
// you add the <app-shipping> (specified as the selector in shipping-component.ts) tag to the template of the AppComponent.

export class ShippingModule { }
