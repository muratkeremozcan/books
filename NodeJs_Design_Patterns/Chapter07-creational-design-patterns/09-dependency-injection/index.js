import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { Blog } from './blog.js'
import { createDb } from './db.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function main () {
  // We create the database dependency (db) using the factory function createDb()
  const db = createDb(join(__dirname, 'data.sqlite'))
  // We explicitly "inject" the database instance when we instantiate the Blog class
  const blog = new Blog(db)
  await blog.initialize()
  const posts = await blog.getAllPosts()
  if (posts.length === 0) {
    console.log('No post available. Run `node import-posts.js`' +
      ' to load some sample posts')
  }

  for (const post of posts) {
    console.log(post.title)
    console.log('-'.repeat(post.title.length))
    console.log(`Published on ${new Date(post.created_at)
      .toISOString()}`)
    console.log(post.content)
  }
}

main().catch(console.error)
