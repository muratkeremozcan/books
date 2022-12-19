// union types allow to declare null & undefined possibilities
let numberNullOrUndefined: number | null | undefined = 123
numberNullOrUndefined //?
numberNullOrUndefined = null
numberNullOrUndefined //?
numberNullOrUndefined = undefined
numberNullOrUndefined //?

function functionWithUndefinedParameter(a: number | undefined, b: number) {}
functionWithUndefinedParameter(1, 2)
functionWithUndefinedParameter(undefined, 2)

// null also works with optional parameters
function functionWithNullParameter(a: number | null, b: number) {}
functionWithNullParameter(1, 2)
functionWithNullParameter(null, 2)

// using optional parameters force to make that parameter last
// function functionWithOptionalParameter(a?: number, b: number) {} //? Error: Optional parameters must appear after required parameters.
