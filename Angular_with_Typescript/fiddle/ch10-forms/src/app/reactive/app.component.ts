import { Component } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms"; // [2.1]


/* Reactive forms [2] (almost meta, but you may want to use [5] FormBuilder to avoid 'new' spam)
[2.1] Import ReactiveFormsModule at app.module, import FormControl, FormGroup at the component
[2.2] In TS, create an instance of FormGroup to store the form’s values.
[2.3] Create an HTML form template  :    [formGroup]="instanceVarOfFormGroup"
[2.4] name : formControlName , ngModelGroup : formGroupName
[2.5] at the TS constructor, hook the form to the TS by instantiating FormGroup objects and FormControl properties
*/


// [2.3] : [formGroup]="instanceVarOfFormGroup"
@Component({
  selector: 'app-root',
  template: `
    <form [formGroup]="myFormModel" (ngSubmit)="onSubmit()">
      <div>Username: <input type="text" formControlName="username"></div>
      <div>SSN:      <input type="text" formControlName="ssn"></div>

      <div formGroupName="passwordsGroup">
        <div>Password:         <input type="password" formControlName="password"></div>
        <div>Confirm password: <input type="password" formControlName="pconfirm"></div>
      </div>
      <button type="submit">Submit</button>
    </form>
  `
})
export class AppComponent {
  myFormModel: FormGroup; // [2.2] create an instance of FormGroup

  constructor() {
    // FormGroup is a collection of FormControl objects and represents either the entire form or its part.
    // FormControl instance stores the current value of the HTML element it corresponds to,
    this.myFormModel = new FormGroup({ // [formGruop]
      // this is how we hook the form to the TS, after this at the teamplate: formControlName="username"
      username: new FormControl(''),
      ssn     : new FormControl(''),
      passwordsGroup: new FormGroup({   // formGroupName
        password: new FormControl(''),
        pconfirm: new FormControl('')
      })
    });
  }

  // In the reactive API, the onSubmit() method doesn’t need arguments
  // because you access the form values using your component’s myFormModel property.
  onSubmit() {
    console.log(this.myFormModel.value);
  }
}

/* more about FormControl
FormControl instance stores the current value of the HTML element it corresponds to,
 the element’s validity status, and whether it’s been modified.
Here’s how you can create a control passing its initial value as the first argument of the constructor:

let city = new FormControl('New York');

for validation:

let city = new FormControl('New York', // Creates a form control with the initial value New York
                           [Validators.required,   //  Adds a required validator to a form control
                           Validators.minLength(2)]  // Adds a minLength validator to a form control
                           );

FormControl can be useful to use Forms API features like validation and reactive behavior.
recall the weather app; we did not have to use [formGroup], and instead used [formControl]
then we took advantage of the FormsAPI valueChanges observable feature and avoided using ngModel

<input type="text" placeholder="Enter city" [formControl]="searchInput">

searchInput = new FormControl();

this.searchInput.valueChanges
  .pipe(
    debounceTime(300),
    switchMap(city => this.getWeather(city)) // formControl is the outer observable, getWeather is the inner
  )
  .subscribe(... )




Note about FormArray:

FormGroup represents an entire form or a fixed subset of a form’s fields,
FormArray has a length property, and usually represents a collection of form controls that can grow or shrink.

let myFormModel = new FormGroup({  // represents the entire form
                              emails: new FormArray([ // form array initially has 1 item
                                new FormControl() // adds an instance of FormControl
                               ])
                              });


*/
