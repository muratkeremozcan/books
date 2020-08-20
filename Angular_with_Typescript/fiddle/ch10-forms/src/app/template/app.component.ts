import { Component } from '@angular/core';

/* [1]
Template-driven forms (for n00bs):
the forms are fully programmed in the component’s template using directives, and the model object is created implicitly by Angular.

ngForm: binds a template element (for example, <form>) to NgForm. Typically assigned to a local template variable.
NgForm: represents the entire form - (implicitly created Angular directive)

ngModel: used in templates in form elements (for example, <input>) to be included in the form model
name: Used in templates in form elements to specify its name in the form model
NgModel: marks the HTML element to be included in the form model - (implicitly created Angular directive)

ngModelGroup: Used in templates to name a part of the form for future reference
NgModelGroup: represents a part of the form, for example, password and confirm password fields - (implicitly created Angular directive)

ngSubmit: emitted by NgForm; no need to listen to the standard submit event because NgForm intercepts the HTML form’s submit event
this prevents the form from being automatically submitted to the server (on page reload).
NgForm emits its own ngSubmit event.
in turn, the onSubmit(..) method handles the ngSubmit event. onSubmit() method has to be implemented in the model
*/

// ngForm: binds the template variable f to NgForm. The variable f is needed to access the form's properties (valid, value)

// ngSubmit: submits the form, passing the form model to the event handler

// name & ngModel: name specifies the <input> as a form  element, ngModel makes the <input> a part of NgForm

// name & ngModelGroup: wraps the related values (a nested group) in a value object
@Component({
  selector: 'app-root',
  template: `
    <form #f="ngForm" (ngSubmit)="onSubmit(f.value)">
      <div>Username: <input type="text" name="username" ngModel></div>
      <div>SSN:      <input type="text" name="ssn"      ngModel></div>
      <div ngModelGroup="passwordsGroup">
        <div>Password:         <input type="password" name="password" ngModel></div>
        <div>Confirm password: <input type="password" name="pconfirm" ngModel></div>
      </div>
      <button type="submit">Submit</button>
    </form>
  `
})
export class AppComponent {
  onSubmit(formData) {
    console.log(formData);
  }
}

