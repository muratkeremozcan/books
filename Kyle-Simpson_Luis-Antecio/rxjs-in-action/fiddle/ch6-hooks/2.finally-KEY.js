import Rx from 'rxjs/Rx';

// You can find out if an observable is complete by calling finally(() => ...)

Rx.Observable.timer(2000)
  .finally(() => console.log('timer stream done')) // finally indicates the completion of a stream
  .subscribe(
    x => console.log(x),
    err => console.log('Error: ' + err),
    x => console.log('timer subscription done') // recall how we indicate the completion of a subscription
  );


// note: some observables keep on going forever, they need to be unsubscribed

const interval$ = Rx.Observable.timer(2000, 1000) // could use .interval() also, but it would not have a start value
  .finally(() => console.log('interval stream done'))
  .subscribe(
    x => console.log(x),
    err => console.log('Error: ' + err),
    x => console.log('interval subscription done') // never gets called!
  )

setTimeout(() => {
  interval$.unsubscribe();
}, 6000);