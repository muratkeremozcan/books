// listing 2.1
import { Component, OnInit } from '@angular/core';

// under the hood the decorator @Component attaches additional data (metadata) to the class
@Component({
  // other components can include this component in their templates by using the <app-product> tag
  selector: 'app-product',
  // template property with inlined HTML
  template: `
    <p>
      product works!
    </p>
  `,
  // styles property with inlined CSS
  styles: []
})
export class ProductComponent implements OnInit { // implementing OnInit requires ngOnInit() method in the class

  constructor() { }

  ngOnInit() { // a lifecycle method, invoked after the code in the constructor
  }

}
