import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product.model';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  // providers: [ProductService]
})
export class ProductDetailComponent implements OnInit {

  product: Product;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) { }

  ngOnInit() {
    const proId: number = parseInt(this.route.snapshot.params['productId']);
    this.product = this.productService.getProductById(proId);
  }

}
