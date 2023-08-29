const fs = require('fs')
const {getEnvironmentConfig} = require('../infrastructure/lib/get-env-config')
const config = require('../config.json')

const {backend_subdomain} = getEnvironmentConfig(process.env.NODE_ENV)
const backendURL = `https://${backend_subdomain}.${config.domain_name}`

// Write to .env file
fs.writeFileSync('.env', `REACT_APP_BACKEND_URL=${backendURL}\n`)

console.log(`Configured for backend URL: ${backendURL}`)
