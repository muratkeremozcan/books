// Flatmap treats each item emitted by an observable as another observable
// it takes an emitted item from the outer observable and unwraps its content (the inner observable) into the flattened output observable stream. 
// The flatMap operator merges the emissions of the inner observables

// from(beers) // synchronous observable
// from(beers, Scheduler.async) // asynchronous observable

import { from, Observable, Scheduler } from 'rxjs';
import { flatMap } from 'rxjs/operators';

function getDrinks() {

  const beers$ = from([ // async observable
    { name: "Stella", country: "Belgium", price: 9.50 },
    { name: "Sam Adams", country: "USA", price: 8.50 },
    { name: "Bud Light", country: "USA", price: 6.50 }
  ], Scheduler.async);

  const softDrinks$ = from([  // async observable
    { name: "Coca Cola", country: "USA", price: 1.50 },
    { name: "Fanta", country: "USA", price: 1.50 },
    { name: "Lemonade", country: "France", price: 2.50 }
  ], Scheduler.async);

  // Observable.create(myObserver) — creates an Observable that can invoke methods on myObserver
  return Observable.create(observer => {
    observer.next(beers$); // emit beers
    observer.next(softDrinks$); // emit softDrinks
    observer.complete();
  });
}
// We want to "unload" each palette and print each drink info

getDrinks()
  .pipe(
    flatMap(drinks => drinks)) // unloads drinks from pallets to a merged observable
  .subscribe( // subscribes to the merged observable
    drink => console.log(drink),
    // drink => console.log(`Subscriber got ${drink.name}: ${drink.price}`),
    error => console.error(error),
    () => console.log("The stream of drinks is over")
  );



// flatNap note

// Taking input as an array A having some elements. 
// var A = [ 1, 2, 3, 4, 5 ];

// Mapping with map function. 
// let b = A.map(x => [x * 3]); 
// [[3], [6], [9], [12], [15]]
  
// Mapping and flatting with flatMap() function. 
// let c = A.flatMap(x => [x * 3]); 
// [3, 6, 9, 12, 15]
  
// Mapping and flatting with flatMap() function. 
// let d = A.flatMap(x => [[ x * 3 ]]); 
// [[3], [6], [9], [12], [15]]