import * as Rx from 'rxjs/Rx';

// contrast to simple subject: an initial value can be sent, no calling next() necessary with it
// also, new subscribers will get the most recent value right before their subscription

const behaviorSubject = new Rx.BehaviorSubject('contrast: initial value can be logged with behaviorSubject');

const subA = behaviorSubject.subscribe(val => console.log(`subA : ${val}`));
const subB = behaviorSubject.subscribe(val => console.log(`subB : ${val}`));

behaviorSubject.next('can emit on demand');

// behaviorSubject.next('any time it wants');

// KEY: new subscribers will get the most recent value
const subC = behaviorSubject.subscribe(val => console.log(`subC: constrast: new subscribers will get the most recent value & ${val}`));

behaviorSubject.next('subsequent values are shared with all');

/* compare to simple subject output

subA : subject can emit on demand 
 
subB : subject can emit on demand 
 
subA : any time it wants 
 
subB : any time it wants 
 
subA : subsequent values are shared with all 
 
subB : subsequent values are shared with all 
 
subC: new subscribers will only get subsequent values & subsequent values are shared with all 

*/