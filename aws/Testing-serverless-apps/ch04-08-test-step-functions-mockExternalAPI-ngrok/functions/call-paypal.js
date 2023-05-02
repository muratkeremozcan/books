const axios = require('axios')

// imagine this function calls PayPal to capture an authorized payment
// see API reference here:
//    https://developer.paypal.com/docs/api/payments/v2/#authorizations_capture
module.exports.handler = async (input) => {
  const { authorizationId } = input

  const baseUrl = input.overridePaypalUrl || 'https://api-m.sandbox.paypal.com'
  const result = await axios({
    method: 'POST',
    url: `${baseUrl}/v2/payments/authorizations/${authorizationId}/capture`,
    data: {
      amount: {
        value: input.amount,
        currency_code: 'USD'
      },
      invoice_id: input.invoiceId,
      final_capture: true,
      note_to_payer: "Thank you for purchasing Testing Serverless Architectures, pro edition!",
      soft_descriptor: "theburningmonk limited"
    },
    headers: {
      'PayPal-Request-Id': input.requestId
    }
  }).then((resp) => {
    return {
      success: true,
      response: resp.data
    }
  }).catch(error => {
    // see axio's error page: https://axios-http.com/docs/handling_errors
    if (error.response) {
      // PayPal returned a non-2xx response
      console.log(JSON.stringify({
        message: 'PayPal responded a non-2xx response.',
        requestId: input.requestId,
        paypalResponseCode: error.response.status,
        paypalResponseBody: error.response.data,
        requestInput: input,
      }))

      return {
        success: false,
        errorMessage: `PayPal could not process your payment request.`
      }
    } else {
      console.error(JSON.stringify({
        message: 'Unknown error while calling PayPal.',
        error
      }))
      return {
        success: false,
        errorMessage: 'Something went wrong.'
      }
    }
  })

  return result
}