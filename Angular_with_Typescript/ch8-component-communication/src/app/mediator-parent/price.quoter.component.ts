import { Component, Output, EventEmitter } from '@angular/core';
import { Stock } from './istock';
import { interval } from 'rxjs';


// [3] sibling components using their parent as a mediator. The sibling components and the parent have to be in the same module.

// what is different?
// in [1]  producer -> recipient link through @Inputs
// at recipient component: @Input recipientProp   at producer component: [recipientProp] = "producerProp"

// in [2]  producer -> recipient link through @Outputs/events
// at producer component: @Output producerProperty = new EventEmitter<someType>();  at recipient component:  (producerProperty)="eventHandlerFunction($event)"

// now we have to do [1] & [2]
// high level:
// (3.1 same as 2.1) create the @Output property as an event:   @Output() producerProperty = new EventEmitter<someType>()
// (3.2 same as 2.2) emit the event:  this.producerProperty.emit(somePayload)
// (3.3 same as 2.3) create an eventHandlerFunction at the recipient
// (3.4 same as 2.4) handle the event in the template  (producerProperty)="eventHandlerFunction($event)"
// (3.5 perform [1])
// declare the @Input s at the recipient component,  at recipient:  @Input recipientProp (1.1)
// at the producer component's template use property binding:  at producer: [recipientProp] = "producerProp" (1.2)
// change the producerProp and see it reflect at recipientProp (1.3)
// one key difference: we use a setter function for the recipientProp

@Component({
  selector: 'price-quoter',
  template: `<strong>
               <button (click)="buyStocks()">Buy</button>
               {{stockSymbol}} {{lastPrice | currency: "USD"}}
             </strong>
            `,
  styles: [`:host {background: pink; padding: 5px 15px 15px 15px;}`]
})
export class PriceQuoterComponent {
  // (3.1 same as 2.1)  create the @Output property as an event:   @Output() producerProperty = new EventEmitter<someType>()
  @Output() buy: EventEmitter<Stock> = new EventEmitter();

  stockSymbol = 'IBM';
  lastPrice: number;

  // we keep randomizing lastPrice
  constructor() {
    interval(2000)
      .subscribe(data =>
        this.lastPrice = 100 * Math.random());
  }

  // just a function to emit buy event on click
  buyStocks(): void {
    const stockToBuy: Stock = {
      stockSymbol: this.stockSymbol,
      bidPrice: this.lastPrice
    };

    // (3.2 same as 2.2) emit the event:  this.producerProperty.emit(somePayload)
    this.buy.emit(stockToBuy);
  }
}
