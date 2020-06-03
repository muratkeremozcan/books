import Rx from 'rxjs/Rx';
import R from 'ramda';

// a cold observable is one that doesn’t begin emitting all of its values until an observer subscribes to it
// They are passive; analogy: Netflix. Starts emittiing when someone is observing, every observer gets identical data
// Typically they are used to wrap bounded data types such as numbers, ranges of numbers, strings, arrays, and HTTP requests
// ex: of(), from(), timer(), interval()

// the key: each observer gets its own identical data (everyone watches the same show)

const interval$ = Rx.Observable.interval(5000)

const isEven = x => x % 2 === 0;

interval$
  .filter(isEven)
  .take(5) 
  .subscribe(x => {
    console.log(`even number found ${x}`)
  });

interval$
  .filter(R.compose(R.not, isEven))
  .take(5)
  .subscribe(x => {
    console.log(`odd number found ${x}`)
  });

  
// Hot observables are those that produce events regardless of the presence of subscribers
// They are active; analogy: TV station. Emits whether someone is observing or not
// typically mouse clicks, mouse movement, touch, any events exposed via event emitters

// unlike the cold counterpart where each subscription triggers a new stream, 
// subscribers to hot observables tend to receive only the events that are emitted after the subscription is created,
// if no one is observing, the events are just ignored. If someone is observing the stream flows down the pipeline

// unlike cold counterpart where each observer getse its own identical data
// a hot observable shares the same stream of events to all observers that listen to it
// each subscriber will start receiving events currently flowing through the stream after subscription

