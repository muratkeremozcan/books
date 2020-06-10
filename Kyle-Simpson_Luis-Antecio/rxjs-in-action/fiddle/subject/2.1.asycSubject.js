import * as Rx from 'rxjs/Rx';

// with AsyncSubject we can keep calling next; only the latest value received upon complete()

const subjectAsync = new Rx.AsyncSubject();

const subA = subjectAsync.subscribe(console.log);

subjectAsync.next('initial values are not logged with AsyncSubject'); 


const subB = subjectAsync.subscribe(console.log)

subjectAsync.next('only the most recent next() is logged upon complete()');


subjectAsync.complete();