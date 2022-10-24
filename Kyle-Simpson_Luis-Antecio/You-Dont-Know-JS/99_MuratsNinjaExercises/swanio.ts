import {Option} from '@swan-io/boxed'
// like Maybe

// You can enforce the type using a type parameter
Option.Some<string>('John') //?
Option.None<string>() //?
Option.fromNullable('John') //?

// null and undefined
Option.fromNullable(null) //?
Option.fromNull(null) //?
Option.fromUndefined(undefined) //?

// The map and flatMap functions transform the data
// map

const some = Option.Some(1) //?
const none = Option.None() //?
const doubledSome = some.map(x => x * 2) //?
const doubledNone = none.map(x => x * 2) //?

Option.Some<number>(2).map(x => x * 2) //?
Option.None().map(x => x * 2) //?

// flatMap is used for nested values
Option.Some(3).flatMap(x => (x > 2 ? Option.None() : Option.Some(2))) //?

Option.Some(1).flatMap(x => (x > 2 ? Option.None() : Option.Some(2))) //?

// getWithDefault
Option.Some(2).getWithDefault(1) //?

// @ts-ignore
Option.None().getWithDefault(1) //?
