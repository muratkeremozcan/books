import {merge} from 'lodash'

const obj1 = {a: 1, b: 2}
const obj2 = {b: 3, c: 4}

const mergedLodash = merge(obj1, obj2)
mergedLodash //?

const mergedVanilla = {...obj1, ...obj2}
mergedVanilla //?
