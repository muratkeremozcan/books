import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { fromEvent } from "rxjs";
import { debounceTime, map } from 'rxjs/operators';


/*
[1]
To turn a DOM event into an observable stream, you need to do the following:

1.  Get a reference to the DOM object (using @ViewChild)
2.  Create an observable using Observable.fromEvent(), providing the reference to the DOM object and the event you want to subscribe to.
3.  Subscribe to this observable and handle the events.

  to run this example : ng serve fromevent -o

  the --app or app= are outdated
  also had to work around the compilation errors with this
  https://stackoverflow.com/questions/48797135/missing-ts-files-due-to-npm-link/48798373#48798373
*/


@Component({
  selector: "app-root",
  template: `
    <h2>Observable events </h2>
    <input type="text" #stockSymbol placeholder="Enter stock" >
  `
})
export class AppComponent implements AfterViewInit {

  // (1) Get a reference to the DOM object (using @ViewChild)
  // In a regular JavaScript app, to get a reference to the DOM element, you use a DOM selector API, document.querySelector().
  // In Angular, you can use the @ViewChild() decorator to get a reference to an element from a component template.
  @ViewChild('stockSymbol', { static: true })
  // Declares the property myInputField that holds a reference to the <input> field
  // the shortcoming: ElementRef is discouraged, because it may present some security vulnerabilities. Instead Use the Forms API
  myInputField: ElementRef;

  // Places the code in the ngAfterViewInit() component lifecycle method
  ngAfterViewInit() {

    // (2) Create an observable using fromEvent(), providing the reference to the DOM object and the event you want to subscribe to.
    let keyup$ = fromEvent(this.myInputField.nativeElement, 'keyup');

    // (3) Subscribe to this observable and handle the events.
    keyup$
      .pipe(
        debounceTime(500), //  Waits for a 500 ms pause in the observable’s emissions
        map(event => event['target'].value)) // Converts the DOM event into the target.value property
      //  Invokes the getStockQuoteFromServer() method for each value emitted by the observable and prints out the result
      .subscribe(stock => this.getStockQuoteFromServer(stock));
  }

  getStockQuoteFromServer(stock: string) {
    console.log(`The price of ${stock} is ${(100 * Math.random()).toFixed(4)}`);
  }
}











/*
import {Component, ViewChild, ElementRef} from '@angular/core';

import 'rxjs/add/operator/sample';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/do';
import {Observable} from "rxjs/Observable";

@Component({
  selector: "app-root",
  template: `
       <h2>Sharing the same stream from keyup event</h2>
      <input #myinput type="text" placeholder="Start typing" >

      <br> Subscribing to each value: {{data1}}
      <p>
      <br> Subscribing to 3-second samples: {{data2}}
    `
})
export class AppComponent {
  @ViewChild('myinput')
  myInputField: ElementRef;  // Using ElementRef is discouraged

  data1: string;
  data2: string;

  ngAfterViewInit(){

    let keyup$: Observable<any> = Observable.fromEvent(this.myInputField.nativeElement, 'keyup');

    let keyupValue$ = keyup$
      .do(vevent => console.log(event))
      .map(event => event.target.value)
      .share();

    // Subscribe to each keyup
    keyupValue$
      .subscribe(value => this.data1 = value);

    // Subscribe to 3-second samples
    keyupValue$
      .sample(Observable.interval(3000))
      .subscribe(value => this.data2 = value);
  }

}

// @HostListener offers an alternatve way to listen to native events without subscribe()
*/
