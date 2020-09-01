// import 'rxjs/Rx'; 
// or with the alias Rx
// import * as Rx from 'rxjs/Rx';
// commonJS alternative
// const Rx = require('rxjs/Rx');

// These statements utilize the entire library. 
// It is great for testing out various features but once hitting production this is a bad idea as Rxjs is quite a heavy library. 
// In a more realistic scenario you would want to use the alternate approach below that only imports the operators that you actually use 

import { of, from, range, Observable } from 'rxjs';
import { map, filter, reduce } from "rxjs/operators";
// commonJs is the same thing:
// var { of } = require('rxjs');
// const { map } = require('rxjs/operators');

of(1,2,3).subscribe(console.log);
from(['a', 'b', 'c']).subscribe(console.log);



//// pipe


// to use map, we would have to chain from Observable.of and import the whole library
import 'rxjs/Rx'; // not enough to import just: import { Observable } from 'rxj', because of map chain

const source$ = Observable.of(1,2,3)
  .map(x => x * x);

// remember: subscribe takes as arguments the default consumer function, and the optional error and complete functions
source$.subscribe(
  val => console.log(val),
  err => console.log(err),
  () => console.log('Rx.Observable.of(...).map example complete')
);


// if you want to avoid importing the whole Rxjs library, and want to use map, you have to utilize pipe
// pipe is like the FP pipe; reverse of compose

const stream$ = of(1,2,3).pipe(
  map(x => x + '!!!')
)

stream$.subscribe(
  val => console.log(val),
  err => console.log(err),
  () => console.log('1st pipe example complete')
);


// another pipe example, from 1.1
// this is the alternative to using the Observable object inRx.Observable.range(1, 10) & dot-chaining
// also, it's more readable because it's the 'pipeline'

const isEven = x => x % 2 === 0
const square = x => x * x
const add = (a, b) => a + b;

const pipeExampleSource$ = range(1, 10).pipe(
  filter(isEven),
  map(square),
  reduce(add)
);

pipeExampleSource$.subscribe(console.log);