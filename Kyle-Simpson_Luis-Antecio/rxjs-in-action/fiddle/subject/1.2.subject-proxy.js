import * as Rx from 'rxjs/Rx';

// A Subject can act as a proxy, i.e receive values from another stream and add its own values on top

const source$ = Rx.Observable.interval(500)
  .take(3)

const proxySubject = new Rx.Subject();

// remember: subject can also act as an observer
// const subA = source$.subscribe(proxySubject);

// // side note: any next() that happens before a subscription is created is lost. behaviorSubject and replaySubject can cater to this.


// const subB = proxySubject.subscribe(val => console.log(`subB : ${val}`));

// // KEY: proxySubject listens to source$, but can also add its own contribution
// subB.next('0, 1, 2 come from the other stream, new value from here');

