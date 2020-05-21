import Rx from 'rxjs/Rx';


// bufferWhen: sourceObservable.bufferWhen(() => Observable)
// used for caching events until another observable emits a value.

Rx.Observable.timer(0, 1000)
  .bufferWhen(() => Rx.Observable.timer(4000)) // will release at 3 secs, and keep releasing
  .subscribe(
    function (val) {
      console.log(`bufferWhen releasing: ${val}`);
    }
  );
  
// check out 14.4 gulp for a complex example 