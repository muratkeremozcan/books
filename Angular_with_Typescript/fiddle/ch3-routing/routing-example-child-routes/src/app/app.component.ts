import { Component } from '@angular/core';
import { Router } from '@angular/router';

// exactly the same as basic routes example in [1]

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  productId = 1234;

  constructor(private router: Router) { }

  navigateToProductDetail() {
    this.router.navigate([`/product/${this.productId}`]);
  }
}
