import {generate} from 'rxjs';
/* 
signature:
generate(
  initialStateOrOptions: GenerateOptions,
  condition?: ConditionFunc,
  iterate?: IterateFunc,
  resultSelectorOrObservable?: (ResultFunc) | SchedulerLike,
  scheduler?: SchedulerLike): Observable

 Generates an observable sequence by running a state-driven loop producing the sequence's elements,
 using the specified scheduler to send out observer messages.
*/

generate(
  2,
  x => x <= 8,
  x => x + 3
).subscribe(console.log)

generate(
  2,
  x => x <= 38,
  x => x + 3,
  x => '.'.repeat(x)
).subscribe(console.log)
