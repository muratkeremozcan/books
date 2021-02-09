import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SsnValidatorService } from './ssn-validator.service';
import { switchMap, filter, debounceTime } from 'rxjs/operators';


// [5] async validators: they are all custom functions (usually a service) that return either an Observable or a Promise object.
// [1 - 4] have been client side form validation, this is server side validation of form values

// high level:
// (5.1) create the custom function in a service. Should take an arg of AbstractControl and return  Observable<ValidationErrors | null>
// (5.2) inject the service to the constructor, then add the async validator as the 3rd argument to the control. Use bind.
// (5.3) *ngIf... ; else alias  + <ng-template> pattern can be useful

// the classic client side validator. It is here to show that the sync validators run before the async
function ssnValidator(control: FormControl): { [key: string]: any } {
  const value: string = control.value || '';
  const valid = value.match(/^\d{9}$/);
  return valid ? null : { ssn: true };
}

// (5.3) use <ng-template> to specify the content that’s not rendered by the browser on page load, but later on.
// remember  instanceVar.hasError('validatorObjectKey', 'formControlProp')

@Component({
  selector: 'app-root',
  template: `
    <form [formGroup]="myForm">
      <h2>Sync and async validation demo </h2>

      Enter your SSN: <input type="text" formControlName="ssnControl">
      <span *ngIf ="myForm.hasError('ssn', 'ssnControl'); else validSSN"> SSN is invalid.</span>
      <ng-template #validSSN> SSN is valid.</ng-template>

      <span *ngIf ="myForm.hasError('work', 'ssnControl')"> {{myForm.get('ssnControl').errors.work}}</span>

      <span *ngIf ="myForm.hasError('cash')"> {{myForm.errors.cash}}</span>
    </form>
  `
})
export class AppComponent implements OnInit {

  myForm: FormGroup;

  // if your custom validator is in a service, recall that a service needs to be an arg in the constructor
  constructor(private ssnValidatorService: SsnValidatorService) {
    // (5.2) KEY: add the async validator
    // Async validators are passed as the third argument to constructors of model classes.
    // If you need to have several synchronous or asynchronous validators, specify an array as the second and/or third argument.
    this.myForm = new FormGroup({
      ssnControl: new FormControl('', ssnValidator,
      // use bind() to make sure that this method runs in the context of the service ssnValidatorService
        ssnValidatorService.checkWorkAuthorization.bind(ssnValidatorService))
    });
  }

  // (5.2.altertnative])
  // if the custom validator does not conform to the interface (doesn't take an arg of AbstractControl) you have to work around it
  // use valueChanges to observe and switchMap to the custom function you used
  ngOnInit() {
    const ssnControl = this.myForm.get('ssnControl');

    ssnControl.valueChanges
      .pipe(
        debounceTime(2000), // debounceTime so that the example works
        // filter(val => val.length === 9), // don't need this
        switchMap(ssnValue =>
          this.ssnValidatorService.checkWorkAuthorizationV2(ssnValue))
      )
      .subscribe((res) => {
        this.myForm.setErrors(res);
      }
      );
  }
}