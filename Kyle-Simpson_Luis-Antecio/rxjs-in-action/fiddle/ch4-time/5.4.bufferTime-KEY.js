import Rx from 'rxjs/Rx';


// bufferTime: sourceObservable.bufferTime(timeInMs)
// buffers source Observable values until a set time, then keeps releasing

Rx.Observable.timer(0, 1000)
  .bufferTime(5000) // will release at 3 secs, and keep releasing
  .subscribe(
    function (val) {
      console.log(`bufferTime releasing: ${val}`);
    }
  );

// check out 14.5 gulp for a complex example 