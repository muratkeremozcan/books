import { Component } from '@angular/core';
import { FormGroup, FormControl } from "@angular/forms";

// [4] updating form data with data from outside
// in [2] and [3] where the user is changing the form
// in some cases the form changes based on data from elsewhere such as the server
// Forms API a few handy functions for this

// reset()  reinitializes the form model and resets the flags on the model, like touched, dirty, and others.
// setValue()  is used for updating all values in a form model.
// patchValue()  is used when you need to update the selected properties of a form model.

// [4.1] the setup of the form can be for reactive [2] or dynamic [3]. Here it's a reactive example

// [4.3] note how reset is different; no need for implementing it at the TS
// just call it from the template    [formGroup]="instanceVarOfFormGroup"  &  instanceVarOfFormGroup.reset()
 @Component({
  selector: 'app-root',
  template: `
    <form [formGroup]="myFormModel">
      <div>Product ID:  <input type="text" formControlName="id"></div>
      <div>Description: <input type="text" formControlName="description"></div>
      <div>Seller:      <input type="text" formControlName="seller"></div>
    </form>
    <button (click)="updateEntireForm()">Populate</button>
    <button (click)="updatePartOfTheForm()">Update Description</button>
    <button (click)="myFormModel.reset()">Reset</button>
  `
})
export class AppComponent {
  myFormModel: FormGroup;

  constructor() {
    this.myFormModel = new FormGroup({
      id         : new FormControl(''),
      description: new FormControl(''),
      seller     : new FormControl('')
    });
  }

  // [4.2] KEY: once the instance varible for the form exists, we use setValue({allPropertiesOfTheForm})
  updateEntireForm() {
    this.myFormModel.setValue({
      id         : 123,
      description: 'A great product',
      seller      : 'XYZ Corp'
    });
  }

  // [4.2] or we use patchValue({somePropertiesOfTheForm})
  updatePartOfTheForm() {
    this.myFormModel.patchValue({
      description: 'The best product'
    });
  }
}
