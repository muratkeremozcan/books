import * as Rx from 'rxjs/Rx';

// contrast to subject: we had to use Rx.Observable.create(observer => { ... }) , specify the callback function
// and configure the emission up front. There is no way to call next() and emit on demand later
// Also, we had to share it so that it is multi-cast / hot. Rx.Subject() does this by default

const constrast$ = Rx.Observable.create(observer => {
  setTimeout(() => {
    observer.next('Hello again');
    observer.next('World again');
    observer.complete();
  }, 2000)
}).share();

const subC = constrast$.subscribe(val => console.log(`subC : ${val}`));
const subD = constrast$.subscribe(val => console.log(`subD : ${val}`));