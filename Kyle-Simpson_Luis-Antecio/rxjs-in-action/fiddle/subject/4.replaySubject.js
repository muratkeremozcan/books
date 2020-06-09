import Rx from 'rxjs/Rx';

// contrast with BehaviorSubject: instead of just the most recent value, new subscribers will get all the past values or an optional number of them
// there is no initial value like behaviorSubject

const replaySubject = new Rx.ReplaySubject(2);
// const replaySubject = new Rx.ReplaySubject(); // if no number specified, all values will show. Toggle to test

const subA = replaySubject.subscribe(val => console.log(`subA : ${val}`));
const subB = replaySubject.subscribe(val => console.log(`subB : ${val}`));

replaySubject.next('this will show for initial subscriptions for sure; but if OPTINAL replays are specified it may not show for latter subscriptions');

replaySubject.next('can emit on demand');

replaySubject.next('any time it wants');

// KEY: new subscribers will get all the past values, or an optional number of them
const subC = replaySubject.subscribe(val => console.log(`subC: constrast: new subscribers will get all the past values & ${val}`));

replaySubject.next('subsequent values are shared with all');


/* contrast with BehaviorSubject
subA : contrast: initial value can be logged with behaviorSubject 
 
subB : contrast: initial value can be logged with behaviorSubject 
 
subA : can emit on demand 
 
subB : can emit on demand 
 
subA : any time it wants 
 
subB : any time it wants 
 
subC: constrast: new subscribers will get the most recent value & any time it wants 
 
subA : subsequent values are shared with all 
 
subB : subsequent values are shared with all 
 
subC: constrast: new subscribers will get the most recent value & subsequent values are shared with all 

*/

