import { Observable, BehaviorSubject } from "rxjs";
import { Injectable } from '@angular/core';



// in [3] you saw how sibling components use their parent as a mediator.
// [4] If components don’t have the same parent or aren’t displayed at the same time you can use an injectable service as a mediator.
// Whenever the component is created, the mediator service is injected, and the component can subscribe to events emitted by the service
// as opposed to using @Input() parameters
// RxJs subject is perfect for this event emitting scenario between components,
// the only thing we need is for the subscribers get the most recent event. BehaviorSubject provides this.

// in this example SearchComponent (the source) emits to other components (amazon, ebay) via StateService (mediator component)
// source component -> mediator service -> other components

@Injectable()
export class StateService {

  // (4.1) use BehaviorSubject so that the last emitted value can be emitted to new subscribers / other components whenever they sub
  private stateSubject: BehaviorSubject<string> = new BehaviorSubject('');

  // (4.2) need a function that emits events on demand. This is to be used by the source component to emit the events
  set searchCriteria(value: string) {
    this.stateSubject.next(value);  // emitting the value
  }

  // (4.3) recipients need a function to get the state from the mediator
  // Technically, the recipients could subscribe to the subject directly,
  // but if they had a reference to the Subject, they could use next() to emit new events
  // we want them to only use the subscribe callback  (value, error, complete) to observe the side effects; not create side effects
  getState(): Observable<string> {
    return this.stateSubject.asObservable();  // Returns the reference to Observable of the Subject
  }
}
