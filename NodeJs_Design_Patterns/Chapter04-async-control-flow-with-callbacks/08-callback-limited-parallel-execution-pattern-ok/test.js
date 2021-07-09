function makeSampleTask (name) {
  return (cb) => {
    console.log(`${name} started`)
    setTimeout(() => {
      console.log(`${name} completed`)
      cb()
    }, Math.random() * 2000)
  }
}

const tasks = [
  makeSampleTask('Task 1'),
  makeSampleTask('Task 2'),
  makeSampleTask('Task 3'),
  makeSampleTask('Task 4'),
  makeSampleTask('Task 5'),
  makeSampleTask('Task 6'),
  makeSampleTask('Task 7')
]

const concurrency = 2
let running = 0
let completed = 0
let index = 0

// We have an iterator function, which we call next(), 
// and then an inner loop that spawns as many tasks as possible in parallel 
// while staying within the concurrency limit.
function next () { // [1]

  while (running < concurrency && index < tasks.length) {
    const task = tasks[index++]

    // The next important part is the callback we pass to each task, 
    // which checks whether we completed all the tasks in the list.
    // If there are still tasks to run, it invokes next() to spawn another set of tasks.
    task(() => { // [2]
      if (++completed === tasks.length) {
        return finish()
      }
      running-- //?
      next()
    })

    running++ //?
  }
}
next()

function finish () {
  // all the tasks completed
  console.log('All tasks executed!')
}


/*
In general, this implementation of the limited concurrency pattern works very well when we have a predetermined set of tasks to execute,
 or when the set of tasks grows linearly over time. 
 When, instead, a task can spawn two or more tasks directly, as happens with our web spider, 
 this implementation is not suitable for limiting the global concurrency.
*/