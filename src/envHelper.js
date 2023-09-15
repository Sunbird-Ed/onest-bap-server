'use strict'
let envVariables = {
	// Environment variables

	NODE_ENV: process.env.NODE_ENV || 'development',
	APPLICATION_PORT: 3004,
	SUBSCRIBER: process.env.SUBSCRIBER || '',
	BECKN_BG_URI: 'https://gateway.becknprotocol.io/bg',
	BECKN_REGISTRY_URI: 'https://registry.becknprotocol.io/subscribers',
	AUTH_ENABLED: 'false',
	PRIVATE_KEY:  'iYtpLqvdccG37VhiR/+3DTLt8QDBeiHc2wryWQN6703SO4wv9pOhHElluuTTBSt5SFS26uuMEWIIENdBmVN5dw==',
	SUBSCRIBER_ID:  'sunbird-ed-bap',
	UNIQUE_ID:  'sunbird-ed-bap',
	PUBLIC_KEY:  'ja1BjCxkfsTSYPMAQUiqt7ChujUKjyWq2qZMUSTeouc=',
	CITY:  'std:080',
	COUNTRY:  'IND',
	REDIS_HOST:  'redis://localhost:6379',
	DOMAIN: 'onest:learning-experiences',
	BAP_ID: 'sunbird-ed-bap',
	BAP_URI: 'https://staging.sunbirded.org/onest/bap'
}
module.exports = envVariables
