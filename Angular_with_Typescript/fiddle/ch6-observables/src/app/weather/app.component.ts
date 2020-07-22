import { Component, OnInit } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { FormControl } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { catchError, debounceTime, switchMap } from "rxjs/operators";

/* In [2] we used math random to get values and got them every time
In a real-world application, the user’s typos may generate network requests that introduce delays..
while returning data for mistakenly entered values. How would you go about discarding the results of unwanted requests?

switchMap() to the rescue, becaue this operator switches to the latest observable (in the below example 1st observable is what is typed)
and can cancel previous in-flight network requests
it is great for typeahead; we are typing, http.gets are going out, but we typed something wrong
We want the previous in flight request cancelled and we want to switch the most recent request. Of course, we should wait in between...
For the wait, debounceTime() operator is great because it shifts the pipeline by delay amount
and passes only the most recent value from each burst of emissions


ng serve weather -o
*/


@Component({
  selector: "app-root",
  template: `
    <h2>Observable weather</h2>
    <input type="text" placeholder="Enter city" [formControl]="searchInput">
    <h3>{{weather}}</h3>
  `
})

export class AppComponent implements OnInit {

  // To run this app, you need to first request your own free key at http://api.openweathermap.org and replace myKey with your own key.
  myKey = '90a5c721b2c5f108c1cdacc069932e52';
  private baseWeatherURL = 'http://api.openweathermap.org/data/2.5/weather?q=';
  private urlSuffix = `&appid=${this.myKey}&units=metric`;

  searchInput = new FormControl();   // (1) hook up [formControl] with a class property
  weather: string;

  constructor(private http: HttpClient) { } // http client of Angular is all Observables, has to be in the constructor

  // Creates the subscription in ngOnInit(), which is invoked after component properties are initialized
  ngOnInit() {

    // switchMap operator takes the entered value from the input field (the first observable)
    // and passes it to the getWeather() method, which issues the HTTP request to the weather service.
    this.searchInput.valueChanges
      .pipe(
        debounceTime(300),
        switchMap(city => this.getWeather(city)) // formControl is the outer observable, getWeather is the inner
      )
      .subscribe( // subscribe to handle the data
        res => {
          this.weather =
            `Current temperature is  ${res['main'].temp} Celsius, ` +
            `humidity: ${res['main'].humidity}%`;
        },
        err => console.log(`Can't get weather. Error code: %s, URL: %s`, err.message, err.url)
      );
  }

  getWeather(city: string): Observable<any> {
    // catchError operator is great for error checking. use .status to access the status code,
    // and return EMPTY to keep the app running while console
    // Imagine a slow typer who enters Lo while trying to find the weather in London.
    // The HTTP request for Lo goes out, a 404 is returned, and you create an empty observable
    // so the subscribe() method will get an empty result, which is not an error.

    return this.http.get(this.baseWeatherURL + city + this.urlSuffix) // this is just the specifics of the GET request for the weather API
      .pipe(
        catchError(err => {
          if (err.status === 404) {
            console.log(`City ${city} not found`);
            return EMPTY;
          } else if (err.status === 401) {
            console.log(`
              To run this app, you need to first request your own free key
              at http://api.openweathermap.org and replace ${this.myKey} with your own key.
              Otherwise you'll get the 401 error
            `);
            return EMPTY;
          }
        })
      );
  }
}
