// Turn an array, promise, or iterable into an observable.
// 💡 For arrays and iterables, all contained values will be emitted as a sequence!
// 💡 This operator can be used to emit a string as a sequence of characters!
// 💡 This operator can also be used to convert a promise to an observable!

// from(ish: ObservableInput, mapFn: function, thisArg: any, scheduler: Scheduler): Observable

import { from, of } from 'rxjs';

// array example
// if you want to emit a full array as is [1,2,3,4,5], use of
// if you want to emit each item in an array, use from()
const arraySource$ = of([1, 2, 3, 4, 5]);
arraySource$.subscribe(console.log)


// iterable example
const map = new Map();
map.set(1, 'Hi');
map.set(2, 'Bye');

const mapSource$ = from(map);
mapSource$.subscribe(console.log)


// string example (strings are arrays too!)
// of() would put out 'Hello String' 
// from() puts out each item in the array: 'H','e','l','l','o'....
const stringSource$ = from('Hello String');
stringSource$.subscribe(console.log);

// promise example
const promise = new Promise(resolve => resolve('Hello Promise'));

const promiseSource$ = from(promise);
promiseSource$.subscribe(console.log); 


