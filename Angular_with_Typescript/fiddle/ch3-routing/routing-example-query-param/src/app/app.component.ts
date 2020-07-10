import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  productCategory = 'super duper category';

  // injects the router object
  constructor(private router: Router) { }

  // new (2): To pass query parameters using programmatic navigation, you need to have access to the Router object.
  showSportingProducts() {
    this.router.navigate(['/product'], { queryParams: {category: 'sports-prog-nav'}});
  }
  // navigateToProductDetail() {
  //   this.router.navigate([`/product/${this.productId}`]);
  // }

}
