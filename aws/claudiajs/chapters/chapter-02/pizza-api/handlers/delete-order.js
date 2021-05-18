'use strict'

function deleteOrder(id) {
  if (!id)
    throw new Error('Order ID is required for deleting the order')

  return {}
}

module.exports = deleteOrder
