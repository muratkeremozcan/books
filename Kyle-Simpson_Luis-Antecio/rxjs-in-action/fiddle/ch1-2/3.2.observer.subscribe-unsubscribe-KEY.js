import Rx from 'rxjs/Rx';

const progressBar$ = Rx.Observable.create(observer => { // observable is created
  const DELAY = 3000;  // starts after 3 seconds
  const SPEED = 50; // emits a new progress value every 50 ms

  let val = 0;
  let timeoutId = 0; // we need this to be able to nicely user clearTimeout at the end.

  function progress() {
    if (++val <= 100) {
      observer.next(`${val} %`); // keep pushing the incremented value down the stream every recursion
      timeoutId = setTimeout(progress, SPEED); // call the progress function recursively
    }
    else {
      observer.complete(); // if an observable is finite, you can signal its completion with complete()
    }
  }

  // upon subscription, start the whole thing after 3 seconds
  // the progress function which we call in 3 secs has its own setTimeout which recursively calls itself, until value reaches 100
  timeoutId = setTimeout(progress, DELAY);

  // The function at the end of an observable is needed for the observer to be able to unsubscribe
  // It is analogous to finally in try catch.
  // It becomes the body of the unsubscribe() method and executes when the unsubscribe method is called. 
  return () => {
    clearTimeout(timeoutId);
  };

});

// this would will fill progress up to 100
// const subs = progressBar$.subscribe(console.log);

// instead we want to demo unsubscribe, which we use to unsub before the counter reaches 100

// subscribe takes 3 arguments: value, error, complete 
const subs = progressBar$.subscribe(
  console.log,
  null,
  () => console.log('Complete!')
);


// observer.unsubscribe Tears down the stream and frees up any allocated objects

// before completion, unsub after 6 seconds. This way the % bar only has 3 seconds to fill.
setTimeout(() => {
  subs.unsubscribe();
}, 6000); 