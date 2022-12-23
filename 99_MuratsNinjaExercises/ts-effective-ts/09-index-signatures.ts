// Use index signatures when the properties of an object cannot be known until runtime—for example, if you’re loading them from a CSV file.
// Consider adding undefined to the value type of an index signature for safer access.
// Prefer more precise types to index signatures when possible: interfaces, Records, or mapped types.

// objects map string keys to values of any type, we can represent this with an index signature

type TRocket = {[property: string]: string}
// problems with index signatures
// * any key string is allowed,
// * missing keys or no keys at all are allowed
// * all values have to be the same type

const rocket: TRocket = {
  name: 'Falcon 9',
  variant: 'v1.0',
  thrust: '4,940 kN',
} // OK

// there is a better way to represent objects in this case
type IRocket = {
  name: string
  variant: string
  thrust_kN: number
}
const falconHeavy: IRocket = {
  name: 'Falcon Heavy',
  variant: 'v1',
  thrust_kN: 15_200,
}

// when are index signature useful? Dynamic data, like csv file, where the column names are not known in advance
function parseCSV(input: string): {[columnName: string]: string}[] {
  const lines = input.split('\n')
  const [header, ...rows] = lines
  return rows.map(rowStr => {
    const row: {[columnName: string]: string} = {}
    rowStr.split(',').forEach((cell, i) => {
      row[header[i]] = cell
    })
    return row
  })
}

// if some columns are known in advance, an assertion can be used
interface ProductRow {
  productId: string
  name: string
  price: string
}
declare let csvData: string
const products = parseCSV(csvData) as unknown as ProductRow[]
function safeParseCSV(input: string): {[columnName: string]: string | undefined}[] {
  return parseCSV(input)
}

// Prefer more precise types to index signatures when possible: interfaces, Records, or mapped types.
type Vec3D = Record<'x' | 'y' | 'z', number>
// Type Vec3D = {
//   x: number;
//   y: number;
//   z: number;
// }

type Vec3D2 = {[k in 'x' | 'y' | 'z']: number}
// Same as above
type ABC = {[k in 'a' | 'b' | 'c']: k extends 'b' ? string : number}
// Type ABC = {
//   a: number;
//   b: string;
//   c: number;
// }
