// bufferWhen(): collect all values until closing selector emits, emit buffered values.
// bufferWhen(closingSelector: function): Observable

import { interval, timer } from 'rxjs';
import { bufferWhen } from 'rxjs/operators';

const oneSecondInterval = timer(0, 1000);
// return an observable that emits value every 5 seconds
const fiveSecondInterval = () => interval(5000);

const bufferWhenExample = oneSecondInterval.pipe(
  bufferWhen(fiveSecondInterval)
);

bufferWhenExample.subscribe(val =>
  console.log('Emitted Buffer: ', val)
);