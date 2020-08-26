import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private router: Router) { }

  // (3.2 alternative config for prog nav): for query params with programmatic navigation, you need to have access to the Router object.
  showSportingProducts() {
    this.router.navigate(['/product'], { queryParams: { category: 'sports-prog-nav' } });
    // goes to http://localhost:4200/product?category=sports-prog-nav
    // this.router.navigate([`/product/${this.productId}`]);
    // http://localhost:4200/products/1234
    // comparison to [1]
  }
}
