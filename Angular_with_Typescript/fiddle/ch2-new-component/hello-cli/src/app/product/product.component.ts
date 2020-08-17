import { Component, OnInit } from '@angular/core';

// (1.1) component basics & cli
@Component({
  // app- is the default prefix for apps
  // you can change the prefix with: ng g c product -prefix hello
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
 // OnInit is one of the lifecycle interfaces that require the implementation of ngOnInit().
export class ProductComponent implements OnInit {

  constructor() { }

  // ngOnInit is a lifecyle method
  // If implemented, ngOnInit() is invoked after the code in the constructor
  ngOnInit() {
  }

}

