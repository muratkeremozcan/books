import { Component, Input } from '@angular/core';
import { Stock } from './istock';

@Component({
  selector: 'order-processor',
  template: `{{message}}`,
  styles: [`:host {background: cyan;}`]
})
export class OrderComponent {

  message = 'Waiting for orders...';
  // (3.4) the key add-on where we perform [1]: as the mediator we have to pass the event to the child
  // at child @Input childProp   at parent: [childProp] = "parentProp"
  // one key difference: we use a setter function for the property
  @Input() set stock(value: Stock) {
    if (value && value.bidPrice !== undefined) {
      this.message = `Placed order to buy 100 shares
                          of ${value.stockSymbol}
                          at \$${value.bidPrice.toFixed(2)}`;
    }
  }
}

