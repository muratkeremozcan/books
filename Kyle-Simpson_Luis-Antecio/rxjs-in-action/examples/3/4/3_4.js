/**
 *  RxJS in Action
 *  Listing 3.4
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
const isNumericalKeyCode = code => code >= 48 && code <= 57; // ascii key code for 0-9
const input = document.querySelector('#input'); // select id="input"
Rx.Observable.fromEvent(input, 'keyup') // fromEvent is used to lift DOM events to the stream
  .pluck('keyCode') // pluck is used to extract the value at property/key
  .filter(isNumericalKeyCode) // filter/select for conditional logic (if numeric, output it)
  .subscribe(code => console.log(`User typed: ${String.fromCharCode(code)}`)); // fromCharCode returns a string based on the character code: String.fromCharCode(65, 66, 67);  // returns "ABC"
