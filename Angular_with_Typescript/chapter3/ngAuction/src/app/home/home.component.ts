import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../shared/product.service';

@Component({
  selector: 'nga-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products: Product[] = [];
  constructor(private productService: ProductService) { } // inject ProductService

  ngOnInit() { // lifecycle method onInit is invoked right after the constructor
    this.products = this.productService.getProducts(); // use productService to retrieve products
  }

}
