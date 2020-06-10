import { Observable } from 'rxjs'

const source$ = Observable.create(observer => {
  observer.next(1);
  // observer.error('error message'); // toggle to simulate error
  observer.complete();
});

/* again, subscribe has the signature:

stream.subscribe(
  fnValue, 
  fnError?,
  fnComplete?
)

*/

source$.subscribe(
  val => console.log(val),
  err => console.log('Error: ', err),
  () => console.log('complete')
);

