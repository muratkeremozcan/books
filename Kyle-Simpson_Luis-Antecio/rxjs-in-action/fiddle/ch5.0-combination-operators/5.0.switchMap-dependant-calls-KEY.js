import { of, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

/* switchMap() is useful dependant calls that have to happen in order
// remember: switch() cancels the first sequence when a new one starts emitting
// thise one does the flattening also.
// it works like mergeMap()
// observable1$
//  .switchMap(() => observable2$)


Call 2 must happen after Call 1 has returned. 
It might even be possible that Call2 needs be specified using data from Call 1.

Imagine you have the following scenario:
- A user needs to login first
- Then we can fetch their user details
- Then we can fetch their orders

promise approach would be:
login()
  .then(getUserDetails)
  .then(getOrdersByUser)
*/

// simplified example below uses of() and from() instead of ajax()


let stream$ = of({ message: 'Logged in' })
  .pipe(
    switchMap((result) => { // get user details
      return of({ id: 1, name: 'user' })
    }),
    switchMap((user) => { // get the user's orders
      return from(
        [{ id: 114, userId: 1 },
        { id: 117, userId: 1 }])
    })
  );

stream$.subscribe((orders) => {
  console.log('Orders', orders);
})

// Array of orders