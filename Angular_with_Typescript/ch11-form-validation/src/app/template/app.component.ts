import {Component, Directive} from '@angular/core';
import {NG_VALIDATORS, FormControl} from "@angular/forms";

// [6] custom validors in a template driven form  (why?)

// With template-driven forms, you can use only directives to specify validators,
// so wrapping validator functions into directives is required.

// how do we wrap this custom function into a directive?
export function ssnValidator(control: FormControl): {[key: string]: any} {
  const value: string = control.value || '';
  const valid = value.match(/^\d{9}$/);
  return valid ? null : {ssn: true};
}



/**
 * This directive wraps existing ssnValidator function into a directive,
 * so it can be used in a template to validate a form field.
 */
// (6.1) Declares a directive using the @Directive decorator
@Directive({
  selector: '[ssn]', // (6.2) Defines the directive’s selector to be used as an HTML attribute
  providers: [{provide: NG_VALIDATORS, useValue: ssnValidator, multi: true}]  // (6.3) Registers ssnValidator as an NG_VALIDATORS provider

})
export class SsnValidatorDirective {}

@Component({
  selector: 'app-root',
  template: `
    <form #f="ngForm">
      SSN: <input type="text" name="my-ssn" ngModel ssn>
           <span [hidden]="!f.form.hasError('ssn', 'my-ssn')">SSN is invalid</span>
    </form>
  `
})
export class AppComponent {}
