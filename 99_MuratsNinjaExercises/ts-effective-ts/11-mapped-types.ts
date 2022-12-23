// react example
// suppose you have a chart component, you’d like to redraw the chart only when you need to.
// Changing data or display properties will require a redraw, but changing the event handler will not.
// This sort of optimization is common in React components, where an event handler Prop might be set to a new arrow function on every render.

// Use mapped types to keep related values and types synchronized.
// Consider using mapped types to force choices when adding new properties to an interface.

// problem with the below: what if there is a new property? The chart will redraw when it doesn't need to
{
  type ScatterProps = {
    // The data
    xs: number[]
    ys: number[]

    // Display
    xRange: [number, number]
    yRange: [number, number]
    color: string

    // Events
    onClick: (x: number, y: number, index: number) => void
    // Note: if you add a property here, update shouldUpdate!
  }
  function shouldUpdate(oldProps: ScatterProps, newProps: ScatterProps) {
    let k: keyof ScatterProps
    for (k in oldProps) {
      if (oldProps[k] !== newProps[k]) {
        if (k !== 'onClick') return true
      }
    }
    return false
  }
}

// solution: use a mapped type and an object
{
  type ScatterProps = {
    // The data
    xs: number[]
    ys: number[]

    // Display
    xRange: [number, number]
    yRange: [number, number]
    color: string
    // someNewProp: string // toggle to see it work

    // Events
    onClick: (x: number, y: number, index: number) => void
  }

  // The [k in keyof ScatterProps] tells the type checker that REQUIRES_UPDATE should have all the same properties as ScatterProps.
  // if a new prop is added to ScatterProps, it must be added to REQUIRES_UPDATE
  // that, in turn, effects the conditional in shouldUpdate
  const REQUIRES_UPDATE: {[k in keyof ScatterProps]: boolean} = {
    xs: true,
    ys: true,
    xRange: true,
    yRange: true,
    color: true,
    onClick: false,
  }

  function shouldUpdate(oldProps: ScatterProps, newProps: ScatterProps) {
    let k: keyof ScatterProps
    for (k in oldProps) {
      if (oldProps[k] !== newProps[k] && REQUIRES_UPDATE[k]) {
        return true
      }
    }
    return false
  }
}
