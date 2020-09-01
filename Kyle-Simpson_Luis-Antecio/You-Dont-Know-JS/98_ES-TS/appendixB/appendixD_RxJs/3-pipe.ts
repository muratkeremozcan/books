// filter, map, pipeable operators
// Starting with RxJS 6, the only way to chain operators is by using the pipe() method,
// passing to it comma-separated operators as arguments

import { from } from 'rxjs';
import { map, filter } from 'rxjs/operators';

const beers = [
  { name: "Stella", country: "Belgium", price: 9.50 },
  { name: "Sam Adams", country: "USA", price: 8.50 },
  { name: "Bud Light", country: "USA", price: 6.50 }
];

from(beers) // observable
  .pipe( // pipe is now the only way to chain rxjs operators
    filter(beer => beer.price < 8),
    map(beer => `${beer.name}: $${beer.price}`)
  ).subscribe(
    beer => console.log(beer),
    err => console.error(err),
    () => console.log('Streaming is over')
  );

console.log("This is the last line of the script");
