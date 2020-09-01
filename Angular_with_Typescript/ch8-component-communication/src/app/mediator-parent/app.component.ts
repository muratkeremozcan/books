import { Component } from '@angular/core';
import { Stock } from './istock';

// (3.4 same as 2.4) handle the event in the template  (producerProperty)="eventHandlerFunction($event)"
// (3.5) the key add-on where we perform [1]: as the mediator we have to pass the event to the child
// at recipient:  @Input recipientProp (1.1)  [recipientProp] = "producerProp" (1.2)
@Component({
  selector: 'app-root',
  template: `
    <price-quoter (buy)="priceQuoteHandler($event)"></price-quoter>

    <order-processor [stock]="receivedStock"></order-processor>
  `
})
export class AppComponent {
  receivedStock: Stock;

  // (3.3 same as 2.3)  create an eventHandlerFunction at the recipient
  priceQuoteHandler(incomingPayload: Stock) {
    this.receivedStock = incomingPayload;
  }
}
