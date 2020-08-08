import {Component} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

// [3] this is an example of POST request from the UI (via form submit) and the server responding
// high level:
// (3.1) first setup the server to handle the post request
// (3.2) use httpClient.post to send the payload, and handle the response received in the subscribe

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
     {{response}}
  `})
export class AppComponent {
  response: string;

  // (3.2.1) inject httpClient so it can be used in the function below
  constructor(private httpClient: HttpClient) {}

  // (3.2.2) need an argument to store the payload to include in the POST request
  addProduct(payload){
    this.response = ''; // just a dumb variable to store the response we get from POST

    // (3.2.3) post to the server with the payload: this be just a js object {title: "abc", price: "123"}
    // httpCLient turns the JS object into JSON {"title":"abc","price":"123"}
    this.httpClient.post<string>('/api/product', payload)
      .subscribe( // (3.2.4) handle the response in a subscribe
        // the response is setup to be an object with a propertery named 'message'
        data =>  this.response = data['message'],
        // err.error.message  may contain more info. To trigger an error, modify the response from the server not to be a JSON
        (err: HttpErrorResponse) =>
            this.response = `Can't add product. Error code:
              ${err.message} ${err.error.message}`
      );
  }
}

// to run: ng serve restclientpost -o --proxy-config proxy-conf.json
