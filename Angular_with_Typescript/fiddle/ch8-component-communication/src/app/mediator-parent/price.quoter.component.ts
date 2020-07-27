import { Component, Output, EventEmitter } from '@angular/core';
import { Stock } from './istock';
import { interval } from 'rxjs';


// [3] sibling components use their parent as a mediator.

// what is different?
// in [1]  parent -> child link through inputs
// at child: @Input childProp   at parent: [childProp] = "parentProp"

// in [2]  parent <- child link through outputs/events
// at child: @Output childPropEvent   at parent: (childPropEvent) = "parentHandlerFunction($event)""

// now we have to do [2] + [1]

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
  // (3.1) this is the same as [2.1], at child1: @Output child1PropEvent
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

    // (3.2) same as [2.2], the output property is used to emit a custom payload
    this.buy.emit(stockToBuy);
  }
}
