import sqlite3 from 'sqlite3'

// This new implementation of the db module provides a factory function called createDb(),
// which allows us to create new instances of the database at runtime.
//  It also allows us to pass the path to the database file at creation time 
// so that we can create independent instances that can write to different files if we have to

export function createDb (dbFile) {
  return new sqlite3.Database(dbFile)
}
