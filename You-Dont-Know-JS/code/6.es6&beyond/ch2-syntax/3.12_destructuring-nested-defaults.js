// setting defaults for a nested object’s properties: using object destructuring along with 'restructuring'

var defaults = {
  options: {
    remove: true,
    enable: false,
    instance: {}
  },
  log: {
    warn: true,
    error: true
  }
}

// let’s say you have an object called config, which has some of these applied, 
// and you’d like to set all the defaults into this object in the missing spots, 
// but not override specific settings already present
var config = {
  options: {
    remove: false,
    instance: null
  }
}

{
// TL, DR; this is better than manual way pre-ES6 but lodash is way better
// deep cloning: https://lodash.com/docs/4.17.15#cloneDeep
config.options = config.options || {}; 
config.log = config.log || {};
{
  let {
    options: {
      remove = defaults.options.remove,
      enable = defaults.options.enable,
      instance = defaults.options.instance
    } = {},
    log: {
      warn = defaults.log.warn,
      error = defaults.log.error
    } = {}
  } = config;
  // restructure
  config = {
    options: { remove, enable, instance },
    log: { warn, error }
  };
}


// (1: alternative) manually doing this in pre-ES6 was be terrible
// config.options = config.options || {}; 
// config.options.remove = (config.options.remove !== undefined) ? config.options.remove : defaults.options.remove; 
// config.options.enable = (config.options.enable !== undefined) ? config.options.enable : defaults.options.enable;
// config.options.instance = (config.options.instance !== undefined) ? config.options.instance : defaults.options.instance;
// ...

// (2: alternative) manually this would be
// Object.assign would not be that great because it is a shallow copy (1 level) and enable property gets eaten
  // you would need a JS library that does deep cloning: https://lodash.com/docs/4.17.15#cloneDeep
// config = Object.assign( {}, defaults, config );
// config; //?

