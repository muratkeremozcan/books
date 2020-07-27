import { Component } from '@angular/core';
import {PriceQuote} from './iprice.quote';

@Component({
  selector: 'app-root',
  // (2.3) we are getting an event from the child @Output() lastPrice with a payload of type PriceQuote
  // remember: ( ) denotes event binding, template <- ts , in this case the ts of the child component
  // to receive this event, we need  (childPropEvent) = parentHandlerFunction($event) which we handle the event with
  template: `
    AppComponent received: {{priceQuote?.stockSymbol}}
                           {{priceQuote?.lastPrice | currency:'USD'}}
   <price-quoter (lastPrice)="priceQuoteHandler($event)"></price-quoter>
    `
})
export class AppComponent {
  priceQuote: PriceQuote;

  // Receives the IPriceQuote object and uses its properties to populate the respective properties of the AppComponent
  priceQuoteHandler(inComingEvent: PriceQuote) {
    this.priceQuote = inComingEvent;
  }
}
