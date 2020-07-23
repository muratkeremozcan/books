import { Router } from '@angular/router';
import { Component } from '@angular/core';

interface Product {
  id: number;
  description: string;
}

// (6.2) the products array in the TS is displayed
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

  // (6.1) products are defined in the TS
  products: Product[] = [
    { id: 1, description: 'iPhone 7' },
    { id: 2, description: 'Samsung 7' },
    { id: 3, description: 'MS Lumina' }
  ];

  // injects router to use navigate method
  constructor(private _router: Router) { }

  onSelect(prod: Product): void {
    // (6.3) if the product is selected, we mutate selectedProduct variable
    // and navigate to a custom route specified in the Product[] with id property
    this.selectedProduct = prod;
    this._router.navigate(['/productDetail', prod.id]);
  }
}
