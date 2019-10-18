import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'product',
  // binding the variable name to directive from forms API
  template: `<h1 class="product">Product Detail Component</h1>
             <input placeholder="Enter your name" type="text" [formControl]="name">`,
  styles: ['.product {background: cyan}']
})
export class ProductDetailComponent{
   // creating an instance of FormControl from forms API
   name: FormControl = new FormControl();
}
