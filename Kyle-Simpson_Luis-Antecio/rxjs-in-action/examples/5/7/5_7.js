/**
 *  RxJS in Action
 *  Listing 5.7
 *  Note: make sure you have turned on CORS sharing in you browser so that you can make
 *  cross-site requests
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
// drag and drop example drag & drop

const panel = document.querySelector('#dragTarget');
// mousedown events on the target
const mouseDown$ = Rx.Observable.fromEvent(panel, 'mousedown');
// mouse move and up events on the entire page
const mouseMove$ = Rx.Observable.fromEvent(document, 'mousemove');
const mouseUp$ = Rx.Observable.fromEvent(document, 'mouseup');

//  Listing 5.8
const drag$ = mouseDown$
  .concatMap(() => mouseMove$.takeUntil(mouseUp$));

/* concatMap is the same as map + concatAll
  const drag$ = mouseDown$
    .map(() => mouseMove$.takeUntil(mouseUp$))
    .concatAll()
*/


drag$.forEach(event => {
  panel.style.left = event.clientX + 'px';
  panel.style.top = event.clientY + 'px';
});
