import { range, of } from 'rxjs'
import { endWith, finalize, concat, merge } from 'rxjs/operators';

// if you want to start with a value instead, use out startWith()
// if you want to perform an action on completion, but do not want to emit a value, use finalize()
// finalize is the same as finally, but the latter can only be used in Rx.Observable object form


const stream1 = range(5, 5).pipe(
  merge(of(20)),
  concat(of(33)),
  endWith(42), // put it at the end
);

stream1.subscribe(
  x => console.log(x),
  null,
  () => console.log('first stream complete')
);



const source$ = of('Hello', 'Friend');

const stream2 = source$
  // emit on completion
  .pipe(
    endWith('Goodbye', 'Friend'),
    finalize(() => console.log('finalize called'))
  )

// // emit on completion
// source$.pipe(
//     endWith('Goodbye', 'Friend')
//     // this function is invoked when unsubscribe methods are called
//     // 
//   );
// // .finally(() => console.log('done done'))


// // 'Hello', 'Friend', 'Goodbye', 'Friend'

stream2.subscribe(
  x => console.log(x),
  null,
  () => console.log('second stream complete')
);
// // 'Finally'