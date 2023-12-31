'use strict'
const axios = require('axios')
const { createAuthorizationHeader } = require('@utils/auth')
//const https = require('https')
//const httpsAgent = new https.Agent({ rejectUnauthorized: true })

exports.postRequest = async (url, headers, body, { shouldSign }) => {
	if (shouldSign) {
		headers = { ...headers, authorization: await createAuthorizationHeader(body) }
	}
	return new Promise((resolve, reject) => {
		axios({ method: 'post', url, data: body, headers, timeout: 20000 })
			.then((res) => {
				console.log(res.data)
				resolve(res)
			})
			.catch((error) => {
				console.log(error)
				reject(error)
			})
	})
}
