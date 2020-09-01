import * as Rx from 'rxjs/Rx';

// bufferCount: sourceObservable.bufferCount(numberOfEventsToBuffer)
// buffers source Observable values until a count of them is reached, then keeps releasing

Rx.Observable.timer(0, 1000) // timer starts at 0 sec, emits every 1 sec
  .bufferCount(5) // keeps buffering 5, and then releasing
  .subscribe(
    function (val) {
      console.log(`bufferCount releasing: ${val}`);
    }
  );
