import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import 'rxjs/Rx';


// An observable can emit an error by invoking the error() function on the observer, but when the error() method is invoked, the stream completes.
// RxJS offers several operators to intercept and handle an error before it reaches the code in the error() method on the observer:
//  catchError(error)—Intercepts an error, and you can implement some business logic to handle it
//  retry(n)—Retries an erroneous operation up to n times
//  retryWhen(fn)—Retries an erroneous operation as per the provided function

function getData() {
  const beers = [
    { name: "Sam Adams", country: "USA", price: 8.50 },
    { name: "Bud Light", country: "USA", price: 6.50 },
    { name: "Brooklyn Lager", country: "USA", price: 8.00 },
    { name: "Sapporo", country: "Japan", price: 7.50 }
  ];

  return Observable.create(observer => {
    let counter = 0;
    beers.forEach(beer => {
      observer.next(beer); // emit the beer
      counter++;

      if (counter > Math.random() * 5) { // randomly generate a 500 error
        observer.error({
          status: 500,
          description: 'Beer stream error'
        });
      }
    });
    observer.complete();
  });
}

// subscribing to data from the primary source

getData()
  .pipe(
    catchError(err => { // intercepts the error before it reaches the observer
      console.error(`Got ${err.status}: ${err.description}`);
      if (err.status === 500) {
        console.error(">>> Retrieving cached data");
        return getCachedData(); // fails over to the alternative data source
      } else {
        return EMPTY; // does not handle non-500 errors, returns an empty observable to complete the stream
      }
    }),
    map(beer => `${beer.name}, ${beer.country}`)
  )
  .subscribe(
    beer => console.log(`Subscriber got ${beer}`),
    err => console.error(err),
    () => console.log("The stream is over")
  );

function getCachedData() { // the alternate data source for failover
  const beers = [
    { name: "Leffe Blonde", country: "Belgium", price: 9.50 },
    { name: "Miller Lite", country: "USA", price: 8.50 },
    { name: "Corona", country: "Mexico", price: 8.00 },
    { name: "Asahi", country: "Japan", price: 7.50 }
  ];
  return Observable.create(observer => {
    beers.forEach(beer => {
      observer.next(beer);
    });
    observer.complete();
  });
}
