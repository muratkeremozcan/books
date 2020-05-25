import Rx from 'rxjs/Rx';

// time from scratch
const simpleTimer$ = Rx.Observable.create(observer => {
  const timeoutId = setTimeout(() => {
    observer.next('hello again');
    observer.complete(); // we are not going to unsubscribe, so we have to call .complete()
  }, 10000);
  // the function at the end is needed to unsubscribe or call .complete()
  return () => clearTimeout(timeoutId);
})

simpleTimer$.subscribe(console.log);


// built-in timer
Rx.Observable.timer(5000)
  .subscribe(console.log('hello'));
