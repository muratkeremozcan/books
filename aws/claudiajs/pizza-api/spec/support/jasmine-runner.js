/* global jasmine */
'use strict'

const Jasmine = require('jasmine')
const SpecReporter = require('jasmine-spec-reporter').SpecReporter
const jrunner = new Jasmine()
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })
let filter

process.argv.slice(2).forEach(option => {
  if (option === 'full') {
    // Remove default reporter logs
    jrunner.configureDefaultReporter({ print() {} })

    // Add jasmine-spec-reporter
    jasmine.getEnv().addReporter(new SpecReporter())
  }

  if (option.match('^filter='))
    filter = option.match('^filter=(.*)')[1]
})

// Load configuration from jasmine.json
jrunner.loadConfigFile()
jrunner.execute(undefined, filter)
