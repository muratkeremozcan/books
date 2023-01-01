// Avoid “string typed” code. Prefer more appropriate types where not every string is a possibility.
// Prefer a union of string literal types to string if that more accurately describes the domain of a variable.
// Prefer keyof T to string for function parameters that are expected to be properties of an object.

interface IAlbum {
  artist: string
  title: string
  releaseDate: string // YYYY-MM-DD
  recordingType: string // E.g., "live" or "studio"
}
const kindOfBlue1: IAlbum = {
  artist: 'Miles Davis',
  title: 'Kind of Blue',
  releaseDate: 'August 17th, 1959', // Oops!
  recordingType: 'Studio', // Oops!
} // OK

// try to be more specific
type RecordingType = 'Studio' | 'Live'
type TAlbum = {
  artist: string
  title: string
  releaseDate: Date
  recordingType: RecordingType
}
const kindOfBlue2: TAlbum = {
  artist: 'Miles Davis',
  title: 'Kind of Blue',
  releaseDate: new Date('1959-08-17'),
  recordingType: 'Studio',
}

// we can document the function better, but it's still not perfect
function recordRelease(title: string, date: Date) {
  /* ... */
}
recordRelease(kindOfBlue2.title, kindOfBlue2.releaseDate)

// we can make it better
function recordRelease2(title: TAlbum['title'], date: TAlbum['releaseDate']) {
  /* ... */
}
recordRelease2(kindOfBlue2.title, kindOfBlue2.releaseDate)

// another example of good documentation for the function
function getAlbumsOfType(recordingType: RecordingType): TAlbum[] {
  return []
}

// narrowing down pluck example
function pluck(record: any[], key: string): any[] {
  return record.map(r => r[key])
}

// we can make it better by making any and string more specific
function pluck2<T>(record: T[], key: keyof T): T[keyof T][] {
  return record.map(r => r[key])
}

// While keyof T is much narrower than string, it’s still too broad.
declare let albums: TAlbum[]
const releaseDates2 = pluck2(albums, 'releaseDate') // Type is (string | Date)[]

// To narrow it further, we need to introduce a second generic parameter that is a subset of keyof T :
// final version
function pluck3<T, K extends keyof T>(record: T[], key: K): T[K][] {
  return record.map(r => r[key])
}

const releaseDates3 = pluck3(albums, 'releaseDate') // Type is Date[]
