import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../shared/product.service';

@Component({
  selector: 'nga-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {

  // the Product to render will be given to ProductItemComponent via its property 'product' decorated with @Input().
  @Input() productItem: Product;

  constructor() { }

  ngOnInit() {
  }

}
