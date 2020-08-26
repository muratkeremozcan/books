import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, Subscription} from "rxjs";
import {Component, OnInit} from "@angular/core";

// [1.1]: very similar to [1] (use async pipe [1], unless you have to manipulate the data [1.1])
// the key difference is not using async pipes in the template [1.5] to auto subscribe to the observable
// because of this we have to setup ngOnInit() to process the observable


interface Product {
  id: number,
  title: string,
  price: number
}

@Component({
  selector: 'app-root',
  template: `<h1>All Products</h1>
  <ul>
    <li *ngFor="let product of products">
       {{product.title}}: {{product.price | currency}}
    </li>
  </ul>
  {{error}}
  `})
export class AppComponent implements OnInit{

  products: Product[] = [];
  theDataSource$: Observable<Product[]>;
  productSubscription: Subscription;
  error: string;

  // same as [1], we make the get request to get the data
  constructor(private httpClient: HttpClient) {
    this.theDataSource$ = this.httpClient.get<Product[]>('/api/products');
  }


  // the key difference here: once we have the data, we have to process the observable
  ngOnInit() { // remember: subscribe can take 3 callbacks: return fn, err fn, and even a complete fn
    this.productSubscription = this.theDataSource$.subscribe(
      data => this.products = data,
      (err: HttpErrorResponse) => this.error = `Can't get products. Got ${err.message}`
    );
  }
  // note that httClient unsubscribes automatically, therefore no need to unsubscribe from the observable
}

// KEY when running the example
// ng serve restclient -o --proxy-config proxy-conf.json
// configure the proxy-conf.json file to use the server's url, so that any request at the client is hijacked and instead received from the server
// this proxy config setting is great because it lets you have the hot reload of your app on any code change and access data from another server without the need to deploy the app there.

// if you want to toggle the effect, just server without the proxy-config
// ng serve restclient -o

// also mind you that you always have to run the node server:  node build/rest-server-angular or whatever js file with server name


// to run:
// UI (client folder):  ng serve restclient -o
// API (server folder): node build/rest-server.js