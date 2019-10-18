// reduce

// The reduce operator has two arguments: an accumulator function (acc, curr) specifies how to aggregate the values,
// and the initial (seed) value

// acc stores the accumulated value
// curr stores the emitted value

import { from } from 'rxjs';
import { map, tap, reduce } from 'rxjs/operators';

const beers = [
  { name: "Stella", country: "Belgium", price: 9.50 },
  { name: "Sam Adams", country: "USA", price: 8.50 },
  { name: "Bud Light", country: "USA", price: 6.50 },
  { name: "Brooklyn Lager", country: "USA", price: 8.00 },
  { name: "Sapporo", country: "Japan", price: 7.50 }
];

from(beers)
  .pipe(
    map(beer => beer.price),
    reduce((total, price) => total + price, 11) // (accumulated, current) , initial
  ).subscribe(
    totalPrice => console.log(totalPrice),
    err => console.error(err),
    () => console.log('Streaming is over')
  );

// tap operator

// The tap operator can perform a side effect (for example, log some data) for every value emitted by the source observable,
//  but return an observable that’s identical to the source. In particular, these operators can be used for debugging purposes.
// Say you have a chain of operators and want to see the observable values before and after a certain operator is applied.
// The tap operator will allow you to log the values: 
from(beers)
  .pipe(
    tap(beer => console.log(`Before: ${beer}`)),
    map(beer => `${beer.name}, ${beer.country}`),
    tap(beer => console.log(`After: ${beer}`))
  )
  .subscribe(
    // beer => console.log(beer)
  );