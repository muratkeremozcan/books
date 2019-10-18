// filter, map

import { from } from 'rxjs';
import 'rxjs/Rx';

const beers = [
  { name: "Stella", country: "Belgium", price: 9.50 },
  { name: "Sam Adams", country: "USA", price: 8.50 },
  { name: "Bud Light", country: "USA", price: 6.50 }
];

from(beers) // observable
  .filter(beer => beer.price < 8)
  .map(beer => `${beer.name}: $${beer.price}`)
  .subscribe(
    beer => console.log(beer), // observer
    err => console.error(err),
    () => console.log("Streaming is over")
  );

console.log("This is the last line of the script");