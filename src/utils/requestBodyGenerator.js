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
				item: {
					descriptor: {
						name: body.keyword,
					}
				}
				// item: { descriptor: { name: body.keyword } },
			},
		}
	}
	else if (api === 'bpp_select') {
		requestBody.context.action = 'select'
		requestBody.context.bpp_url = body.bppUri
		requestBody.context.bpp_id = body.bppId
		requestBody.message = {
			order: {
				provider: {
					id: body.providerId
				},
				items: [{ id: body.itemId }]
			},
		}
	}
	else if (api === 'bpp_init') {
		requestBody.context.action = 'init'
		requestBody.message = {
			order: {
				provider: {
					id: body.providerId
				},
				items: [{ id: body.itemId }],
				fulfillments: [{
					customer: {
						person: {
							name: faker.name.fullName(),
							phone: faker.phone.phoneNumber(),
							email: faker.internet.email(),
						}
					}
				}],
				billing: {
					name: faker.name.fullName(),
					phone: faker.phone.phoneNumber(),
					email: faker.internet.email()
				},
			},
		}
	}
	else if (api === 'bpp_confirm') {
		requestBody.context.action = 'confirm'
		requestBody.message = {
			order: {
				provider: {
					id: body.providerId
				},
				items: [{ id: body.itemId }],
				fulfillments: [{
					customer: {
						person: {
							name: faker.name.fullName(),
							phone: faker.phone.phoneNumber(),
							email: faker.internet.email(),
						}
					}
				}],
				billing: {
					name: faker.name.fullName(),
					phone: faker.phone.phoneNumber(),
					email: faker.internet.email()
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
