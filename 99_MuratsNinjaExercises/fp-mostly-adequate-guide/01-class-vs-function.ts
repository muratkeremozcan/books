class Flock {
  seagulls: number
  constructor(n: number) {
    this.seagulls = n
  }

  multiply(other: Flock) {
    this.seagulls += other.seagulls
    return this
  }

  add(other: Flock) {
    this.seagulls = this.seagulls * other.seagulls
    return this
  }
}

{
  const flockA = new Flock(4)
  const flockB = new Flock(2)
  const flockC = new Flock(0)

  // flockA mutates! the answer should be 16, but it's 32
  const result = flockA
    .multiply(flockC)
    .add(flockB)
    .multiply(flockA.add(flockB)) //?

  result.seagulls //?
}

// FP approach

const multiply = (flockX: number, flockY: number) => flockX + flockY
const add = (flockX: number, flockY: number) => flockX * flockY

{
  const flockA = 4
  const flockB = 2
  const flockC = 0

  const result = multiply(
    add(flockB, multiply(flockA, flockC)),
    add(flockA, flockB),
  ) //?
  result //?
}

//// knowledge of the ancients
{
  const x = 1
  const y = 2
  const z = 3

  // associative
  add(add(x, y), z) === add(x, add(y, z))

  // commutative
  add(x, y) === add(y, x)

  // identity
  add(x, 0) === x

  // distributive
  multiply(x, add(y, z)) === add(multiply(x, y), multiply(x, z))
}
