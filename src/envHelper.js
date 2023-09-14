'use strict'
let envVariables = {
	// Environment variables

	NODE_ENV: process.env.NODE_ENV || 'development',
	APPLICATION_PORT: process.env.APPLICATION_PORT || 3004,
	SUBSCRIBER: process.env.SUBSCRIBER || '',
	BECKN_BG_URI:process.env.BECKN_BG_URI || 'https://ps-bap-client.becknprotocol.io',
	BECKN_REGISTRY_URI: process.env.PUBLIC_KEY ||'https://registry.becknprotocol.io/subscribers',
	AUTH_ENABLED:process.env.AUTH_ENABLED || false,
	PRIVATE_KEY: process.env.PRIVATE_KEY || 'Ui2QZkqnOA6327B7xwohv3KHta8bhWr7yhmraV3urJONrUGMLGR+xNJg8wBBSKq3sKG6NQqPJarapkxRJN6i5w==',
	SUBSCRIBER_ID: process.env.SUBSCRIBER_ID || 'bap12345',
	UNIQUE_ID: process.env.UNIQUE_ID || 'sl23rws98uf09s8u',
	PUBLIC_KEY: process.env.PUBLIC_KEY || 'ja1BjCxkfsTSYPMAQUiqt7ChujUKjyWq2qZMUSTeouc=',
	CITY: process.env.CITY || 'std:080',
	COUNTRY: process.env.COUNTRY || 'IND',
	REDIS_HOST: process.env.REDIS_HOST || 'redis://localhost:6379',
	DOMAIN: process.env.DOMAIN || 'dsep:courses',
	BAP_ID: process.env.BAP_ID || 'ps-bap-network.becknprotocol.io',
	BAP_URI: process.env.BAP_URI || 'https://ps-bap-network.becknprotocol.io/'
}
module.exports = envVariables
