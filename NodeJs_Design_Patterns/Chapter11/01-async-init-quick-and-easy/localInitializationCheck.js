import { once } from 'events'
import { db } from './db.js'

// The first solution makes sure that the module is initialized before any of its APIs are invoked;
// otherwise, we wait for its initialization
// any time we want to invoke the query() method on the db component, we have to check if the module is initialized;
// otherwise, we wait for its initialization by listening for the 'connected' event

db.connect()

async function updateLastAccess () {
  if (!db.connected) {
    await once(db, 'connected')
  }

  // A variation of this technique performs the check inside the query() method itself, 
  // which shifts the burden of the boilerplate code from the consumer to the provider of the service.
  await db.query(`INSERT (${Date.now()}) INTO "LastAccesses"`)
}

updateLastAccess()
setTimeout(() => {
  updateLastAccess()
}, 600)
