import { createObservable } from './create-observable.js'

// We declare a function that calculates the total for a given invoice, 
// then we create an invoice object and a value to hold the total for it.
function calculateTotal (invoice) { // ①
  return invoice.subtotal -
    invoice.discount +
    invoice.tax
}

const invoice = {
  subtotal: 100,
  discount: 10,
  tax: 20
}
let total = calculateTotal(invoice)
console.log(`Starting total: ${total}`)

// we create an observable version of the invoice object. 
// Every time there is a change in the original invoice object, 
// we recalculate the total and we also print some logs to keep track of the changes
const obsInvoice = createObservable( // ②
  invoice,
  ({ prop, prev, curr }) => {
    total = calculateTotal(invoice)
    console.log(`TOTAL: ${total} (${prop} changed: ${prev} -> ${curr})`)
  }
)

// we apply some changes to the observable invoice. 
// Every time we mutate the obsInvoice object the observer function is triggered, 
// the total gets updated, and some logs are printed on the screen
obsInvoice.subtotal = 200 // TOTAL: 210
obsInvoice.discount = 20 // TOTAL: 200
obsInvoice.discount = 20 // no change: doesn't notify
obsInvoice.tax = 30 // TOTAL: 210

console.log(`Final total: ${total}`)


