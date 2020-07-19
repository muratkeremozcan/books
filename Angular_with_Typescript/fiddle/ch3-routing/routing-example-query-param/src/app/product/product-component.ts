import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-component',
  templateUrl: './product-component.html',
  styleUrls: ['./product-component.scss']
})
export class ProductComponent implements OnInit {
  productCategory: string;

  constructor(route: ActivatedRoute) {
    // new (3): instead of paramMap we use queryParamMap. This value is what changes the URL
    // instead of app.routing.module.ts with "route product/:id"
    // we grab this from the either:
    // app.component.ts programmatic navigation: { queryParams: {category: 'sports-prog-nav'} }
    // or from app.component.html:  [queryParams]="{category: 'sports-template-nav.'}
    // the property name in either has to match the argument of get
    this.productCategory = route.snapshot.queryParamMap.get('category');
    // this.productCategory = route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
  }

}
