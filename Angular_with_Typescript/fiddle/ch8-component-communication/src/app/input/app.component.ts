import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  // (1.2) binds the input property stockSymbol to property 'stock' & quantity property of the child component to property 'numberOfShares'
  // remember: [ ] denotes property binding, template -> ts . In this case it's the ts of the child component which is an @Input()
  // we need [propertyFromCHild] = "propertyHere"
  template: `
    <input type="text" placeholder="Enter stock (e.g. AAPL)"  (change)="onChangeEvent($event)">

    <order-processor [stockSymbol]="stock" [quantity]="numberOfShares"></order-processor>
  `
})
export class AppComponent {
  stock: string;
  readonly numberOfShares = 100; // can't use const in classes, use readonly

  onChangeEvent({target}): void {
    // (1.3) on (change) -hit enter or tab- whatever value was in the input field, gets assigned to stock property
    // stock is bound to stockSymbol @Input at the child component, and is displayed
    this.stock = target.value;
  }
}
