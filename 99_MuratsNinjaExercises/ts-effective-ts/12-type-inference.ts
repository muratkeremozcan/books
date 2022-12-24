// Avoid writing type annotations when TypeScript can infer the same type.
// Ideally your code has type annotations in function/method signatures but not on local variables in their bodies.
// Consider using explicit annotations for object literals and function return types even when they can be inferred.
/// This will help prevent implementation errors from surfacing in user code.

{
  type Product = {
    id: number
    name: string
    price: number
  }

  function logProduct(product: Product) {
    const id: number = product.id
    const name: string = product.name
    const price: number = product.price
    console.log(id, name, price)
  }
}
// if we change the type, we have to change the local variables as well
{
  type Product = {
    id: string
    name: string
    price: number
  }

  function logProduct(product: Product) {
    const id: number = product.id
    // ~~ Type 'string' is not assignable to type 'number'
    const name: string = product.name
    const price: number = product.price
    console.log(id, name, price)
  }
}
// instead, let TypeScript infer the types
{
  type Product = {
    id: string
    name: string
    price: number
  }
  function logProduct(product: Product) {
    const {id, name, price} = product
    console.log(id, name, price)
  }

  // When do we need to add type annotations?
  // KEY: hover over and see if the type you need is already inferred

  // declaring an object literal is one of the few places where type annotations are useful
  const elmo: Product = {
    name: 'Tickle Me Elmo',
    id: '048188 627152',
    price: 28.99,
  }
  const furby = {
    name: 'Furby',
    id: '048188 627152',
    price: '28.99',
  }

  logProduct(elmo)
  // because we get a better error message, and can check up font instead of having to get an error message
  logProduct(furby)
}

// Function signature is an ideal place for type annotations, except for args with default values
function parseNumber(str: string, base = 10) {
  // ...
}

// Parameter types can usually be inferred when the function is used as a callback for a library with type declarations.
// The declarations on request and response in this example using the express HTTP server library are not required:
import express from 'express'
{
  type App = {
    get(path: string, cb: (request: express.Request, response: express.Response) => void): void
  }
  const app: App = null!

  // Don't do this:
  app.get('/health', (request: express.Request, response: express.Response) => {
    response.send('OK')
  })

  // Do this:
  app.get('/health', (request, response) => {
    response.send('OK')
  })
}

// when function return type is inferred as any, it is better to add an explicit return type
{
  {
    const cache: {[ticker: string]: number} = {}
    // remove the return type, and it will be inferred as number | Promise<any>, which is not ideal and works despite the real issue
    function getQuote(ticker: string): Promise<number> {
      if (ticker in cache) {
        // the real issue is that we should resolve a promise here
        return cache[ticker]
        // Promise.resolve(cache[ticker])
      }
      return fetch(`https://quotes.example.com/?q=${ticker}`)
        .then(response => response.json())
        .then(quote => {
          cache[ticker] = quote
          return quote
        })
    }
    function considerBuying(x: any) {}
  }
}
