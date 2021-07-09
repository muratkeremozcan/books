import { spider } from './spider.js'
import { TaskQueue } from './TaskQueue.js'

const url = process.argv[2] // CLI argument parsing, accepts 3 parameters
const nesting = Number.parseInt(process.argv[3], 10) || 1
const concurrency = Number.parseInt(process.argv[4], 10) || 2

// A TaskQueue object is created and listeners are attached to the error and empty events. 
// When an error occurs, we simply want to print it. When the queue is empty, that means that we've finished crawling the website.
const spiderQueue = new TaskQueue(concurrency)
spiderQueue.on('error', console.error)
spiderQueue.on('empty', () => console.log('Download complete'))

// we start the crawling process by invoking the spider function
spider(url, nesting, spiderQueue)
// to run: node spider-cli.js https://loige.co 1 4