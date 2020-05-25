import Rx from 'rxjs/Rx';

// merge: merges observable streams into 1, useful for interleaving

const source1$ = Rx.Observable.interval(1000)
  .map(x => `Source1: ${x}`)
  .take(3);

const source2$ = Rx.Observable.interval(1750)
  .map(y => `Source2: ${y}`)
  .take(3);

const source3$ = Rx.Observable.interval(2500)
  .map(y => `Source3: ${y}`)
  .take(3);

// static form: creating a stream from the combination
Rx.Observable.merge(source1$, source2$, source3$) 
  .subscribe(console.log)

// instance form: observable being mapped to the source observable (same result)
// source1$.merge(source2$).merge(source3$) 
//   .subscribe(console.log)

// check out 5.1, 5.2 gulp for how mouseup and touchend events can get merged
// in case of different types in observables
// instead of forcing observers to use conditional logic to discern between different types of events (5.1)
// you should make the stream data conformant before the merge (5.2)


// in this case, the data is synchronously available; first come, first served
const nums$ = Rx.Observable.of(1,2,3);
const letters$ = Rx.Observable.of('a', 'b', 'c');

Rx.Observable.merge(nums$, letters$)
  .subscribe(console.log)