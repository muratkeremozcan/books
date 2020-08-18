import { Router } from '@angular/router';
import { Component } from '@angular/core';


// [6] using observables for changing routes that use route parameters

// high level
// at app.module.ts, the route setup is looking usual, like this:  { path: 'productDetail/:id', component: ProductDetailComponent } (6.1)
// implement a navigation event function that navs to a route (6.2)
// KEY using this.route.paramMap.subscribe(..) retrieve the route parameter and display something relevant to that route(6.3)


// previously with routes we used snapshot property to get the route value:  this.productId = route.snapshot.paramMap.get('idProduct');
// this is ok if the route parameters do not change
// if the route parameters can change (ex: many different products) it is cost effective to subscribe to an observable instead (ActivatedRoute.paramMap)
// which can retrieve multiple values from the same parameter (which is id in this case)



interface Product {
  id: number;
  description: string;
}

//  the products array in the TS is displayed
@Component({
  selector: 'app-root',
  template: `
    <ul style="width: 100px;">
      <li *ngFor="let product of products"
          [class.selected]="product === selectedProduct"
          (click)=onSelect(product)>
        <span>{{product.id}} {{product.description}} </span>
      </li>
    </ul>

    <router-outlet></router-outlet>
  `,
  styles: [`.selected {background-color: cornflowerblue}`]
})
export class AppComponent {

  selectedProduct: Product;

  //  products are defined in the TS
  products: Product[] = [
    { id: 1, description: 'iPhone 7' },
    { id: 2, description: 'Samsung 7' },
    { id: 3, description: 'MS Lumina' }
  ];

  // injects router to use navigate method
  constructor(private _router: Router) { }

  // (6.2) implement a navigation event function that navs to a route
  onSelect(prod: Product): void {
    // if the product is selected, we mutate selectedProduct variable
    // and navigate to a custom route specified in the Product[] with id property
    this.selectedProduct = prod;
    this._router.navigate(['/productDetail', prod.id]);
  }
}
