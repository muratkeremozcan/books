import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import level from 'level'
import { levelSubscribe } from './level-subscribe.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dbPath = join(__dirname, 'db')
// First, we initialize our LevelUP database, choosing the directory where the files are stored
// and the default encoding for the values
const db = level(dbPath, { valueEncoding: 'json' })
// Then, we attach our plugin, which decorates the original db object
levelSubscribe(db)

// At this point, we are ready to use the new feature provided by our plugin, 
// which is the subscribe() method, where we specify that we are interested in all the objects with doctype: 'tweet' and language: 'en'
db.subscribe(
  { doctype: 'tweet', language: 'en' },
  (k, val) => console.log(val)
)
// Finally, we save some values in the database using put. 
// The first call triggers the callback associated with our subscription and we should see the stored object printed to the console. 
// This is because, in this case, the object matches the subscription. 
// The second call does not generate any output because the stored object does not match the subscription criteria.
db.put('1', { // ④
  doctype: 'tweet',
  text: 'Hi',
  language: 'en'
})
db.put('2', {
  doctype: 'company',
  name: 'ACME Co.'
})
