import Rx from 'rxjs/Rx';

// Working with nested observables is analogous to inserting an array into another array 
// and expecting map() and filter() to work with just the data inside them.
// instead of dealing with nested structures, you can let ooperators handle it

// note: native flatten: JS does not have an array.flatten() , but you can implement it this way (or use lodash)
[[0, 1], [2, 3], [4, 5]].reduce((a, b) => a.concat(b), []); //?

// mapping and flattening difference
const source = [1, 2, 3]
// mapping a function that returns an array onto an array, results in a multi-dimensional array
/** creates an array of x size and fills it with x(s) */
source.map(value => Array(value).fill(value)); //?
// after a call to flatten, the resulting array is single dimensional
source.map(value => Array(value).fill(value))
  .reduce((a, b) => a.concat(b), []);   //?   


// distinctUntilChanged
// skips the back to back duplicates
Rx.Observable.of('a', 'b', 'c', 'c', 'c', 'c', 'b', 'b', 'a', 'a')
  .distinctUntilChanged() 
  .subscribe(console.log)


// takeUntil 
// allows the source observable to emit values until the provided notifier observable emits a value
// sourceObservable$.takeUntil(notifierObservable$)

const sourceObservable$ = Rx.Observable.interval(1000); // this can keep going forever
const notifierObservable$ = Rx.Observable.timer(5000); // bu we stop it with this

sourceObservable$.takeUntil(notifierObservable$)
  .subscribe(
    x => console.log(`tick ${x}`),
    err => console.log(`error: ${err}`),
    () => console.log('boom!')
  );




/* mergeMap: like merge (merges & interleaves streams), but has additional logic to flatten the nested observable so that the observer only deals with a flat array
 observable1$
    .mergeMap(() => observable2$)

const search$ = Rx.Observable.fromEvent(inputText, 'keyup')
  // maps/transforms an observable-returning function, flattens and merges it into the source observable
  // subsribers of this stream will only deal with an Observable<Array>
  .mergeMap(query => Rx.Observable.from(queryResults(query)));

check out 5.3,4,6 gulp examples


concatMap: like concat (merges & sequentializes the streams), but has additional logic to flatten the nested observable so that the observer only deals with a flat array 
each observable waits for the previous one to complete.
a good example is drag & drop: mouse down, mouse move, mouse up
observable1$
    .concatMap(() => observable2$)
*/

// check out 5.7 example