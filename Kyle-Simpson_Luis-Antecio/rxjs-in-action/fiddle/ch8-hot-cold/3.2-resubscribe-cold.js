import Rx from 'rxjs/Rx';
import moment from 'moment';

// although cold observables are usually ok, resubscribe with a cold observable can be problem if there are side effects

// resubscribe demo: 2 observers subscribe at different times
// create() operator creates a cold observable by default

const interval$ = Rx.Observable.create(observer => {
  let i = 0;
  observer.next('Starting interval...');

  let intervalId = setInterval(() => {
    let isAfter5am = moment().hour() >= 5;
    if (isAfter5am) {
      clearInterval(intervalId); // stops emitting events after 5am
      // observer.next('observer complete');
      observer.complete('observer complete');
    } 
    observer.next(`Next ${i++}`)
  }, 1000)
})

const subA = interval$.subscribe((val => console.log(`SubA ${val}`)));
// assume we subscribe again later in the day with Sub B (toggle line 13 to simulate)
// Sub A next, next next is still going on, but SubB ends immediately

// So the fact that the observable begins emitting events when subscribed to indicates that it’s a cold observable. 
// But because you have a side effect in your code, preventing it from replaying the pipeline sequence, 
// the results that subscribers see might be significantly different



