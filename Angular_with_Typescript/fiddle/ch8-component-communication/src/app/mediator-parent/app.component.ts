import { Component } from '@angular/core';
import { Stock } from './istock';

// (3.3) same as (2.3), at parent:   (child1PropEvent)="parentHandlerFunction($event)"

// (3.4) the key add-on where we perform [1]: as the mediator we have to pass the event to the child
// at child @Input childProp   at parent: [childProp] = "parentProp"
@Component({
  selector: 'app-root',
  template: `
    <price-quoter (buy)="priceQuoteHandler($event)"></price-quoter>

    <order-processor [stock]="receivedStock"></order-processor>
  `
})
export class AppComponent {
  receivedStock: Stock;

  priceQuoteHandler(inomingEvent: Stock) {
    this.receivedStock = inomingEvent;
  }
}
