export const ninja = "Yoshi"; // export a named variable
export function compare(){}; // export a named function
export class Ninja{}; // export a named class

export default class Ninjas{}; // export default class
export default function Ninjass(){}; // export default function

const ninja2 = "Yoshi";
function compare2(){};
export { ninja2, compare2 };            // export variables
export { ninja2 as samurai, compare2 };  // export variable with alias

import Ninja3 from  "../Ninja.js";      // import default export
import {ninja4, Ninja4} from "../Ninja.js";  // import named exprts

import * as Ninja5 from "./Ninja.js"; // import all named exports from a module
import { ninja as iNinja } from "./Ninja.js";   //import a named export with alias