/**
 *  RxJS in Action
 *  Listing 4.15
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
const password = document.getElementById('password-field');
const submit = document.getElementById('submit');
const outputField = document.getElementById('output');

/** determines the numeric key that was pressed */
const password$ = Rx.Observable.fromEvent(password, 'keyup')
    .map(({keyCode}) => keyCode - 48);

const submit$ = Rx.Observable.fromEvent(submit, 'click');

/** combines the events emitted from both text field and submit button simultaneously */
Rx.Observable.combineLatest(
  password$.bufferTime(7000).filter(R.compose(R.not, R.isEmpty)), // buffers input for 7 seconds, and then flushes it
  submit$
)
  .take(10) // limits the retries
  .do(([maybePassword,]) => console.log('Password is: ' + maybePassword.join('-')))
  .subscribe(
    ([maybePassword,]) => { // ES6 destructuring to determine the password
      if (maybePassword.join('') === '1337') { //#C
        outputField.innerHTML = 'Correct Password!';
      } else {
        outputField.innerHTML = 'Wrong Password!';
      }
    },
    null,
    () => outputField.innerHTML += '\n No more tries accepted!');
