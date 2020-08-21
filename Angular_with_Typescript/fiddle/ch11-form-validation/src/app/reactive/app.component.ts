import { Component } from '@angular/core';
import { FormGroup, FormControl, ValidationErrors } from '@angular/forms';


// [2] custom validators in a reactive form
// high level:
// create a custom validator function (2.1)
// setup reactive forms (2.2)
// use the [formGroup]="instanceVar", instanceVar.get('formControlProp').dirty (or other form controls...) , instanceVar.hasError('validatorObjectKey', 'formControlProp') (2.3)
// recall the form control states (pristine -> untouched -> touched -> dirty...) to use in 2.3  (2.4)

// (2.1) the arg of the custom validator function needs to be of type FormControl,FormGroup or FormArray
// and return ValidationErrors object or null
function ssnValidator(control: FormControl): ValidationErrors | null {
  const value: string = control.value || ''; // gets the object value if available, null otherwise
  const valid = value.match(/^\d{9}$/); // matches the value against a reex
  return valid ? null : { ssn: { description: 'SSN is invalid' } }; // returns a ValidationErrors object if the value is not valid
}

// (2.3) KEY: in contrast to template forms, creating a #localVar="ngModel" then extrapolating with [class.hasError]="localvar.invalid" etc
// we use the [formGroup]="instanceVar" (matching the TS), we do instanceVar.get('formControlProp').dirty (pristine, etc.)
// or we query for the custom validator with  instanceVar.hasError('validatorObjectKey', 'formControlProp')
// we also have getError('validatorObjectKey', 'formControlProp').validationObjectProp we defined for ValidationError object
// with default validors this is .getError('builtInValidator')   - required, min/maxlength, pattern, email


// note the save navigation ?
// it means “Don’t try to access the property description if the object returned by getError() is undefined or null,”
// If you didn’t use the safe navigation operator, this code would produce the runtime error “cannot read property description of null” for valid SSN values.


// (2.4) Form controls (they also provide css classes:  className.ng-dirty.ng-invalid)
// form control states:
// pristine: meant that  the user never interacted with the form control.
// untouched:  while the focus remains in the control, it’s still untouched
// touched: if the user puts the focus into a form control using the keyboard or mouse and then moves the focus out;
// dirty: indicates that the initial value of the form control was modified, regardless of where the focus is.

// pending: this control is in the midst of conducting a validation check (async validators are beind used, useful for progress indicator)
// ex: for reactive forms, the type of the statusChanges property is Observable, and it emits one of three values: VALID, INVALID, and PENDING.

// valid  - self explanatory
// invalid

// all controls https://angular.io/api/forms/AbstractControl

@Component({
  selector: 'app-root',
  template: `
    <form [formGroup]="myForm">
      SSN: <input type="text" formControlName="socialSecurity" class="social">
      <span [hidden]="!(myForm.get('socialSecurity').dirty && myForm.hasError('ssn', 'socialSecurity'))">
             {{myForm.getError('ssn', 'socialSecurity').description}}
      </span>
    </form>
  `,
  styles: [`.social.ng-dirty.ng-invalid
            {
              background-color: lightpink;
            }`
  ]
})
export class AppComponent {
  // recall reactive forms from ch 11
  // [2.1] Import ReactiveFormsModule at app.module, import FormControl, FormGroup at the component
  // [2.2] In TS, create an instance of FormGroup to store the form’s values.
  // [2.3] Create an HTML form template  :    [formGroup]="instanceVarOfFormGroup"
  // [2.4] name : formControlName , ngModelGroup : formGroupName
  // [2.5] at the TS constructor, hook the form to the TS by instantiating FormGroup objects and FormControl properties
  myForm: FormGroup;

  constructor() {
    this.myForm = new FormGroup({

      // (2.2) KEY: instead of just prop:  new FormControl(''),
      // we add a 2nd argument as the custom validator function :  prop: new FormControl('', customValFunction)
      socialSecurity: new FormControl('', ssnValidator)
    });
  }
}
