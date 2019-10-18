import { Component } from '@angular/core';

@Component({
  // parentheses represent event binding ( )
  // square brackets represent property binding [ ],
  // To denote two-way binding, surround a template element’s ngModel with both square brackets and parentheses [(ngModel)]
  
  // the value of shipping address is displayed in <p> with interpolation {{ }}

  // type anything in the input field and the value displays in <p>  this is  ( ) par of two-way binding [( )]

  // (click) the button, the value of shippingAddress gets set and gets displayed in the input field, this is property binding [  ]


  // why use interpolation {{ }} when property binding [ ] works similarly   upwards (class to view) ?
    // you use interpolation for text , remember `${ }`

  selector: 'app-root',
  template: `
    <input type="text"
            placeholder="Enter shipping address"
            [(ngModel)]="shippingAddress">

    <button (click)="shippingAddress='123 Main Street'">Set Default Address</button>

    <p>The shipping address is {{ shippingAddress }}</p>
  `
})
export class AppComponent {
  shippingAddress: string;
}
