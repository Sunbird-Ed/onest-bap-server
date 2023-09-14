'use strict'
const { v4: uuidv4 } = require('uuid')
const { faker } = require('@faker-js/faker')
const env = require('../envHelper')

const requestBody = {
	context: {
		domain: env.DOMAIN,
		location: {
			country: {
				name: env.COUNTRY,
				code: env.COUNTRY
			},
			city: {
				name: env.CITY,
				code: env.CITY
			}
		},
		// country: env.COUNTRY,
		// city: env.CITY,
		action: 'search',
		bap_id: env.BAP_ID,
		bap_uri: env.BAP_URI,
		timestamp: new Date().toISOString(),
		message_id: uuidv4(),
		version: '1.1.0',
		ttl: 'PT1S',
	},
	message: {},
}

exports.requestBodyGenerator = (api, body, transactionId, messageId) => {
	requestBody.context.transaction_id = transactionId
	requestBody.context.message_id = messageId
	if (api === 'bg_search') {
		requestBody.context.action = 'search'
		requestBody.message = {
			intent: {
				descriptor: {
					name: body.keyword,
				}
				// item: { descriptor: { name: body.keyword } },
			},
		}
	} else if (api === 'bpp_init') {
		requestBody.context.action = 'init'
		requestBody.message = {
			order: {
				id: uuidv4(),
				items: [{ id: body.itemId }],
				fulfillments: [{ id: body.fulfillmentId }],
				billing: {
					name: faker.name.fullName(),
					phone: faker.phone.phoneNumber(),
					email: faker.internet.email(),
					time: {
						timezone: 'IST',
					},
				},
			},
		}
	} else if (api === 'bpp_cancel') {
		requestBody.context.action = 'cancel'
		requestBody.message = {
			order: {
				id: body.orderId,
			},
			cancellation_reason_id: 1,
			descriptor: {
				name: 'Because this course is too lengthy',
			},
		}
	} else if (api === 'bpp_status') {
		requestBody.context.action = 'status'
		requestBody.message = {
			order: {
				id: body.orderId,
			},
		}
	}
	return requestBody
}
