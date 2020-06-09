import Rx from 'rxjs/Rx';

const subjectAsync = new Rx.AsyncSubject();

const subA = subjectAsync.subscribe(
  value => console.log('async subject:', value),
  error => console.error('async error:', error),
  () => console.log('async completed')
);

subjectAsync.next('initial values are not emitted.');
subjectAsync.next('initial values are not emitted.');
subjectAsync.next('only the most recent value is emitted.');

// remember: subject has access to next(), error(), complete(), subscribe() and unsubscribe() 
// if this is the most recent, it will get logged. Toggle to see.
// subjectAsync.error('error happened');
subjectAsync.complete();