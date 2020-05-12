const Rx = require('rxjs/Rx');

// producer / Observable: any data, mouse clicks, keyboard inputs, HTTP requests
// stream / pipeline: a stream of data, the business logic
// consumer / Observer: subscribes to the stream / pipeline

// producer / Observable is lifted into the stream context with Rx.Observable.of(..)
// Observable.of(Observable) -> stream / pipeline -> .subscribe(consumerFunc/Observer)

Rx.Observable.of(42).subscribe( // Observable.of(Observable) <arbitrary pipeline>
  val => { // consumer function / Observer
    console.log(val);
  }
);

Rx.Observable.of(1, 2, 3, 4, 5).subscribe( // Observable.of(Observable) <arbitrary pipeline>
  val => { // consumer function / Observer
    console.log(val);
  }
);

Rx.Observable.of(1, 2, 3, 4, 5) // Observable.of(Observable)
  .filter(num => (num % 2) === 0)  // stream / pipeline                
  .map(num => num * num)
  .subscribe(
    val => { // consumer function / Observer
      console.log(val);
    }
  );

// Rx.Observable.range(1, 3).subscribe(
//   x => console.log(`Next: ${x}`),
//   err => console.log(`Error: ${err}`),
//   () => console.log('Completed')
// )

// KEY: RxJs can treat any data just like static data in these examples, as if time didn't exist

// Date.now(); //?

// function countUpFromTime() {
//   // countFrom = new Date(countFrom).getTime();

//   countUpFromTime.interval = setTimeout(function(){ countUpFromTime(countFrom, id); }, 1000);
// }

setTimeout(function() {
  // Date.now();
  console.log('time up');
}, 5000); //?