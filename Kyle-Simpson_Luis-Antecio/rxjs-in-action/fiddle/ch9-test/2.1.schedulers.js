import * as Rx from 'rxjs/Rx';

// in unit tests, we need to trick time so that they do not take long.
// we can use a virtual timer / scheduler
// most operators have a parameter for scheduler.

// Rx.Scheduler.queue	Schedules on a queue in the current event frame (trampoline scheduler). Use this for iteration operations.
// Rx.Scheduler.asap	Schedules on the micro task queue, like tick(). Use this for asynchronous conversions.
// Rx.Scheduler.async	Schedules work with setInterval. Use this for time-based operations.

// Scheduler lets you define in what execution context will an Observable deliver notifications to its Observer.

/*
interface Scheduler {
  now(): number;
  schedule(work, delay?, state?): Subscription; // schedules work, optional delay, optional state for state management
  flush(): void; // executes all actions and clears the queue
  active: boolean; // indicates if the queue is currently executing
  scheduleId: number; // queue of actions to schedule
}
*/

// example:range operator is synchronous. You can change the emission of the data to the observer, to async
// Rx.Observable.range(1, 5, Rx.Scheduler.async)
//    .subscribe(console.log)
// take a look at 9.8 for mocha example


// more about schedulers http://reactivex.io/rxjs/manual/overview.html

var observable = Rx.Observable.create(function (observer) {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();
})
.observeOn(Rx.Scheduler.async); // use the observeOn() instance operator to transform the emission of events midstream:
// here since we make it async, the console.logs will show first. Toggle it to see them come out in synchrounous order instead.

console.log('just before subscribe');

observable.subscribe({
  next: x => console.log('got value ' + x),
  error: err => console.error('something wrong occurred: ' + err),
  complete: () => console.log('done'),
});

console.log('just after subscribe');
