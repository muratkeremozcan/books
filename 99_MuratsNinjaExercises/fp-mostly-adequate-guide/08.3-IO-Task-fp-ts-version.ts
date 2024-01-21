import {IOEither, tryCatch as tryCatchIO} from 'fp-ts/IOEither'
import {TaskEither, tryCatch as tryCatchTaskEither} from 'fp-ts/TaskEither'
import * as fs from 'fs'
import * as fsp from 'fs/promises'
import path from 'path'

// IO for sync, Task for async

const readFileSync = (path: string): IOEither<Error, string> =>
  tryCatchIO(
    () => fs.readFileSync(path, 'utf-8'),
    reason => new Error(String(reason)),
  )

readFileSync(path.resolve(__dirname, './metamorphosis.txt'))() //?

const readFileAsync = (path: string): TaskEither<Error, string> =>
  tryCatchTaskEither(
    () => fsp.readFile(path, 'utf-8'),
    reason => new Error(String(reason)),
  )

readFileAsync(path.resolve(__dirname, './metamorphosis.txt'))().then(result => {
  result //?
})
