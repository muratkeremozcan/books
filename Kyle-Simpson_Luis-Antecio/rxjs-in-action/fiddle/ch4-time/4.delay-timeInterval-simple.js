import Rx from 'rxjs/Rx';

Rx.Observable.interval(1000)
   .delay(2000) // Delays the entire sequence by a two-second offset
   .timeInterval() // Computes the time elapsed using the interval value from timeInterval()
   .map(int => Math.floor(int.interval / 1000))
   .subscribe(seconds => console.log(`${seconds} seconds`));
   


   
