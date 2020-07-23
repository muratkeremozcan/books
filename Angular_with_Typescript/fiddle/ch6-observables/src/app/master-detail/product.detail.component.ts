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

    // [6] previously with routes we used snapshot property to get the route value
    // this.productId = route.snapshot.paramMap.get('idProduct');
    // this is ok if the route parameters do not change
    // if the route parameters can change (ex: many different products)
    // it is cost effective to subscribe to an observable instead (ActivatedRoute.paramMap)
    // which can retrieve multiple values from the same parameter (which is id in this case)

    // at app.module.ts, the route is looking like this:
    //  {path: 'productDetail/:id', component: ProductDetailComponent}

    this.route.paramMap.subscribe(
        // KEY  (6.4) here, whatever the id might be, we retrieve it from the route with the observable
        // then assign it to productId
        params => this.productId = params.get('id'));
  }
}
