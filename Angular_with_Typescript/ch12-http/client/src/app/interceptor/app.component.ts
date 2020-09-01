import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';



@Component({
  selector: 'app-root',
  template: `<h1>Add new product</h1>
  <form #f="ngForm" (ngSubmit) = "addProduct(f.value)" >
    Title: <input id="productTitle" name="title" ngModel>
    <br>
    Price: <input id="productPrice" name="price" ngModel>
    <br>
    <button type="submit">Add product</button>
  </form>
  {{response$ | async}}
  `})
export class AppComponent {
  // (4.6) at the template, configure a $response that can store the result of the observable http request going out from the client
  response$: Observable<string>;

  constructor(private httpClient: HttpClient) { }

  addProduct(formValue) {
    // KEY: this is the same as [3] but we assign the result of the http post to a variable, and display it at the template
    this.response$ = this.httpClient.post<{ message: string }>('/api/product', formValue)
      // KEY: the main difference from [3] is that you don’t handle errors in the component, which renders the messages to the UI.
      // Now the LoggingInterceptor will handle all HTTP errors, and here we just diplay the .message. This is meta
      .pipe(
        map(data => data.message)
      );
  }
}

// to run:
// UI (client folder):  ng serve interceptor -o --proxy-config proxy-conf.json
// API (server folder): node build/rest-server-angular-post-errors