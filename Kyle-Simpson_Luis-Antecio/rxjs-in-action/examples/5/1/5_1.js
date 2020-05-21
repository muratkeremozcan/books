/**
 *  RxJS in Action
 *  Listing 5.1
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

const mouseUp$ = Rx.Observable.fromEvent(document, 'mouseup');
const touchEnd$ = Rx.Observable.fromEvent(document, 'touchend');

Rx.Observable.merge(mouseUp$, touchEnd$)
    .do(event => console.log(event.type))
    .map(event => {
        switch (event.type) { 
            // Detects the type of the event, builds a compatible type, and constructs the object accordingly
            // not ideal; check out 5.2
            case 'touchend':
                return {
                    left: event.changedTouches[0].clientX,
                    top: event.changedTouches[0].clientY
                };
            case 'mouseup':
                return {
                    left: event.clientX,
                    top: event.clientY
                };
        }
    })
    .subscribe(obj =>
        console.log(`Left: ${obj.left}, Top: ${obj.top}`));
        
