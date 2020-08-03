import { Component } from '@angular/core';

// [1] built-in validators in a template-driven (n00b) form

// (1.1) adds validators: required, pattern, minlength
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
// (1.2) defines a local variable #variable="ngModel" to give access to the value of this control
// (1.3) defines a local class attribute with [class.hasError] to help extrapolate the variable's status (this must come last)
// (1.4) uses [hidden] attribute after extrapoloting the variable's status with .valid & .pristine properties (there is also .dirty)
// also uses [hidden] in conjunction with variable.localClass('validator')  : phone.hasError('minlength')
// (1.5) uses [disabled] attribute after extrapoloting the form's status

// controlling when the validation is performed
// change — [ngModelOptions]= "{updateOn:'change'}"  . this is the default mode (you can leave it empty) checks a value as soon as it changes.
// blur — [ngModelOptions]= "{updateOn:'blur '}"  . checks validity of a value when the control loses focus.
// submit — [ngModelOptions]= "{updateOn:'submit'}"   . checks validity when the user submits the form. (if you use this, remove 1.5)

@Component({
  selector: 'app-root',
  template: `
    <form #f="ngForm" (ngSubmit)="onSubmit(f.value)" >
      <div>
        Phone number:
        <input type="text" name="telephone" ngModel
               required
               pattern="[0-9]*"
               minlength="10"
               #phone="ngModel"
               [ngModelOptions]= "{updateOn:'change'}"
               [class.hasError]="phone.invalid && phone.touched">
        <div [hidden]="phone.valid || phone.pristine">
          <div class="error" [hidden]="!phone.hasError('minlength')">Phone has to have at least 10 digits</div>
          <div class="error" [hidden]="!phone.hasError('required')">Phone is required</div>
          <div class="error" [hidden]="!phone.hasError('pattern')">Only digits are allowed</div>
        </div>

      </div>
      <button type="submit" [disabled]="f.invalid">Submit</button>
    </form>
  `,
  styles: ['.error {color: red;} .hasError {border: 1px solid red;}']
})
export class AppComponent {
  onSubmit(formData) {
    console.log(formData);
  }
}
