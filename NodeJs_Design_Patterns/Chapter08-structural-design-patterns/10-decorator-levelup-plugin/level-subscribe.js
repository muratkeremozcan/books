export function levelSubscribe (db) {
  // We decorate the db object with a new method named subscribe()
  // We simply attach the method directly to the provided db instance (object augmentation)
  db.subscribe = (pattern, listener) => { 
    // We listen for any put operation performed on the database
    db.on('put', (key, val) => { 
      // We perform a very simple pattern-matching algorithm, 
      // which verifies that all the properties in the provided pattern are also available in the data being inserted
      const match = Object.keys(pattern).every(
        k => (pattern[k] === val[k])
      )
      // If we have a match, we notify the listener
      if (match) {
        listener(key, val) 
      }
    })
  }

  return db
}



