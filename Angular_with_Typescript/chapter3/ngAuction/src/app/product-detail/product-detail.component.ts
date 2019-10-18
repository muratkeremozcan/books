import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../shared/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'auction-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  product: Product;

  // both ActivatedRoute and ProductService are injected into the constructor
  constructor(private route: ActivatedRoute,
    private productService: ProductService) { }

  ngOnInit() {
    // Extracts the parameter productId from the ActivatedRoute
    const prodId: number = parseInt(this.route.snapshot.params['productId']);
    // Invokes getProductById() on the service, providing prodId as an argument
    this.product = this.productService.getProductById(prodId);
  }

}
