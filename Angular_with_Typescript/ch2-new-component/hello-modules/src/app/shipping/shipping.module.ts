import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShippingComponent } from './shipping.component';

// [2] Angular sub modules

// high level:
// create the module and component hierarchy with cli (2.0)
// for sub modules import CommonModule instead of BrowserModule (2.1)
// export the components of the sub module that you want to expose (2.2)
// at the root module, import the sub module (2.3)
// now you can now use the exposed components of the sub module in any template using the tag of the component (2.4)


/* generated with cli commands:

ng new hello-modules  - generates a project called hello-modules

cd hello-modules

ng g m shipping  - generates a new feature module called shippping

ng g c shipping -m shippping - creates shipping component in shipping module, adds the component to the declarations of the module */

@NgModule({
  declarations: [ShippingComponent],
  imports: [
    CommonModule // (2.1) root module imports BrowserModule, in contrast Feature module imports CommonModule
  ],
  // A feature module may declare its own components and services,
  // (2.2) but to make all or some of the components visible to other modules, they need to be exported
  exports: [ShippingComponent]
  // (2.3) at the root module (app.module.ts ) include the sub modules you want to import in the imports property of @NgModule decorator

  // note: the shipping module may include other members, like classes, directives, and pipes.
  // If you don’t list them in the exports section, these members will remain private to the shipping module
  // and will be hidden from the rest of the app.
})

// (2.4) To have the browser render the component of a child module in templates (for example the root app.component.html)
// you add the <app-shipping> (specified as the selector in shipping-component.ts) tag to the template of the AppComponent.

export class ShippingModule { }
