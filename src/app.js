'use strict'
require('module-alias/register')
require('dotenv').config()
const env = require('./envHelper')

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()

app.use(bodyParser.urlencoded({ extended: true, limit: '50MB' }))
app.use(bodyParser.json({ limit: '50MB' }))
app.use(cors())
app.use('/bap', require('@routes'))

app.listen(env.APPLICATION_PORT, (res, err) => {
	if (err) onError(err)
	console.log('BAP Environment: ' + env.NODE_ENV)
	console.log('BAP is running on the port:' + env.APPLICATION_PORT)
})

function onError(error) {
	switch (error.code) {
		case 'EACCES':
			console.log(env.APPLICATION_PORT + ' requires elevated privileges')
			process.exit(1)
		// eslint-disable-next-line no-fallthrough
		case 'EADDRINUSE':
			console.log(env.APPLICATION_PORT + ' is already in use')
			process.exit(1)
		// eslint-disable-next-line no-fallthrough
		default:
			throw error
	}
}
