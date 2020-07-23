import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

/*  turn a DOM event into an observable in the previous secition [1]
[1.1] we got a reference to the DOM object: we used @ViewChild and declared the property myInputField: ElementRef that held a reference,
[1.2] we hen used fromEvent() to make the DOM event into an observable

@ViewChild('stockSymbol', { static: true })
myInputField: ElementRef;

the shortcoming: ElementRef is discouraged, because it may present some security vulnerabilities.
Instead Use the Forms API

The Angular Forms API offers ready-to-use observables that push notifications about important events
that are happening with the entire form or with form control.
instead of the chore in [1.1] and [1.2], we can use the FormControl API (1) (hooking up [formControl] with a class property)

! valueChanges (2): whenever the value of the form control changes, the underlying FormControl object emits an event
through its valueChanges property of type Observable, and you can subscribe to it.

! statusChanges— This property is an observable that emits the validity status of the form control or the entire form.
The status changes from valid to invalid or vice versa.
*/


// (1) The form elements can be bound to component properties via the formControl directive :
// and you’ll use it instead of accessing the DOM object directly with @ViewChild and ElementRef (getting a reference to the DOM object)
/*
[formControl]="classPropertyName"   // at the template

classPropertyName = new FormControl('')   // at the ts
*/

// run with :  ng serve formcontrol -o


@Component({
  selector: "app-root",
  template: `
       <h2>Observable events from formcontrol</h2>
      <input type="text" placeholder="Enter stock" [formControl]="searchInput">
    `
})
export class AppComponent {

  // (1) hook up [formControl] with a class property
  searchInput = new FormControl('');

  constructor() {

    // (2) once we hook up formControl, we can use valueChanges observable from Forms API
    this.searchInput.valueChanges
      .pipe(debounceTime(500))
      .subscribe(stock => this.getStockQuoteFromServer(stock));
  }

  getStockQuoteFromServer(stock: string) {
    console.log(`The price of ${stock} is ${(100 * Math.random()).toFixed(4)}`);
  }
}
