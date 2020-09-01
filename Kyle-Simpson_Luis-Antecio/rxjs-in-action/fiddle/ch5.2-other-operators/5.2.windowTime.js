// windowTime(): observable of values collected from source for each provided time span.
// windowTime(windowTimeSpan: number, windowCreationInterval: number, scheduler: Scheduler): Observable

// RxJS v6+
import { timer } from 'rxjs';
import { windowTime, tap, mergeAll } from 'rxjs/operators';

//emit immediately then every 1s
const source = timer(0, 1000);
const example = source.pipe(
  //start new window every 3s
  windowTime(3000),
  tap(_ => console.log('NEW WINDOW!'))
);

const subscribeTwo = example
  .pipe(
    //window emits nested observable
    mergeAll()
    /*
            output:
            "NEW WINDOW!"
            0
            1
            2
            "NEW WINDOW!"
            3
            4
            5
          */
  )
  .subscribe(val => console.log(val));