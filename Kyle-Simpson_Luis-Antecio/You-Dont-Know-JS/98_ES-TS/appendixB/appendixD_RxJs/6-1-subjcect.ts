import { Subject } from "rxjs";
// an RxJs Subject is an object that contains an observable and the observer(s)
// This means you can push the data to its observer(s) using next(), as well as subscribe to it. 
// A Subject can have multiple observers, which makes it useful when you need to implement for multicasting —emitting a value to multiple subscribers,

// TIP There’s a naming convention to end the names of variables of type Observable or Subject with a dollar sign.
const mySubject$ = new Subject();

// until now:
// observable.subscribe(observer); // observer subscribes to Observable
// observer.next(data); // data gets pushed to the observer
// with Subject:
// subject.subscribe(observer); // observer subscribes to Subject, which acts like the Observable
// subject.next(data); // data gets pushed to the subject, which acts like the Observer

// creates the subscribers
const subscriber1 = mySubject$.subscribe( x => console.log(`Subscriber 1 got ${x}`) );
const subscriber2 = mySubject$.subscribe( x => console.log(`Subscriber 2 got ${x}`) );

// pushes data
mySubject$.next(123);
// pushes data
mySubject$.next(456);

// unsubscribes one subscriber
subscriber2.unsubscribe();

mySubject$.next(789);
// data goes to 1 subject only
