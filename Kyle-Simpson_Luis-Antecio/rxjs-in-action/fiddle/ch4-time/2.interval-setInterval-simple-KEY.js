import * as Rx from 'rxjs/Rx';

const simpleInterval$ = Rx.Observable.create(observer => {
  let num = 0;
  const intervalId = setInterval(() => { // need to put it in a function so we can nicely clearInterval with that function
    observer.next(`Next ${num++}`);
  }, 500);
  // not calling complete() because this goes on until unsub
  // we still need the return function for the unsub
  return () => clearInterval(intervalId);
});

const sub = simpleInterval$.subscribe(
  val => console.log(val),
);

setTimeout(function () {  //#E
  sub.unsubscribe();
}, 2000);


/////////
// built-in interval() operator
// by default, interval() returns array indexes: 0, 1, 2...
Rx.Observable.interval(2000)
  .skip(1) // skips the first item emitted, which is 0
  .take(5) // this will go on forever, so just take the first 5items
  .subscribe(
    console.log,
    error => console.error(error.message),
    () => console.log('Done')
  )


// timer is better than interval; passing a second arg to timer, you can keep emitting.