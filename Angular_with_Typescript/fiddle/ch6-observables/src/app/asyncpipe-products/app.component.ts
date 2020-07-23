import { Component } from '@angular/core';
import { Product, ProductService } from './product.service';
import { Observable } from 'rxjs';

// [5] : [4] but more complex with observable array iteration
// KEY: iterate through the Observable<Product[]> which will get assigned to product$ and async pipe
@Component({
  selector: 'app-root',
  template: `
    <ul>
      <li *ngFor="let product of products$ | async">
        {{product.title }} {{product.price | currency: "USD"}}
      </li>
    </ul>
  `
})
export class AppComponent {

  // need this as a placeholder because we will assign getProducts() to it
  products$: Observable<Product[]>;

  // the service needs to be defined in the constructor
  constructor(private productService: ProductService) { }

  // not that there is no need for subscribe; async pipe takes care of it
  // until async pipe subscrbes to the observable, note that there is no data
  ngOnInit() {
    this.products$ = this.productService.getProducts();
  }
}

/* async as example : useful for creating a local template variable and then using it more in the template
<div *ngIf="product$ | async as product">
 <h4>{{ product.price}}</h4>
  <p>{{ product.title }} </p>
</div>
*/