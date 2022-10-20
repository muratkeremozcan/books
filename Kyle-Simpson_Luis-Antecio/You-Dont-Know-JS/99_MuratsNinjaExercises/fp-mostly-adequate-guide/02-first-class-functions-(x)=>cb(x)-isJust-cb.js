const hi = name => `Hi ${name}`
// same
// const greeting = name => hi(name)
const greeting = hi

// hi // a fn waiting for invocation
hi('Joe') //?
// greeting // a fn waiting for invocation
greeting('Joe') //?

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
