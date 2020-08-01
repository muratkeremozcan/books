import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

// [5] FormBuilder is an refacor to [2] dynamic forms to avoid the instantiation spam.  It is meta.
// problem with [2]: if a form has multiple controls, your code may contain lots of new operators creating new instances of form elements.

// all setup is the same as 2

@Component({
  selector: 'app-root',
  template: `
    <form [formGroup]="myformModel" (ngSubmit)="onSubmit()">
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
  myformModel: FormGroup;

  // KEY: instead of  propertyName: new FormControl('') , we avoid the new FormControl('') spam
  // by using an argument of type FormBuilder in the constructor
  // and instead of defining root and sub new FormGroup({..}) objects, we use arg.group
  constructor(fb: FormBuilder) {
    this.myformModel = fb.group({
      username: [''],
      ssn     : [''],
      passwordsGroup: fb.group({
        password: [''],
        pconfirm: ['']
      })
    });
  }

  onSubmit() {
    console.log(this.myformModel.value);
  }
}
