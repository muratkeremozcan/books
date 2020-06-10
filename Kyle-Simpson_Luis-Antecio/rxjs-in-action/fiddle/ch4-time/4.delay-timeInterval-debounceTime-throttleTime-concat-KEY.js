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
   .concat(Rx.Observable.from([3,4]))
   .delay(2000) // 4 seconds
   .concat(Rx.Observable.from([5,6]))
   .delay(2000) // 6 seconds
   .subscribe(console.log)


// debounceTime
/* it is like delay, but passes only the most recent value from each burst of emissions

Rx.Observable.fromEvent(document, 'click')
  .debounceTime(1000) // ignore the spam of clicks for the last 1 sec, get the last click
  subscribe(console.log)
*/
// note: check out 4.12 gulp example for a google address like search utilizing debounceTime


// throttle time
/* execute a function at most once every period, ignore the in-between values

Rx.Observable.fromEvent(document, 'mousemove')
  .throttleTime(1000) // while the mouse is moving, ignore the spam of in-between events, get values every 1 sec
  subscribe(console.log)
*/
// check out gulp example at 4.13