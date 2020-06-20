import { of } from 'rxjs';

// leave the wonderful world of observables and go back to a more primitive state like 

let promise = of(1,2,3,4,5).toPromise();

promise.then(data => console.log('Promise', data));