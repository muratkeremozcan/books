import * as Rx from 'rxjs/Rx';


// bufferWhen: sourceObservable.bufferWhen(() => Observable)
// used for caching events until another observable emits a value. 
// (preferred with one time things, I think - though I can't point to a diffence with buffer() )

Rx.Observable.timer(0, 1000)
  .bufferWhen(() => Rx.Observable.interval(5000)) // will release at 5 secs, and keep releasing every 5
  .subscribe(
    function (val) {
      console.log(`bufferWhen releasing: ${val}`);
    }
  );
  
// check out 14.4 gulp for a complex example 


// what is the difference between buffer and bufferWhen?
// https://stackoverflow.com/questions/61003061/whats-the-difference-between-the-rxjs-operators-buffer-and-bufferwhen
// I did not get this, but sounds like you want to use bufferWhen when it's a repeated thing  vs buffer being used for a 1 time thing