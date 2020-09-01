import * as Rx from 'rxjs/Rx';

// Publish creates a hot observable whereby all subscribers begin receiving the events as soon as the call to connect is made. 
// Otherwise, the source stream behaves like a cold observable, sitting idle until connect() is called.
// The share() operator would yield the same results except that the call to connect() would be done internally by the library.


const source$ = Rx.Observable.interval(1000)
  .take(10)
  .do(num => {
    console.log(`running some code with ${num}`);
  });

// share automatically managed the sub and unsub, with publish(), there is more control and less hand holding
const published$ = source$.publish();

// with publish(), you have to call connect() to start the stream - can call it anywhere in the code
// publish can be called a warm observable; starts codl, becomes hot on connect()

published$.subscribe(createObserver('SubA'));

// KEY: we control when we conect the 2nd observable
published$.connect();
published$.subscribe(createObserver('SubB'));
// you have to be careful to unsubscribe from a publish()


/** Helper method to create a simple observer for standard out */
function createObserver(tag) {
  return {
    next: x => {
      console.log(`Next: ${tag} ${x}`);
    },
    error: err => {
      console.log(`Error: ${err}`);
    },
    complete: () => {
      console.log('completed');
    }
  };
}