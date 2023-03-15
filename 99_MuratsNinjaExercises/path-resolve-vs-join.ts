import path from 'path'

// path.resolve the absolute path (/Users/...)
path.resolve(__dirname) //?
path.resolve(__dirname, 'a') //?
path.resolve(__dirname, 'a', 'b') //?

// same as just __dirname
path.resolve() //?
path.resolve('a') //?

/////// path.join is like relative path
path.join() //?
path.join('..') //?
path.join('..', '99_MuratsNinjaExercises') //?
// when we use __dirname, they work similarly
path.join(__dirname) //?
path.join(__dirname, 'a') //?
path.join(__dirname, 'a', 'b') //?
