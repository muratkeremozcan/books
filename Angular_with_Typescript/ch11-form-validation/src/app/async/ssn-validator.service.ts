import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AbstractControl, ValidationErrors } from '@angular/forms';


@Injectable()
export class SsnValidatorService {

  // (5.1) create the custom function. Should take an arg of AbstractControl and return  Observable<ValidationErrors | null>
  /** This function can be used by form controls in a way prescribed in Angular doc  because it takes an argument of AbstractControl */
  checkWorkAuthorization(field: AbstractControl): Observable<ValidationErrors | null> {
    // in the real world you'd make an HTTP call to server to check if the value is valid
    return of(field.value.indexOf('123') >= 0 ? null : { work: ' you\'re not authorized to work' });
  }

  /**
   Although this function returns validation in the format prescribed by Angular,
   it can't be attached to the form control as a validator because its argument is not a subclass of AbstractControl.
   to work around this, use switchmap/subscribe combo (see app.component.ts)
   */
  checkWorkAuthorizationV2(ssn: string): Observable<ValidationErrors | null> {
    return of(ssn.indexOf('123') >= 0 ? null : { cash: ' - you can only work for cash' });
  }
}
