import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";

// [4] Changing validators dynamically in reactive forms - advanced [3]
// you can change the validators attached to a form or one of its controls during runtime.
// ex: depending on user input in one control, validation rules for another control should be changed.
// use setValidators() to update on the fly, and  updateValueAndValidity() to apply the changes

// high level:
// in ngOnInit get a reference to the controls: formControlVar = formGroupVar.get('formControlNme') as FormControl // (4.1)
// to observe the value, use valueChanges (4.2)
// use formControlVar.setValidators(...) to modify the validator on the fly (4.3)
// finalize with formControlVar.updateValueAndValidity() (4.4)

// formInstanceVar.controls['controlName'].dirty : displays the error message only if the phone was modified and is invalid
@Component({
  selector: 'app-root',
  template: `
    <form [formGroup]="myFormModel">
      Country: <input type="text" formControlName="country">
      <br>
      Phone: <input type="text" formControlName="phone">

      <span class="error" *ngIf="myFormModel.controls['phone'].invalid && myFormModel.controls['phone'].dirty">
            Min length: {{this.myFormModel.controls['phone'].getError('minlength')?.requiredLength}}
           </span>
    </form>
  `,
  styles: ['.error {color: red;}']
})
export class AppComponent implements OnInit {
  myFormModel: FormGroup;

  countryCtrl: FormControl;
  phoneCtrl: FormControl;

  // uses FormBuilder (meta)
  constructor(fb: FormBuilder) {
    this.myFormModel = fb.group({
      country: [''],
      phone: ['']
    });
  }

  // (4.1) get a reference to the control: formControlVar = formGroupVar.get('formControlNme') as FormControl
  ngOnInit() {
    this.countryCtrl = this.myFormModel.get('country') as FormControl;
    this.phoneCtrl = this.myFormModel.get('phone') as FormControl;

    // (4.2) to observe the value, use valueChanges
    this.countryCtrl.valueChanges.subscribe(country => {
      // (4.3) use formControlVar.setValidators(...) to modify the validator on the fly
      if ('USA' === country) {
        this.phoneCtrl.setValidators([Validators.minLength(10)]);
      } else {
        this.phoneCtrl.setValidators([Validators.minLength(11)]);
      }
      // (4.4) finalize with formControlVar.updateValueAndValidity()
      // this emits the updated validator to the subscribers of valueChanges
      this.phoneCtrl.updateValueAndValidity();
    }
    );
  }
}
