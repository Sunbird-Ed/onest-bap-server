'use strict'
let envVariables = {
	// Environment variables

	NODE_ENV: process.env.NODE_ENV || 'development',
	APPLICATION_PORT: process.env.APPLICATION_PORT || 3004,
	SUBSCRIBER: process.env.SUBSCRIBER || '',
	BECKN_BG_URI:process.env.BECKN_BG_URI || 'https://ps-bap-client.becknprotocol.io',
	BECKN_REGISTRY_URI: process.env.PUBLIC_KEY ||'https://registry.becknprotocol.io/subscribers',
	AUTH_ENABLED:process.env.AUTH_ENABLED || false,
	PRIVATE_KEY: process.env.PRIVATE_KEY || 'iYtpLqvdccG37VhiR/+3DTLt8QDBeiHc2wryWQN6703SO4wv9pOhHElluuTTBSt5SFS26uuMEWIIENdBmVN5dw==',
	SUBSCRIBER_ID: process.env.SUBSCRIBER_ID || 'sunbird-ed-bap',
	UNIQUE_ID: process.env.UNIQUE_ID || 'sunbird-ed-bap',
	PUBLIC_KEY: process.env.PUBLIC_KEY || 'ja1BjCxkfsTSYPMAQUiqt7ChujUKjyWq2qZMUSTeouc=',
	CITY: process.env.CITY || 'std:080',
	COUNTRY: process.env.COUNTRY || 'IND',
	REDIS_HOST: process.env.REDIS_HOST || 'redis://localhost:6379',
	DOMAIN: process.env.DOMAIN || 'onest:learning-experiences',
	BAP_ID: process.env.BAP_ID || 'sunbird-ed-bap',
	BAP_URI: process.env.BAP_URI || 'https://staging.sunbirded.org/onest/bap'
}
module.exports = envVariables
