const restify = require("restify")
const ngrok = require("ngrok")

const start = async (handlers) => {
	const port = 8000 + Math.ceil(Math.random() * 1000)
	const url = await ngrok.connect(port)

	const server = restify.createServer()
	server.post(
    "/v2/payments/authorizations/:authorizationId/capture",
    handlers.captureAuthorizedPayment)
  
	server.use(restify.plugins.bodyParser())
	server.listen(port, function() {
		console.log(`listening at ${url}`)
	})
  
	return {
		url,
		stop: async () => {
			server.close()
			await ngrok.kill()
		}
	}
}

module.exports = {
	start
}