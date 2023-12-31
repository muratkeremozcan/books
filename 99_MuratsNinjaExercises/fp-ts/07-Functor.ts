import {Option, isNone, none, some, fold as foldOption} from 'fp-ts/Option'
import {Task} from 'fp-ts/Task'
import {Functor1} from 'fp-ts/Functor'
// https://dev.to/gcanti/getting-started-with-fp-ts-functor-36ek

/*
If categories can be used to model programming languages, 
morphisms (i.e. functions in TS) can be used to model programs.

g: (b: B) => C is a pure program
f: (a: A) => F<B> is an effectful program

In order to compose f with g we need find a way to 
lift g from a function (b: B) => C 
to a function (fb: F<B>) => F<C> 
*/

// lift is allowing us to take the double function (pure function g), which operates on single numbers,
// and apply it to an entire array of numbers
const lift =
  <B, C>(g: (b: B) => C): ((fb: Array<B>) => Array<C>) =>
  fb =>
    fb.map(g)

// @ts-expect-error js version
const liftJS = g => fb => fb.map(g)

// example: F = Array
const double = (x: number) => x * 2
const liftDouble = lift(double)
liftDouble([1, 2, 3]) //?

// example: F = Option
// liftOption is allowing us to take the double function (pure function g), which operates on single numbers,
// and apply it to an Option<B>.
// If the Option<B> is none, it returns none;
// if it contains a value (some(b)), it applies the function g to this
const liftOption =
  <B, C>(g: (b: B) => C): ((fb: Option<B>) => Option<C>) =>
  fb =>
    isNone(fb) ? none : some(g(fb.value))

// @ts-expect-error js version
const liftOptionJS = g => fb => isNone(fb) ? none : some(g(fb.value))

const liftDoubleOption = liftOption(double)
liftDoubleOption(none) //?
liftDoubleOption(some(5)) //?

const foldOptionToNumber = (option: Option<number>, defaultValue: number) =>
  foldOption(
    () => defaultValue,
    (a: number) => a,
  )(option)

foldOptionToNumber(liftDoubleOption(some(5)), -1) //?

// example: F = Task
// liftTask allows us to take a function (pure function g),
// which operates on values of type B, and apply it within the context of a Task.
// It takes a Task<B> and transforms it into a Task<C> by applying the function g
// to the result of the Task<B> once it resolves.
// This is useful when you need to process asynchronous results with a synchronous function.
const liftTask =
  <B, C>(g: (b: B) => C): ((fb: Task<B>) => Task<C>) =>
  fb =>
  () =>
    fb().then(g)

// @ts-expect-error js version
const liftTaskJS = g => fb => () => fb().then(g)

// Task usage example

// A function to transform the resolved message to its length ( pure function g that operates on type B / string)
const getMessageLength = (message: string): number => message.length
// Lift the getMessageLength function to work on Task <B> / Task<string>
const liftLengthOfMessage = liftTask(getMessageLength)

// A function that returns a Task, resolving after a delay with a given message
const delayedMessage =
  (ms: number, message: string): Task<string> =>
  () =>
    new Promise(resolve => setTimeout(() => resolve(message), ms))
// Create a Task that resolves with a message after 1000ms ( Task<B> / Task<string> )
const delayedTask = delayedMessage(1000, 'Hello, world!')

// Use liftLengthOfMessage to transform the Task<string> / Task<B> into Task<number> /to Task<C>
const lengthTask = liftLengthOfMessage(delayedTask) // liftTask(getMessageLength)(delayedTask)

// Execute the Task
lengthTask().then(length => {
  length //?
})

////////////// Functors in fp-ts
// Functor (aka Mappable):  a type that implements map and obeys some laws

// this code snippet is defining a way to work with the response of an API call in a functional programming style, using the concept of a Functor.

// Module Augmentation: It uses TypeScript's module augmentation feature to add new declarations to an existing module, in this case, fp-ts/HKT.
// This is a way of telling TypeScript about new capabilities added to a library module after its initial declaration.
// Higher Kinded Types (HKTs): fp-ts uses a technique to simulate HKTs in TypeScript, which doesn't natively support them. H

// The URI property in the functorResponse object is a part of the design pattern used in fp-ts to simulate Higher Kinded Types (HKTs) in TypeScript.
// HKTs are not natively supported in TypeScript, so fp-ts uses a workaround involving this URI property.
// In fp-ts, the URI property serves as a unique identifier for a specific type of functor.
// This allows the library to associate specific behaviors (like map functions) with particular data structures in a type-safe way.
const URI = 'Response'
type URI = typeof URI

declare module 'fp-ts/HKT' {
  interface URItoKind<A> {
    Response: Response<A>
  }
}

// Defining a Type for API Responses: The Response<A> interface represents the structure of an API response
interface Response<A> {
  url: string
  status: number
  headers: Record<string, string>
  body: A
}

// Mapping Function: The map function allows you to transform the body of the response without changing the other parts of the response
const mappingFn = <A, B>(fa: Response<A>, f: (a: A) => B): Response<B> => ({
  ...fa,
  body: f(fa.body),
})
// @ts-expect-error js version
const mapJS = (fa, f) => ({...fa, body: f(fa.body)})

// Functor Implementation: The functorResponse is an implementation of the Functor concept for the Response type.
//  It adheres to the Functor interface by providing a map method.
// This allows you to apply a function to the contents of the body, and get back a new Response with the transformed body.
const functorResponse: Functor1<URI> = {
  URI,
  map: mappingFn,
}
// usage:
// Example API response
const apiResponse: Response<string> = {
  url: 'https://example.com/api/data',
  status: 200,
  headers: {'Content-Type': 'application/json'},
  body: '{"key":"value"}',
}

// A function to parse JSON string
const parseJSON = (jsonString: string): Record<string, any> => JSON.parse(jsonString)

// Using the map function to transform the body of the apiResponse
const transformedResponse = functorResponse.map(apiResponse, parseJSON)
// Output will be a Response object with the body parsed as JSON
transformedResponse //?
functorResponse.URI //?
