import { createServer } from 'http'
import level from 'level'
import timestamp from 'monotonic-timestamp'
import JSONStream from 'JSONStream'
import amqp from 'amqplib'

async function main () {
  const db = level('./msgHistory')

  // We first establish a connection with the AMQP broker, which in our case is RabbitMQ. 
  const connection = await amqp.connect('amqp://localhost')
  // Then, we create a channel, which is similar to a session that will maintain the state of our communications. 
  const channel = await connection.createChannel()
  // Next, we set up an exchange, named chat. As we already mentioned, it is a fanout exchange.
  // The assertExchange() command will make sure that the exchange exists on the broker, otherwise it will create it.
  await channel.assertExchange('chat', 'fanout')
  // We also create a queue called chat_history. By default, the queue is durable (not exclusive and not auto-delete),
  // so we don't need to pass any extra options to support durable subscribers. 
  const { queue } = channel.assertQueue('chat_history')
  // Next, we bind the queue to the exchange we previously created. 
  // Here, we don't need any other particular option (such as a routing key or pattern), as the exchange is of the type fanout, so it doesn't perform any filtering.
  await channel.bindQueue(queue, 'chat')

  // Finally, we can begin to listen for messages coming from the queue we just created. 
  // We save every message that we receive in a LevelDB database using a monotonic timestamp as the key (see nodejsdp.link/monotonic-timestamp) 
  // to keep the messages sorted by date. 
  // It's also interesting to see that we are acknowledging every message using channel.ack(msg), but only after the message is successfully saved into the database.
  // If the ACK (acknowledgment) is not received by the broker, the message is kept in the queue to be processed again.
  channel.consume(queue, async msg => {
    const content = msg.content.toString()
    console.log(`Saving message: ${content}`)
    await db.put(timestamp(), content)
    channel.ack(msg)
  })

  createServer((req, res) => {
    res.writeHead(200)
    db.createValueStream()
      .pipe(JSONStream.stringify())
      .pipe(res)
  }).listen(8090)
}

main().catch(err => console.error(err))
