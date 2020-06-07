import Rx from 'rxjs/Rx';

// in unit tests, we need to trick time so that they do not take long.
// we can use a virtual timer / scheduler
/*
interface Scheduler {
  now(): number;
  schedule(work, delay?, state?): Subscription; // schedules work, optional delay, optional state for state management
  flush(): void; // executes all actions and clears the queue
  active: boolean; // indicates if the queue is currently executing
  scheduleId: number; // queue of actions to schedule
}
*/

// schedule a set of actions to run synchronously and then flush as a series of notifications:

let stored= [];

// Temporarily stores the scheduled actions so that you can compare them to what the scheduler remits. 
// Every time an action runs, it stores its value into the stored array.
let store = state => () => stored.push(state);

// Uses a simple scheduler that queues the actions to run
let scheduler = Rx.Scheduler.queue;

// schedules actions to run immediately (default delay is 0)
scheduler.schedule(store(1));
scheduler.schedule(store(2));
scheduler.schedule(store(3));
scheduler.schedule(store(4));
scheduler.schedule(store(5));

scheduler.flush();

stored; //?