import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'product',
  template: `<h3 class="product">Details for product id {{productId}}</h3>`,
  styles: ['.product {background: cyan; width: 200px;} ']
})
export class ProductDetailComponent {

  productId: string;

  constructor(private route: ActivatedRoute) {

    this.route.paramMap.subscribe(
        // KEY  (6.3) here, whatever the id might be, we retrieve it from the route with the observable
        // then assign it to productId
        params => this.productId = params.get('id'));
  }
}
