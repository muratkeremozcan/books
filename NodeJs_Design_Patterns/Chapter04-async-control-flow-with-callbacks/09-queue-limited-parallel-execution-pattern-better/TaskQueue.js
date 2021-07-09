// The interesting property of the TaskQueue class is that it allows us to dynamically add new items to the queue. 
// The other advantage is that, now, we have a central entity responsible for the limitation of the concurrency of our tasks, 
// which can be shared across all the instances of a function's execution.
export class TaskQueue {
  constructor (concurrency) {
    this.concurrency = concurrency
    this.running = 0 // keeps track of running tasks
    this.queue = [] // stores pending tasks
  }

  /** adds a new task to the queue and then bootstraps the execution of the worker
   by asynchronously invoking this.next() */
  pushTask (task) {
    this.queue.push(task)
    process.nextTick(this.next.bind(this))
    return this
  }

  /**
    starts as many tasks from the queue as possible, without exceeding the concurrency limit.
    When each task is complete, it updates the count of running tasks 
    and then starts another round of tasks by asynchronously invoking next() again.   */
  next () {
    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift()
      task(() => {
        this.running--
        process.nextTick(this.next.bind(this))
      })
      this.running++
    }
  }
}


/* problem:
implementation of TaskQueue is sufficient to demonstrate the queue pattern, but in order to be used in real-life projects,
it needs a couple of extra features. 
For instance, how can we tell when one of the tasks has failed?
 How do we know whether all the work in the queue has been completed?
*/