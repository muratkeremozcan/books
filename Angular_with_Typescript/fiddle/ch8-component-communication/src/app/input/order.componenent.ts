import { Component, Input } from '@angular/core';

// [1] in Angular, components receive values from the outside with @Input()
// you can bind the producers of these values to the corresponding inputs of the component.


@Component({
  selector: 'order-processor',
  template: `
    <span *ngIf="!!stockSymbol">Buying {{quantity}} shares of {{stockSymbol}}</span>
  `,
  styles: [`:host {background: cyan;}`]
})
export class OrderProcessorComponent {
  // (1.1) declares input properties to receive values
  @Input() quantity: number;
  @Input() stockSymbol: string;
}
