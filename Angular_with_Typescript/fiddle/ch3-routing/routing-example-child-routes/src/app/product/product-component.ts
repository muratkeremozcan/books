import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-component',
  templateUrl: './product-component.html',
  styleUrls: ['./product-component.scss']
})
export class ProductComponent implements OnInit {
  productId: string;
  sellerID = 5678;

  constructor(route: ActivatedRoute) {
    this.productId = route.snapshot.paramMap.get('idProduct');
  }

  ngOnInit() {
  }

}
