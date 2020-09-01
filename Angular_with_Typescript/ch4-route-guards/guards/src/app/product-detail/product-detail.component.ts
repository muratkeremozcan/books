import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms'; // enables assigning class members to [formControl]

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  name: FormControl = new FormControl();

  constructor() { }

  ngOnInit() {
  }

}
