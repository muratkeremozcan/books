// with function expressions we can apply a type declaration to the function at once
type DiceRollFn = (sides: number) => number

function rollDice1(sides: number): number {
  return 0
} // Statement
const rollDice2: DiceRollFn = function (sides: number): number {
  return 0
} // Expression
const rollDice3: DiceRollFn = (sides: number): number => {
  return 0
} // Also expression

// typing this entire function expression is more concise and has better safety
{
  async function checkedFetch(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init)
    if (!response.ok) {
      return new Error('Request failed: ' + response.status)
    }
    return response
  }
}

{
  const checkedFetch: typeof fetch = async (input, init) => {
    //  ~~~~~~~~~~~~   Type 'Promise<Response | HTTPError>'
    //                     is not assignable to type 'Promise<Response>'
    //                   Type 'Response | HTTPError' is not assignable
    //                       to type 'Response'
    const response = await fetch(input, init)
    if (!response.ok) {
      return new Error('Request failed: ' + response.status)
    }
    return response
  }
}

{
  interface Options {}

  function get(url: string, opts: Options): Promise<Response> {
    /* COMPRESS */ return Promise.resolve(new Response()) /* END */
  }
  function post(url: string, opts: Options): Promise<Response> {
    /* COMPRESS */ return Promise.resolve(new Response()) /* END */
  }

  type HTTPFunction = (url: string, options: Options) => Promise<Response>

  const get2: HTTPFunction = (url, options) => {
    return Promise.resolve(new Response())
  }
  const post2: HTTPFunction = (url, options) => {
    return Promise.resolve(new Response())
  }
}
