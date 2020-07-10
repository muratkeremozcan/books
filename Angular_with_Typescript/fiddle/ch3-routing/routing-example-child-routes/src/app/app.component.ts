import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  productId = 1234;

  // Angular injects the instance of Router into the router variable
  constructor(private router: Router) { }

  // navigates to configured product route programmatically
  navigateToProductDetail() {
    // Passing Data into Routes (2): alternative to template: define the route this data will be at
    this.router.navigate([`/product/${this.productId}`]);
    // if you don't want to show the URL of the current route, use skipLocationChange directive
    // this.router.navigate([`/product/${this.productId}`], {skipLocationChange: true});
  }
}
