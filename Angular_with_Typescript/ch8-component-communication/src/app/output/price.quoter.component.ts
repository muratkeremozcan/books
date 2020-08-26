import { Component, Output, EventEmitter } from '@angular/core';
import { PriceQuote } from './iprice.quote';
import { interval } from 'rxjs';


// [2] component sending values to other components using events
// if a component needs to communicate values to the outside world, can emit events through its @Output()
// Angular components can dispatch custom events using the EventEmitter object.
// EventEmitter is a subclass of Subject; Subjects can serve as both observable and observer,

// high level:
// create the @Output property as an event:   @Output() producerProperty = new EventEmitter<someType>();  (2.1)
// and then emit the event:  this.producerProperty.emit(somePayload)  (2.2)
// create an eventHandlerFunction at the recipient (2.3)
// handle the event in the template  (producerProperty)="eventHandlerFunction($event)" (2.4)

@Component({
  selector: 'price-quoter',

  // with ?, the template variables will display only when they get values
  template: `<strong>Inside PriceQuoterComponent:
               {{priceQuoteProducer?.stockSymbol}}
               {{priceQuoteProducer?.lastPriceRandom | currency:'USD'}}</strong>`,
  styles: [`:host {background: pink;}`]
})
export class PriceQuoterComponent {
  // (2.1) create the @Output property as an event:   @Output() producerProperty = new EventEmitter<someType>()
  @Output() lastPrice = new EventEmitter<PriceQuote>();

  priceQuoteProducer: PriceQuote;

  constructor() {
    interval(2000) // emulates changing prices and populates the priceQuote object
      .subscribe(() => {
        this.priceQuoteProducer = {
          stockSymbol: 'IBM',
          lastPriceRandom: 100 * Math.random()
        };

        // (2.2) emit the event:  this.producerProperty.emit(somePayload)
        this.lastPrice.emit(this.priceQuoteProducer);
      })
  }
}
