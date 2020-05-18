import Rx from 'rxjs/Rx';

const simpleInterval$ = Rx.Observable.create(observer => {
  let num = 0;
  const intervalId = setInterval(() => {
    observer.next(`Next ${num++}`);
  }, 500);
  // not calling complete() because this goes on until unsub
  // we still need the return function for the unsub
  return () => clearInterval(intervalId);
});

// // subscribe takes as arguments the consumer function, and the optional error and complete functions
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
  .take(10) // this will go on forever, so just take the first 10 items
  .subscribe(
    console.log,
    error => console.error(error.message),
    () => console.log('Done')
  )