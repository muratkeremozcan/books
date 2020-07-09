import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-component',
  templateUrl: './product-component.html',
  styleUrls: ['./product-component.scss']
})
export class ProductComponent implements OnInit {
  productId: string; // this is the same variable in the app.component, we need it referred to here so that the activated route can set it

  // the ActivatedRoute object reprsents the destination route that is ProductComponent and is injected into the constructor
  constructor(route: ActivatedRoute) {
    // Gets the value of the parameter named id and assigns it to the productID class variable, which is used in the template via {{ }}
    // the 'id' is coming from the path definition in app-routing-module.ts:  path: 'product/:id
    // Passing Data into Route (3): the value of prodctId is defined at app.component.ts
    // we need to hook that vale to this route and indicate that when we are at this route this component should be displayed
    // and binding {{ }} should work
    this.productId = route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
  }

}
