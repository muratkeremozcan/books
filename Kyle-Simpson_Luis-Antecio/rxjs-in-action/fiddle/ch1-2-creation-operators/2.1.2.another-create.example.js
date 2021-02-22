import { Observable } from 'rxjs'

// Create an observable with given subscription function
// KEY: we are creating a custom Observable; we have to specify how it would be used / subscribed to

// signature: create(subscribe: function)

/* subscription signature:
stream.subscribe(
  fnValue, 
  fnError?,
  fnComplete?
)
*/

const source$ = new Observable(observer => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  // observer.error('error message'); // toggle to simulate error
  observer.complete();
});



source$.subscribe(
  val => console.log(val),
  err => console.log('Error: ', err),
  () => console.log('complete')
);



//  Observable that emits even numbers on timer

const evenNumbers$ = new Observable(function(observer) {
  let value = 0;
  const interval = setInterval(() => {
    if (value % 2 === 0) {
      observer.next(value);
    }
    value++;
  }, 1000);

  return () => clearInterval(interval);
});

const subscription = evenNumbers$.subscribe(val => console.log(val));

//unsubscribe after 10 seconds
setTimeout(() => {
  subscription.unsubscribe();
}, 10000);


//////

const basic = Observable.create(observer => {
  observer.next('A');
  observer.next('B');
  observer.complete();
  observer.next('C'); // never gets called
});

basic.subscribe(console.log);