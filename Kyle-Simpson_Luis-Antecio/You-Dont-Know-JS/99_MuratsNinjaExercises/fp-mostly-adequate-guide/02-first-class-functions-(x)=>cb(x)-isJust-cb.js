const hi = name => `Hi ${name}`
// same
// const greeting = name => hi(name)
const greeting = hi // try toggling

hi('Joe') //?
greeting('Joe') //?

const bye = () => 'Bye'
// same
// const goodBye = () => bye()
const goodBye = bye // try toggling

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
