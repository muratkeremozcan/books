/**
 *  RxJS in Action
 *  Listing 5.2
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

const mouseUp$ = Rx.Observable.fromEvent(document, 'mouseup');
const touchEnd$ = Rx.Observable.fromEvent(document, 'touchend');

// Instead of forcing observers to use conditional logic to discern between different types of events
// you should make the stream data conformant before the merge

const conformantMouseUp$ = mouseUp$.map(event => ({
  left: event.clientX,
  top: event.clientY
}));

const conformantTouchEnd$ = touchEnd$.map(event => ({
  left: event.changedTouches[0].clientX,
  top: event.changedTouches[0].clientY,
}));

Rx.Observable.merge(conformantMouseUp$, conformantTouchEnd$)
   .subscribe(obj =>
      console.log(`Left: ${obj.left}, Top: ${obj.top}`));
