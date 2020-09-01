import { throwError, of, interval, iif, timer, Observable } from 'rxjs';
import { catchError, mergeMap, retry, retryWhen, delayWhen, tap, finalize } from 'rxjs/operators';

// catchError(): Gracefully handle errors in an observable sequence
// signature: catchError(project : function): Observable

// retry(): retry an observable sequence a specific number of times should an error occur.
// signature: retry(number: number): Observable
// 💡 Useful for retrying HTTP requests!
// 💡 If you only want to retry in certain cases, check out retryWhen()
// 💡 For non error cases check out repeat!

// retryWhen(): retry an observable sequence on error based on custom criteria
// signature: retryWhen(receives: (errors: Observable) => Observable, the: scheduler): Observable


const timer$ = interval(100);


const sourceError$ = timer$.pipe(
  mergeMap(val => iif(
    () => val > 5,
    throwError('error!'),
    of(val)
  )),
  // retry(2), // simple retry
  retryWhen(errors => errors.pipe(
    tap(val => console.log(`Value ${val} was too high!`)), // log error message,
    delayWhen(val => timer(val * 1000)) // wait 6 seconds and repeat
  ))
)

const source$ = sourceError$.pipe(
  catchError(err => of(`I caught: ${err}`))
)

source$.subscribe({
  next: val => console.log(val),
  error: val => console.log(`${val}: retried 2 times then quit!`)
})



// check out this for a sweet custom retry strategy
// https://www.learnrxjs.io/learn-rxjs/operators/error_handling/retrywhen