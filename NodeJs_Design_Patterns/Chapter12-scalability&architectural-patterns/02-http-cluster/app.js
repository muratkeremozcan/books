import { createServer } from 'http'
import { cpus } from 'os'
import cluster from 'cluster'

// When we launch app.js from the command line, we are actually executing the master process.
// In this case, the cluster.isMaster variable is set to true and the only work we are required
// to do is forking the current process using cluster.fork(). 
// In the preceding example, we are starting as many workers as there are logical CPU cores 
// in the system to take advantage of all the available processing power.
if (cluster.isMaster) {
  const availableCpus = cpus()
  console.log(`Clustering to ${availableCpus.length} processes`)
  availableCpus.forEach(() => cluster.fork())
// When cluster.fork() is executed from the master process, the current module (app.js) is run again,
// but this time in worker mode (cluster.isWorker is set to true, while cluster.isMaster is false).
// When the application runs as a worker, it can start doing some actual work. 
// In this case, it starts a new HTTP server.
} else {
  const { pid } = process
  const server = createServer((req, res) => {
    let i = 1e7; while (i > 0) { i-- }
    console.log(`Handling request from ${pid}`)
    res.end(`Hello from ${pid}\n`)
  })

  server.listen(8080, () => console.log(`Started at ${pid}`))
}
