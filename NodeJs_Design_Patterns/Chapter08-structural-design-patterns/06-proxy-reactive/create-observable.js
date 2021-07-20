/** compares the current value with the new one and, if they are different, 
 * the target object is mutated, and the observer gets notified.
 * When the observer is invoked, we pass an object literal that contains information related to the change (the name of the property, the previous value, and the current value).
*/
export function createObservable (target, observer) {
  const observable = new Proxy(target, {
    set (obj, prop, value) {
      if (value !== obj[prop]) {
        const prev = obj[prop]
        obj[prop] = value
        observer({ prop, prev, curr: value })
      }
      return true
    }
  })

  return observable
}
