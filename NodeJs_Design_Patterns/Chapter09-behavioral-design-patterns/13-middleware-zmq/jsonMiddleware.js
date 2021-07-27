/** The inbound part of our middleware deserializes the message received as input, 
 * while the outbound part serializes the data into a string, which is then converted into a buffer */
export const jsonMiddleware = function () {
  return {
    inbound (message) {
      return JSON.parse(message.toString())
    },
    outbound (message) {
      return Buffer.from(JSON.stringify(message))
    }
  }
}
