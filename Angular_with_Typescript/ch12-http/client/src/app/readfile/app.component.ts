import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Component } from '@angular/core';

// [1] using HttpClient to read local data
// high level:
// set up the interfaces and the typed observable (1.1, 1.2)
// inject the httpClient into the constructor so you can use it (1.3)
// make a request using the httpClient observable (1.4)
// display it in the template using pipes which auto-subscribe to the observable(1.5)

// (1.1) declares a product type
interface Product {
  id: string;
  title: string;
  price: number;
}

// (1.5) Iterates through the observable products and autosubscribes to them with the async pipe. Formats with currency pipe
@Component({
  selector: 'app-root',
  template: `<h1>Products</h1>
  <ul>
    <li *ngFor="let product of products$ | async">
      {{product.title }}: {{product.price | currency}}
    </li>
  </ul>
  `})
export class AppComponent {

  // (1.2) declares a typed observable for products, using TypeScript generics to specify the type of data expected
  // note:the type annotation doesn’t enforce or validate the shape of the data returned by the server;
  // it just makes the other code aware of the expected server response.
  products$: Observable<Product[]>;

  // (1.3) to use the HttpClient service, you need to inject it into a service or component (via the constructor)
  // note: usually, injectable services require a provider declaration
  // For HttpClient, providers are declared in HttpClientModule, so you don’t need to declare them in your @NgModule.
  constructor(private httpClient: HttpClient) {

    // simple get (1.4)
    // this.products$ = this.httpClient.get<Product[]>('/data/products.json');

    // alternative: how do we specify additional headers and query parameters?
    // Since you simply read a file, passing query parameters doesn’t make much sense,
    //  but if you needed to make a similar request to a server’s endpoint that knows how to search products by title,
    // the code would look like the below.
    // Using the chainable set() method, you can add as many headers or query parameters as needed.

    // extra: Creates the HttpHeaders object with two additional headers
    const httpHeaders = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Basic QWxhZGRpb');

    // extra: creates the object with one query parameter (it can be any object literal)
    const httpParams = new HttpParams()
      .set('title', 'First');

    // (1.4) makes an HTTP GET request specifying the type of the expected data
    this.products$ = this.httpClient.get<Product[]>('/data/products.json',
      // extra: Passes the headers and query parameters as a second argument of get()
      {
        headers: httpHeaders,
        params: httpParams
      }
    );
  }
}


// to run:
// UI (client folder):  ng serve readfile -o
// API (server folder): node build/rest-server.js
