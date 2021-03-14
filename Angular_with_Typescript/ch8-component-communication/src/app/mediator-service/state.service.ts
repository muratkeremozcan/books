import { Observable, BehaviorSubject } from "rxjs";
import { Injectable } from '@angular/core';

// [4] META source component -> mediator service -> recipient components  (meta)
// in [3] you saw how sibling components use their parent as a mediator.
// If components don’t have the same parent or aren’t displayed at the same time you can use an injectable service as a mediator.
// Whenever the component is created, the mediator service is injected, and the component can subscribe to events emitted by the service
// as opposed to using @Input() parameters
// RxJs subject is perfect for this event emitting scenario between components,
// the only thing we need is for the subscribers to get the most recent event. BehaviorSubject provides this.

// in this example SearchComponent (the source) emits to recipient components (amazon, ebay) via StateService (mediator service)

// high level: source component -> mediator service -> recipient components
// create the mediator service, use BehaviorSubject so that the last emitted value can be emitted to new subscribers whenever they subscribe (4.1)
// create a set function for source component to emit on demand (4.2)
// create a function for recipient components to get the state and use the subscribe callback  (value, error, complete) to observe side effects (4.3)
// use the mediator service at the source component to emit events (4.4)
// use the mediator service at the recipient component get the event (4.5)

@Injectable()
export class StateService {

  // (4.1) use BehaviorSubject so that the last emitted value can be emitted to new subscribers / other components whenever they sub
  private stateSubject: BehaviorSubject<string> = new BehaviorSubject('');

  // (4.2) need a setter function that emits events on demand. This is to be used by the source component to emit the events
  set searchCriteria(value: string) {
    this.stateSubject.next(value);  // emitting the value
  }

  // (4.3) recipients need a function to get the state from the mediator
  // Technically, the recipients could subscribe to the subject directly,
  // but if they had a reference to the Subject, they could use next() to emit new events. We do not want that; only the source component should emit events.
  // we want them to only use the subscribe callback  (value, error, complete) to observe the side effects; not create side effects
  getState(): Observable<string> {
    return this.stateSubject.asObservable();  // Returns the reference to Observable of the Subject
  }
}
