import { CanDeactivate } from '@angular/router'; // the relevant interface
import { Injectable } from '@angular/core'; // needs to be Injectable like a service
import { ProductDetailComponent } from './product-detail.component';

@Injectable()
// (2 CanDeactivate route)  KEY: different from login.guard, this one needs to know about the component it's leaving,
// because it will use its variable 'name' on the form
// the relevant component has to be cast as the type <  >
export class UnsavedChangesGuard implements CanDeactivate<ProductDetailComponent> {

  // contrast to login.guard ; no constructor needed with router: Router because we are not using router.navigate()
  // (2 CanDeactivate route)
  canDeactivate(component: ProductDetailComponent) {

    // (3 CanDeactivate) use the FormControl.dirty property to whether the content of the input control has been changed
    if (component.name.dirty) {
      return window.confirm('You have unsaved changes. Still want to leave?');
    } else {
      return true;
    }
  }
}