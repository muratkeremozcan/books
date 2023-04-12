const {_} = require('lodash')
// import _ from 'lodash'

;[100].map(subject => _.add(5, subject)) //?

const validateLocalStorage = localStorage => {
  return _.some(localStorage, (value, key) => {
    return key.includes('ACCESS_TOKEN')
  })
}

localStorage = {
  dev_MERCHANTS_ACCESS_TOKEN: 'value1',
  key2: 'value2',
}

validateLocalStorage(localStorage) //?
