import { HttpClient} from '@angular/common/http';
import {Observable, EMPTY} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Component} from "@angular/core";

// [3]: very similar to [1] than [2], because it uses async pipe
// the only difference here is the error handling using catchError observable


// async pipe is awesome: receives an Observable as input, autosubscribes to it, and discards the subscription when the component gets destroyed
// because of this, you do not have to do the chore setup in ngInit in example [2]
interface Product {
  id: number,
  title: string,
  price: number
}

@Component({
  selector: 'app-root',
  template: `<h1>All Products</h1>
  <ul>
    <li *ngFor="let product of products$ | async">
      {{product.title }} {{product.price | currency}}
    </li>
  </ul>
  {{error}}
  `})
export class AppComponentAsync{

  products$: Observable<Product[]>;
  error: string;
  // note: in the real world you shoud inject httpClient into a service (business logic) rather than a component (UI)
  constructor(private httpClient: HttpClient) {
    this.products$ = this.httpClient.get<Product[]>('/api/products')
    // key difference here from [1] is error handling, we could have this there too, but we didn't
      .pipe(
        catchError( err => {
          this.error = `Can't get products. Got ${err.status} from ${err.url}`;
          return EMPTY;
          // KEY return Empty observable because if there is an error, we do not want the sub to get destroyed
          // we only want the sub destroyed when the component is no gone
        })
      );
  }
}
