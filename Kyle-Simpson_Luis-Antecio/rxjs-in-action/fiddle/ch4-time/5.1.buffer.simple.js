import Rx from 'rxjs/Rx';

// buffer:  sourceObservable.buffer(notifierObservable)
// buffers source Observable values until notifier Observable emits a value

Rx.Observable.timer(1000, 1000) // timer starts at 1 sec, emits every 1 sec
  .buffer(Rx.Observable.timer(10000)) // buffers until 10 seconds, which means we should see 9 items
  .subscribe(
    function (val) {
      console.log(`buffer releasing: ${val}`);
    }
  );
