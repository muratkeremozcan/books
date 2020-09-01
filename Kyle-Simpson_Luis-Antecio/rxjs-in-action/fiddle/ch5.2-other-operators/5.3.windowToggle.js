// windowToggle(): collect and emit observable of values from source between opening and closing emission
// windowToggle(openings: Observable, closingSelector: function(value): Observable): Observable


// RxJS v6+
import { timer, interval } from 'rxjs';
import { tap, windowToggle, mergeAll } from 'rxjs/operators';

//emit immediately then every 1s
const source = timer(0, 1000);
//toggle window on every 5
const toggle = interval(5000);
const example = source.pipe(
  //turn window on every 5s
  windowToggle(toggle, val => interval(val * 1000)),
  tap(_ => console.log('NEW WINDOW!'))
);

const subscribeTwo = example
  .pipe(
    //window emits nested observable
    mergeAll()
    /*
            output:
            "NEW WINDOW!"
            5
            "NEW WINDOW!"
            10
            11
            "NEW WINDOW!"
            15
            16
            "NEW WINDOW!"
            20
            21
            22
          */
  )
  .subscribe(val => console.log(val));