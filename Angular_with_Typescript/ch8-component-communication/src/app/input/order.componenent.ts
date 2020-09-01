import { Component, Input } from '@angular/core';

// [1] components receiving values from other components:   [@Input/recipientProp] = "producerProp"
// in Angular, components receive values from the outside with @Input()
// you can bind the producers of these values to the corresponding inputs of the component.

// high level:
// declare the @Input s at the recipient component,  at recipient:  @Input recipientProp (1.1)
// at the producer component's template use property binding:  at proucer: [recipientProp] = "producerProp" (1.2)
// change the producerProp and see it reflect at recipientProp (1.3)

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
