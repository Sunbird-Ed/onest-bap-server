'use strict'
const { createAuthorizationHeader } = require('@utils/auth')
const { getSubscriberDetails } = require('@utils/lookup')
const env = require('./envHelper')

exports.authBuilder = async (req, res, next) => {
	try {
		const authHeader = await createAuthorizationHeader(req.body)
		req.headers.authorization = authHeader
		const senderDetails = await getSubscriberDetails(env.SUBSCRIBER_ID, env.UNIQUE_ID)
		res.locals.sender = senderDetails
	} catch (err) {
		next(err)
	}
}
