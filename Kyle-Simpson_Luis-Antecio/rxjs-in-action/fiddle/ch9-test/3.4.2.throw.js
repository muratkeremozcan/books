import { throwError } from 'rxjs';

// same as Rx.Observable.throw. When imported , have to use throwError

// emits an error on subscription
// signature: throw(error: any, scheduler: Scheduler): Observable

const source = throwError('This is an error!');

//output: 'Error: This is an error!'
const subscribe = source.subscribe({
  next: val => console.log(val),
  complete: () => console.log('Complete!'),
  error: val => console.log(`Error: ${val}`)
});