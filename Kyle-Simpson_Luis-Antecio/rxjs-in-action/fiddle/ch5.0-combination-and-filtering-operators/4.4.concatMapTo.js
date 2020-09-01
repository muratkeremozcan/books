// concatMapTo(): subscribe to provided observable when previous completes, emit values
// signature: concatMapTo(observable: Observable, resultSelector: function): Observable

// RxJS v6+
import { of, interval } from 'rxjs';
import { concatMapTo, delay, take } from 'rxjs/operators';

const sampleInterval = interval(500).pipe(take(5));
const fakeRequest = of('Network request complete').pipe(delay(3000));
// wait for first to complete before next is subscribed
const exampl1e = sampleInterval.pipe(
  concatMapTo(fakeRequest)
);
// output: Network request complete...3s...Network request complete'
example1.subscribe(val => console.log(val));