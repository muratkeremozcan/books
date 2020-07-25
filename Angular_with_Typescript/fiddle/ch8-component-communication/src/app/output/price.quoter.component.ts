import { Component, Output, EventEmitter } from '@angular/core';
import { PriceQuote } from './iprice.quote';
import { interval } from 'rxjs';


// [2] if a component needs to communicate values to the outside world, can emit events through its @Output()
// Angular components can dispatch custom events using the EventEmitter object.

// EventEmitter is a subclass of Subject that can serve as both observable and observer,
// typically you use EventEmitter just for emitting custom events that are handled in the template of the parent component.


@Component({
  selector: 'price-quoter',

  // with ?, the template variables will display only when they get values
  template: `<strong>Inside PriceQuoterComponent:
               {{priceQuote?.stockSymbol}}
               {{priceQuote?.lastPrice | currency:'USD'}}</strong>`,
  styles: [`:host {background: pink;}`]
})
export class PriceQuoterComponent {
  // (2.1) the output property is represented by the EventEmitter object
  @Output() lastPrice = new EventEmitter<PriceQuote>();

  priceQuote: PriceQuote;

  constructor() {
    interval(2000) // emulates changing prices and populates the priceQuote object
      .subscribe(() => {
        this.priceQuote = {
          stockSymbol: 'IBM',
          lastPrice: 100 * Math.random()
        };

        // (2.2) the output property is used to emit a custom payload
        this.lastPrice.emit(this.priceQuote);
      })
  }
}
