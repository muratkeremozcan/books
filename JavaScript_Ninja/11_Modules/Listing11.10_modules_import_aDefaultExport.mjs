// This is when you exported a whole module, export default class Ninja {...} - single class -, and want to import that

import ImportedNinja from "./Listing11.9_modules_default_export.mjs"; // when importing a default export, no need for braces. Name can be anything
// here ImportedNinja refers to the exported default class
import {compareNinjas} from "./Listing11.9_modules_default_export.mjs"; // importing a named export

// ES6 alternative short syntax
// import ImportedNinja, {compareNinjas} from "./Listing11.9_modules_default_export.mjs";

const ninja1 = new ImportedNinja("Yoshi");
const ninja2 = new ImportedNinja("Hattori");

console.log(ninja1);
console.log(ninja2);

console.log(compareNinjas(ninja1, ninja2)); //  we can access named exports still
// should return false, since they are different names
