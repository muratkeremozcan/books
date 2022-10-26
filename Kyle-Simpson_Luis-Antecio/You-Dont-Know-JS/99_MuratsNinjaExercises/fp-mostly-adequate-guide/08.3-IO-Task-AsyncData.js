import {AsyncData} from '@swan-io/boxed'
const fs = require('fs').promises

// not very useful https://mostly-adequate.gitbook.io/mostly-adequate-guide/ch08#pure-error-handling
// IO and Task are like AsyncData
// https://swan-io.github.io/boxed/async-data

// readFile with AsyncData
const readFile = path => AsyncData.Done(fs.readFile(path, 'utf-8'))
readFile(path.resolve(__dirname, './metamorphosis.txt')) //?

// simple values
AsyncData.Done(3).map(three => three + 1) //?
