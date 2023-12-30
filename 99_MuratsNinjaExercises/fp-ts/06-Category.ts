// https://dev.to/gcanti/getting-started-with-fp-ts-category-4c9a

/* Previously we saw some basic abstractions used in functional programming: Eq, Ord, Semigroup and Monoid.
 A corner stone of functional programming is composition
 Categories capture the essence of composition.

What is a category?

Definition:
 A category is a pair (Objects, Morphisms) where:
* Objects is a collection of objects
* Morphisms is a collection of morphisms (or arrows) between the objects

Each morphism f has a source object A and a target object B where A and B are in Objects.
We write f: A ⟼ B, and we say "f is a morphism from A to B".

Composition:
There's an operation ∘, named "composition", such that the following properties must hold

* (composition of morphisms) whenever f: A ⟼ B and g: B ⟼ C are two morphism in Morphisms 
then there must exist a third morphism g ∘ f: A ⟼ C in Morphisms which is the composition of f and g
* (associativity) if f: A ⟼ B, g: B ⟼ C and h: C ⟼ D then h ∘ (g ∘ f) = (h ∘ g) ∘ f
* (identity) for every object X, there exists a morphism identity: X ⟼ X called the identity morphism for X, 
such that for every morphism f: A ⟼ X and every morphism g: X ⟼ B, we have identity ∘ f = f and g ∘ identity = g.

///////////

A category can be interpreted as a simplified model of a typed programming language where: 

objects are types:
A = string
B = number
C = boolean

morphisms are functions:
f = string => number
g = number => boolean

∘ is the usual function composition:
g ∘ f = string => boolean

//////////
A category for TypeScript
We can define a category, named TS, as a model for the TypeScript language, where:

* objects are all the TypeScript types: string, number, Array<string>
* morphisms are all the TypeScript functions: (a: A) => B, (b: B) => C, ... where A, B, C, ... are TypeScript types
* identity morphisms are all encoded as a single polymorphic functions: const identity = <A>(a: A): A => a
* composition of morphisms is the usual function composition (which is associative)

*/

const f = (s: string): number => s.length
const g = (n: number): boolean => n > 0
// h = g * f
const h = (s: string): boolean => g(f(s))

h('hello') //?
h('') //?

///////
// The central problem with composition
// In TS we can compose two generic functions f: (a: A) => B and g: (c: C) => D
// as long as the output type of the first function f: (a: A) => B
// must match the input type of the second function g: (b: B) => C

// A: string
// B: number
// C: boolean
const compose =
  <A, B, C>(g: (b: B) => C, f: (a: A) => B): ((a: A) => C) =>
  a =>
    g(f(a))

// @ts-expect-error js version
const composeJS = (g, f) => a => g(f(a))

compose(g, f)('hello') //?
composeJS(g, f)('') //?
