// RxJS v6+
import { interval } from 'rxjs';
import { windowCount, mergeAll, tap } from 'rxjs/operators';

// windowCount(): obbservable of values from source, emitted each time provided count is fulfilled.
// windowCount(windowSize: number, startWindowEvery: number): Observable

//emit every 1s
const source = interval(1000);
const example = source.pipe(
  //start new window every 4 emitted values
  windowCount(4),
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
            3
            "NEW WINDOW!"
            4
            5
            6
            7
          */
  )
  .subscribe(val => console.log(val));