import { interval } from 'rxjs';
import { take, buffer } from 'rxjs/operators';

/*

buffer( whenToReleaseValuesStartObservable )

// or

buffer(
  whenToReleaseValuesStartObservable,
  whenToReleaseValuesEndObservable
)

*/

const scissor$ = interval(500);

const emitter$ = interval(100)
  .pipe(
    take(10),
    buffer(scissor$)
  )
  .subscribe(console.log)


const emitter2$ = interval(250)
    .pipe(
      buffer(scissor$)
    )
    .subscribe(console.log)


/*
import { fromEvent, interval } from 'rxjs';
import { buffer } from 'rxjs/operators';

let clicks$ = fromEvent(document.getElementById('btn'), 'click');
let scissor$ = interval(300);

clicks$.pipe(
  buffer(scissor$)
    //.filter( (clicks) => clicks.length >=2 )
    .subscribe((value) => {
      if (value.length === 1) {
        console.log('single click')
      } else if (value.length === 2) {
        console.log('double click')
      } else if (value.length === 3) {
        console.log('triple click')
      }
    })
);


the buffer stream clicks$ will emit its values every 300ms, 
300 ms is decided by scissor$ stream. 
So the scissor$ stream is the scissor, if you will, that cuts up our click stream 
and voila we have an elegant double click approach. 

As you can see the above code captures all types of clicks 
but by uncommenting the filter() operation we get only double clicks and triple clicks.
*/

