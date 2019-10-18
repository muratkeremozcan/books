import { CanDeactivate, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { ProductDetailComponent } from "./product.component";

@Injectable()
// implementing the CanDeactivate guard for the ProductDetailComponent
export class UnsavedChangesGuard implements CanDeactivate<ProductDetailComponent> {

  canDeactivate(component: ProductDetailComponent) {
    // check if the content of the input control has been changed
    if (component.name.dirty) {
      return window.confirm("You have unsaved changes. Still want to leave?");
    } else {
      return true;
    }
  }
}
