import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup } from "@angular/forms"; // // [3.1] : imports are the same as [2.1] with FormArray extra


// [3] Dynamic reactive forms : what if you are using reactive forms but you want the form to be able change?
// in [2] with reactive forms, when the form is constant we can associate each template form element
// with a corresponding property of the FormGroup (instance variable) using formControlName directive
// when the form is dynamic we have to use FormArray (instead of an inner FormGroup)

/*
FormArray:

FormGroup represents an entire form or a fixed subset of a form’s fields,
FormArray has a length property, and usually represents a collection of form controls that can grow or shrink.

let myFormModel = new FormGroup({  // represents the entire form
                    emails: new FormArray([ // NEW: form array initially has 1 item
                      new FormControl() // adds an instance of FormControl
                      ])
                    });
*/

// [3.3]: same as [2.3] , create an HTML form template  [formGroup]="instanceVarOfFormGroup"

// [3.4] at the template: formArrayName="tsPropertyForFormArray" in a <ul> and iteratable <il> with *ngFor
// *ngor="let e of formInstanceVariable.get('tsPropertyForFormArray').controls; let ngForIndexVar=index"
// note: In Angular templates, the *ngFor directive gives you access to a special index variable that stores the current index
// the let i notation in the *ngFor loop allows you to automatically bind the value index to the local template variable i

// [3.5] The [formControlName] directive links the FormControl in FormArray to the currently rendered DOM element;
// but instead of specifying a name, it uses the current value of the variable i. This is how we hook the template to TS here.
// contrast [2.5]: we instead had to hook the form to the TS by instantiating FormGroup objects and FormControl properties via constructor
@Component({
  selector: 'app-root',
  template: `
    <form [formGroup]="formModel" (ngSubmit)="onSubmit()">
      <label>Emails</label>
      <button type="button" (click)="addEmail()">Add Email</button>
      <ul formArrayName="emails">
        <li *ngFor="let e of emailsFormArray.controls; let i=index">
          <input [formControlName]="i">
        </li>
      </ul>
      <button type="submit">Submit</button>
    </form>
    <hr>
    <label>Form Value:</label>
    <pre>{{ value }}</pre>
  `
})
export class AppComponent {
  // [3.2] : same as [2.2] , create an instance of FormGroup

  formModel = new FormGroup({ // [3.3]
    emails: new FormArray([ // KEY [3.4] at TS: no mapping as in [2.4], instead create a FormArray with FormControl elements
      new FormControl()
    ])
  });

  get emailsFormArray() {
    return this.formModel.get('emails') as FormArray;
  }

  get value() {
    return JSON.stringify(this.formModel.value, null, 4); // indent with 4 spaces for readability
  }

  addEmail() {
    const emails = this.emailsFormArray;
    emails.push(new FormControl());
  }

  onSubmit() {
    console.log(this.formModel.value);
  }
}
