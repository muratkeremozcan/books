import Rx from 'rxjs/Rx';

// Subject is just an Observable with the ability to call next() on itself, and is multicast / hot by default
// It's a practical event emitter


const subject = new Rx.Subject();

const subA = subject.subscribe(val => console.log(`subA : ${val}`));
const subB = subject.subscribe(val => console.log(`subB : ${val}`));

// KEY: can emit on demand
subject.next('subject can emit on demand');

// KEY: can emit later, without having to specify up front in a callback function
subject.next('any time it wants');

// can create more subscription on the fly
const subC = subject.subscribe(val => console.log(`subC: new subscribers will only get subsequent values & ${val}`));

subject.next('subsequent values are shared with all');

/* the following operations exist on subject :

next([value])
error([error message])
complete()
subscribe()
unsubscribe()

*/