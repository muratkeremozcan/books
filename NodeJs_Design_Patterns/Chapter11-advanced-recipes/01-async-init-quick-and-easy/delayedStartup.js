import { once } from 'events'
import { db } from './db.js'

// The second quick and dirty solution to the problem of asynchronously initialized components involves 
// delaying the execution of any code relying on the asynchronously initialized component until the component has finished its initialization routinE
// we first wait for the initialization to complete, and then we proceed with executing any routine that uses the db object.

async function initialize () {
  db.connect()
  await once(db, 'connected')
}

async function updateLastAccess () {
  await db.query(`INSERT (${Date.now()}) INTO "LastAccesses"`)
}

initialize()
  .then(() => {
    updateLastAccess()
    setTimeout(() => {
      updateLastAccess()
    }, 600)
  })
