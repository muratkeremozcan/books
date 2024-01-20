const hi = (name: string) => `Hi ${name}`

// (x) => cb(x) isJust cb
// these two are the same, try toggling
// const greeting = (name: string) => hi(name)
const greeting = hi

hi('Joe') //?
greeting('Joe') //?

const bye = () => 'Bye'

// () => cb() isJust cb
// these rows are the same, try toggling
// const goodBye = () => bye()
const goodBye = bye

bye() //?
goodBye() //?

// same:
// ajaxCall(json => callback(json));
// ajaxCall(callback);
// same:
// const getServerStuff = callback => ajaxCall(callback);
// const getServerStuff = ajaxCall
// same:
// const getServerStuff = callback => ajaxCall(json => callback(json))
// const getServerStuff = callback => ajaxCall(callback)
// const getServerStuff = ajaxCall
