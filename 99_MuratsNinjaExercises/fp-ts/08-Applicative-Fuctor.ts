/*

Functors allow us to compose an effectful program f with a pure program g, but g must be unary, 
that is it must accept only one argument as input. What if g accepts two arguments? Or three?
Applicative Functors are used for this.

Program f			Program g							Composition
pure					pure									g ∘ f
effectful			pure (unary)					lift(g) ∘ f
effectful			pure (n-ary, n > 1)		?
*/
