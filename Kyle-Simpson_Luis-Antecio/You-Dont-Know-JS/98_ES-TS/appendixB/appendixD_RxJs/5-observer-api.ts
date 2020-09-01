import { Observable } from 'rxjs';
// How can an observable communicate with the provided observer? By invoking the following functions on the observer object:
//  next(), to push the next data element to the observer
//  error(), to push the error message to the observer
//  complete(), to send a signal to the observer about the end of a stream

function getObservableBeer() {
  // Observable.create(myObserver) — creates an Observable that can invoke methods on myObserver
  // Observable.create( observer => observer.next(data) )

  return Observable.create(observer => { // observable get created, we specify how it treats its observer

    const beers = [
      { name: "Stella", country: "Belgium", price: 9.50 },
      { name: "Sam Adams", country: "USA", price: 8.50 },
      { name: "Bud Light", country: "USA", price: 6.50 },
      { name: "Brooklyn Lager", country: "USA", price: 8.00 },
      { name: "Sapporo", country: "Japan", price: 7.50 }
    ];

    beers.forEach( beer => observer.next(beer)); // Observable pushes the next beer/data to the observer

    observer.complete(); // push the end-of-stream message
  });
}
// someObservable.subscribe(myObserver);

getObservableBeer().subscribe( // observer subscribes to the observable
  beer => console.log(`Subscriber got ${beer.name}`),
  error => console.error(error),
  () => console.log('the stream is over')
);
