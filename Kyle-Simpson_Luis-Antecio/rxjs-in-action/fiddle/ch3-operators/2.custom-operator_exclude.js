import Rx from 'rxjs/Rx';

/** custom operator for logical inverse of filter; unselect/exclude */
function exclude(predicate) {
  return Rx.Observable.create(observer => { // create a new observable context, so it can be lifted to the stream
    let source = this; // because we are using => , 'this' is yielded to the outer scope
    return source.subscribe( // define the behavior of the Observer that would use this operator
      value => { // consumer function / Observer
        try {
          if (!predicate(value)) {
            observer.next(value); // pass the next value to the new operator in the chain
          }
        } catch (e) {
          observer.error(e);
        }
      },
      err => observer.error(err), // the optional arguments for subscribe (error & completion)
      () => observer.complete()
    );
  });
}

Rx.Observable.prototype.exclude = exclude; // add the custom operator by extending the Observable prototype


// usage

Rx.Observable.from([1, 2, 3, 4, 5])
  .exclude( x => x % 2 === 0)
  .subscribe(console.log)