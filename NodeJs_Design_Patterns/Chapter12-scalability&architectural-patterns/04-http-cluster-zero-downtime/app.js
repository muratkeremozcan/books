import { createServer } from 'http'
import { cpus } from 'os'
import { once } from 'events'
import cluster from 'cluster'

if (cluster.isMaster) {
  const availableCpus = cpus()
  console.log(`Clustering to ${availableCpus.length} processes`)
  availableCpus.forEach(() => cluster.fork())

  cluster.on('exit', (worker, code) => {
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log(`Worker ${worker.process.pid} crashed. Starting a new worker`)
      cluster.fork()
    }
  })

  // The restarting of the workers is triggered on receiving the SIGUSR2 signal.
  // Note that we are using an async function to implement the event handler as we will need to perform some asynchronous tasks here.
  process.on('SIGUSR2', async () => {
    const workers = Object.values(cluster.workers)
    // When a SIGUSR2 signal is received, we iterate over all the values of the cluster.workers object. 
    // Every element is a worker object that we can use to interact with a given worker currently active in the pool of workers.
    for (const worker of workers) {
      console.log(`Stopping worker: ${worker.process.pid}`)
      // The first thing we do for the current worker is invoke worker.disconnect(), which stops the worker gracefully.
      // This means that if the worker is currently handling a request, this won't be interrupted abruptly;
      // instead, it will be completed. The worker exits only after the completion of all inflight requests.
      worker.disconnect()
      await once(worker, 'exit')
      if (!worker.exitedAfterDisconnect) continue
      // When the terminated process exits, we can spawn a new worker.
      const newWorker = cluster.fork()
      // We wait for the new worker to be ready and listening for new connections before we proceed with restarting the next worker.
      await once(newWorker, 'listening')
    }
  })
} else {
  const { pid } = process
  const server = createServer((req, res) => {
    let i = 1e7; while (i > 0) { i-- }
    console.log(`Handling request from ${pid}`)
    res.end(`Hello from ${pid}\n`)
  })

  server.listen(8080, () => console.log(`Started at ${pid}`))
}
