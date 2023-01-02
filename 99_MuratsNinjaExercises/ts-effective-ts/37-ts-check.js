// @ts-check
// just add that comment to the top of the file and you get type checking

const person = {first: 'Grace', last: 'Hopper'}
2 * person.first

// asserting a type using jsdoc
const ageEl = /** @type {HTMLInputElement} */ (document.getElementById('age'))
ageEl.value = '12' // OK

// add jsdoc comments to functions to get type checking
// to specify the type of the parameters and the return type, use { }
// remember, no need to do this with TS, only with JS using JSDoc for type checking
{
  /**
   * Gets the size (in pixels) of an element.
   * @param {Node} el The element
   * @return {{w: number, h: number}} The size
   */
  function getSize(el) {
    const bounds = el.getBoundingClientRect()
    // ~~~~~~~~~~~~~~~~~~~~~ Property 'getBoundingClientRect'
    //                       does not exist on type 'Node'
    return {width: bounds.width, height: bounds.height}
    // ~~~~~~~~~~~~~~~~~~~ Type '{ width: any; height: any; }' is not
    //                     assignable to type '{ w: number; h: number; }'
  }
}
// (corrections)
{
  /**
   * Gets the size (in pixels) of an element.
   * @param {Element} el The element
   * @return {{width: number, height: number}} The size
   */
  function getSize(el) {
    const bounds = el.getBoundingClientRect()
    // ~~~~~~~~~~~~~~~~~~~~~ Property 'getBoundingClientRect'
    //                       does not exist on type 'Node'
    return {width: bounds.width, height: bounds.height}
    // ~~~~~~~~~~~~~~~~~~~ Type '{ width: any; height: any; }' is not
    //                     assignable to type '{ w: number; h: number; }'
  }
}

/**
 * @param {number} val
 */
function double(val) {
  return 2 * val
}

/** data is an object with files property that is an array of strings
 * @param {{files: string[]}} data
 */
function loadData(data) {
  data.files.forEach(async file => {
    // ...
  })
}


// let's say we have a user object, we need types for it
console.log(user.firstName)
// create a types.d.ts file and add the following
interface UserData {
  firstName: string;
  lastName: string;
}
declare let user: UserData

// if creating a file does not work, you can add a triple slash reference and import it like this
/// <reference path="./types.d.ts" />
