import { Component } from '@angular/core';
import {PriceQuote} from './iprice.quote';

@Component({
  selector: 'app-root',
  // (2.4) handle the event in the template  (producerProperty)="eventHandlerFunction($event)""
  // we are getting an event from the @Output() lastPrice with a payload of type PriceQuote
  // remember: ( ) denotes event binding, template <- ts , in this case the ts of the output component
  template: `
    AppComponent received: {{priceQuoteRecipient?.stockSymbol}}
                           {{priceQuoteRecipient?.lastPriceRandom | currency:'USD'}}
   <price-quoter (lastPrice)="priceQuoteHandler($event)"></price-quoter>
    `
})
export class AppComponent {
  priceQuoteRecipient: PriceQuote;

  // (2.3) create an eventHandlerFunction at the recipient
  // Receives the IPriceQuote object and uses its properties to populate the respective properties of the AppComponent
  priceQuoteHandler(inComingPayload: PriceQuote) {
    this.priceQuoteRecipient = inComingPayload;
  }
}
