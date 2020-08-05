import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

// [3] validating formGroups : the difference from [2] is validation formGroup instead of formControl

function ssnValidator(control: FormControl): { [key: string]: any } {
  const value: string = control.value || '';
  const valid = value.match(/^\d{9}$/);
  return valid ? null : { ssn: true };
}

// this is for the password group (since it has validation - probably there is a directive that can be used for this instead, but we just make a point of custom validation here)
// you use object destructuring in the function argument to extract the value property   passwordsGroup: fb.group({..})
// you also use array destructuring combined with rest parameters so you can iterate through the properties (password & its confirmation)
// you get the names of all properties in the value object and save them in two variables, first and rest (passwrod & its confirmation)
// password confirmation  should be equal to the paswword
function equalValidator({ value }: FormGroup): { [key: string]: any } {
  const [first, ...rest] = Object.keys(value || {}); // using rest parameters, gets the names of all properties of FormGroup.value
  const valid = rest.every(v => value[v] === value[first]); // Iterates through the properties’ values to check if they’re equal
  return valid ? null : { equal: true }; // If equal, returns null; otherwise, returns an error object with the error named equal
}

// [3.2] if the value of the username control is invalid, shows the error message:
// [hidden]="!formModel.hasError('ssn'/'customValidator', 'formControlName')

@Component({
  selector: 'app-root',
  template: `
    <form [formGroup]="formModel" (ngSubmit)="onSubmit()">
      <div>
        Username:
        <input type="text" formControlName="userName">
        <span class="error" [hidden]="!formModel.hasError('required', 'userName')">Username is required</span>
      </div>

      <div>
        SSN:
        <input type="text" formControlName="socialSecurity">
        <span class="error" [hidden]="!formModel.hasError('ssn', 'socialSecurity')">SSN is invalid</span>
      </div>

      <div formGroupName="passwordsGroup">
        <div>
          Password:
          <input type="password" formControlName="password">
          <span class="error" [hidden]="!formModel.hasError('minlength', ['passwordsGroup', 'password'])">Password is too short</span>
        </div>

        <div>
          Confirm password:
          <input type="password" formControlName="pconfirm">
          <span class="error" [hidden]="!formModel.hasError('equal', 'passwordsGroup')">Passwords must be the same</span>
        </div>
      </div>

      <button type="submit" [disabled]="formModel.invalid">Submit</button>
    </form>
  `,
  styles: ['.error {color: red;} ']
})

// remember formBuilder from ch10 [5]
// formBuilder is a refactor dynamic forms (a form that can change with outside data) to avoid the instantiation spam.  It is meta.
// problem with reactive forms : if a form has multiple controls, your code may contain lots of new operators creating new instances of form elements.
// instead of  propertyName: new FormControl('') , we avoid the new FormControl('') spam
// by using an argument of type FormBuilder in the constructor
// and instead of defining root and sub new FormGroup({..}) objects, we use arg.group

// [3.1] KEY here is the validator. We used to have prop: ['']  , now we have prop: ['', Validators.builtInValidator/customValidator]
// remember built-in validatos from ch11 [1]
/* all built-in validators:
required - the form control must have a non-empty value.
requiredTrue - the form control must have the value true.
email - the form control value must be a valid email.
minlength - the form control must have a value of a minimum length.
maxlength - the form control can’t have more than the specified number of characters.
pattern - the form control’s value must match the specified regular expression.
min - a value can’t be less than the specified number; it can be used only with reactive forms.
max - a value can’t be greater than the specified number; it can be used only with reactive forms.
*/
// KEY and for a sub-group validator (the pw confirmation) we insert the validation object  { validator: customValidator }

export class AppComponent {
  formModel: FormGroup;

  constructor(fb: FormBuilder) {
    this.formModel = fb.group({
      userName: ['', Validators.required],
      socialSecurity: ['', ssnValidator],
      passwordsGroup: fb.group({
        password: ['', Validators.minLength(5)],
        pconfirm: ['']
      }, { validator: equalValidator })
    });
  }

  onSubmit() {
    console.log(this.formModel.value);
  }
}
