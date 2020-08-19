import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  // (1.2) at proucer: [recipientProp] = "producerProp"
  // binds the input property stockSymbol to property 'stock' & quantity property of the child component to property 'numberOfShares'
  // remember: [ ] denotes property binding, template -> ts . In this case it's the ts of the other component which is an @Input()
  template: `
    <input type="text" placeholder="Enter stock (e.g. AAPL)"  (change)="onChangeEvent($event)">

    <order-processor [stockSymbol]="stock" [quantity]="numberOfShares"></order-processor>
  `
})
export class AppComponent {
  stock: string;
  readonly numberOfShares = 100; // can't use const in classes, use readonly

  // (1.3) change the producerProp and see it reflect at recipientProp   value -> stock -> stockSymbol
  onChangeEvent({target}): void {
    // on (change) -hit enter or tab- whatever value was in the input field, first gets assigned to stock property
    // stock is bound to stockSymbol @Input at the other component, so then in turn the and is displayed there :
    this.stock = target.value;
  }
}
