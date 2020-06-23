import * as Rx from 'rxjs/Rx';

// delay() shifts the pipeline by delay amount
Rx.Observable.timer(1000)
   .delay(2000) // Delays / shifts the entire sequence by a two-second offset
   .timeInterval() 
   .map(int => Math.floor(int.interval / 1000)) // Computes the time elapsed using the interval value from timeInterval()
   .subscribe(seconds => console.log(`${seconds} seconds`));
   


// we get 1,2, 2 secs , 3,4, 2 secs, 5,6, 2 secs. Output happens after 6 secs total.
Rx.Observable.from([1, 2])
   .delay(2000) // 2 seconds
   .concat(Rx.Observable.from([3,4])) // concat will come up later, it merges Observables and sequences them
   .delay(2000) // 4 seconds
   .concat(Rx.Observable.from([5,6]))
   .delay(2000) // 6 seconds
   .subscribe(console.log)


// debounceTime
/* it is like delay, but passes only the most recent value from each burst of emissions

Rx.Observable.fromEvent(document, 'click')
  .Tue