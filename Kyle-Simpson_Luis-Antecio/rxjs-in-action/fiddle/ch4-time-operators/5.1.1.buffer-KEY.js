import * as Rx from 'rxjs/Rx';

// buffer:  sourceObservable.buffer(notifierObservable)
// buffers source Observable values until notifier Observable emits a value 
// (preferred with multi time things, I think, while bufferWhen is preferred with one time)


Rx.Observable.timer(0, 1000) // timer starts at 0 sec, emits every 1 sec
  // think of the notifierObservable here as scissorObservable; cuts up the source Observable into 5 second buffer-chunks
  .buffer(Rx.Observable.interval(5000))
  .subscribe(
    function (val) {
      console.log(`buffer releasing: ${val}`);
    }
  );
