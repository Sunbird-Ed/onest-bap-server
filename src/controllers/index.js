'use strict'
const requester = require('@utils/requester')
const { requestBodyGenerator } = require('@utils/requestBodyGenerator')
const { cacheSave, cacheGet, getKeys, getMessage, sendMessage } = require('@utils/redis')
const { v4: uuidv4 } = require('uuid')
const env = require('../envHelper')
const { send } = require('../telemetry')
const { createAuthorizationHeaderForBPP } = require('../utils/auth')

exports.search = async (req, res) => {
	try {
		const transactionId = uuidv4()
		const messageId = uuidv4()
		console.log("search")
		console.log({transactionId})

		const requestBody = requestBodyGenerator('bg_search', { keyword: req.query.keyword }, transactionId, messageId)
		const rs = await requester.postRequest(
			env.BECKN_BG_URI + '/search',
			{},
			requestBody,
			{ shouldSign: true }
		)
		console.log(`search: `, rs.data)
		send(requestBody.context, requestBody.message, rs.data)
		setTimeout(async () => {
			const data = await cacheGet(`${transactionId}:ON_SEARCH`)
			if (!data) res.status(403).send({ message: 'No search  data Found' })
			else res.status(200).send({ data: data })
		}, 25000)
	} catch (err) {
		console.log('err',err)
		res.status(400).send({ status: false })
	}
}

exports.onSearch = async (req, res) => {
	console.log(`onSearch: `, req.body.context)
	try {
		const transactionId = req.body.context.transaction_id
		const messageId = req.body.context.message_id
		const data = await cacheGet(`${transactionId}:ON_SEARCH`)
		if (data) {
			data.push(req.body)
			await cacheSave(`${transactionId}:ON_SEARCH`, data)
			await cacheSave('LATEST_ON_SEARCH_RESULT', data)
		} else {
			await cacheSave(`${transactionId}:ON_SEARCH`, [req.body])
			await cacheSave('LATEST_ON_SEARCH_RESULT', [req.body])
		}
		res.status(200).json({
			"message": {
				"ack": {
					"status": "ACK"
				}
			}
		})
	} catch (err) {
		
	}
}

exports.select = async (req, res) => {
	try {
		const transactionId = req.body.transaction_id
		const messageId = uuidv4()
		const bppUri = req.body.bpp_uri
		const bppId = req.body.bpp_id
		const itemId = req.body.item_id
		const providerId = req.body.provider_id
		const requestBody = requestBodyGenerator('bpp_select', { itemId, providerId, bppUri, bppId }, transactionId, messageId)
		const endPoint  = bppUri.endsWith("/") ? bppUri : bppUri + "/"
		const rs = await requester.postRequest(
			endPoint + 'select',
			{},
			requestBody,
			{ shouldSign: true }
		)
		send(requestBody.context, requestBody.message, rs.data)
		const message = await getMessage(`${transactionId}:ON_SELECT:MESSAGE`)
		if (message !== transactionId)
			return res.status(400).json({ message: 'Something Went Wrong (Redis Message Issue)' })
		const data = await cacheGet(`${transactionId}:ON_SELECT`)
		if (!data) return res.status(403).send({ message: 'No data Found' })
		else return res.status(200).send({ data: data })
	} catch (err) {
		console.log(err)
		res.status(400).send({ status: false })
	}
}

exports.onSelect = async (req, res) => {
	try {
		const transactionId = req.body.context.transaction_id
		await cacheSave(`${transactionId}:ON_SELECT`, req.body)
		await sendMessage(`${transactionId}:ON_SELECT:MESSAGE`, transactionId)
		res.status(200).json({
			"message": {
				"ack": {
					"status": "ACK"
				}
			}
		})
	} catch (err) {
		console.log(err)
	}
}

exports.init = async (req, res) => {
	try {
		const transactionId = req.body.transaction_id
		const messageId = uuidv4()
		const bppUri = req.body.bpp_uri
		const itemId = req.body.item_id
		const providerId = req.body.provider_id
		const endPoint  = bppUri.endsWith("/") ? bppUri : bppUri + "/"
		await requester.postRequest(
			endPoint + 'init',
			{},
			requestBodyGenerator('bpp_init', { itemId, providerId }, transactionId, messageId),
			{ shouldSign: true }
		)
		const message = await getMessage(`${transactionId}:ON_INIT:MESSAGE`)
		if (message !== transactionId)
			return res.status(400).json({ message: 'Something Went Wrong (Redis Message Issue)' })
		const data = await cacheGet(`${transactionId}:ON_INIT`)
		if (!data) return res.status(403).send({ message: 'No data Found' })
		else return res.status(200).send({ data: data })
	} catch (err) {
		console.log(err)
		res.status(400).send({ status: false })
	}
}

exports.onInit = async (req, res) => {
	console.log(`onInit: `, req.body)
	try {
		const transactionId = req.body.context.transaction_id
		await cacheSave(`${transactionId}:ON_INIT`, req.body)
		await sendMessage(`${transactionId}:ON_INIT:MESSAGE`, transactionId)
		res.status(200).json({
			"message": {
				"ack": {
					"status": "ACK"
				}
			}
		})
	} catch (err) {
		console.log(err)
	}
}

exports.confirm = async (req, res) => {
	try {
		const transactionId = req.body.transaction_id
		const messageId = uuidv4()
		const bppUri = req.body.bpp_uri
		const itemId = req.body.item_id
		const providerId = req.body.provider_id
		const endPoint  = bppUri.endsWith("/") ? bppUri : bppUri + "/"
		await requester.postRequest(
			endPoint + 'confirm',
			{},
			requestBodyGenerator('bpp_confirm', { itemId, providerId }, transactionId, messageId),
			{ shouldSign: true }
		)
		const message = await getMessage(`${transactionId}:ON_CONFIRM:MESSAGE`)
		if (message !== transactionId + messageId)
			return res.status(400).json({ message: 'Something Went Wrong (Redis Message Issue)' })
		const data = await cacheGet(`${transactionId}:ON_CONFIRM`)
		if (!data) return res.status(403).send({ message: 'No data Found' })
		res.status(200).send({ data: data })
	} catch (err) {
		console.log(err)
		res.status(400).send({ status: false })
	}
}

exports.onConfirm = async (req, res) => {
	console.log(`onConfirm: `, req.body)
	try {
		const transactionId = req.body.context.transaction_id
		const messageId = req.body.context.message_id
		await cacheSave(`${transactionId}:ON_CONFIRM`, req.body)
		await sendMessage(`${transactionId}:ON_CONFIRM:MESSAGE`, transactionId + messageId)
		res.status(200).json({
			"message": {
				"ack": {
					"status": "ACK"
				}
			}
		})
	} catch (err) {}
}

exports.cancel = async (req, res) => {
	try {
		const transactionId = req.body.transaction_id
		const messageId = uuidv4()
		const bppUri = req.body.bppUri
		const orderId = req.body.orderId
		const cancellation_reason_id = 1
		const itemId = req.body.itemId
		await requester.postRequest(
			bppUri + '/cancel',
			{},
			requestBodyGenerator('bpp_cancel', { orderId, cancellation_reason_id }, transactionId, messageId),
			{ shouldSign: true }
		)
		const message = await getMessage(`${transactionId}:${messageId}`)
		if (message !== transactionId + messageId)
			return res.status(400).json({ message: 'Something Went Wrong (Redis Message Issue)' })
		const data = await cacheGet(`${transactionId}:${messageId}:ON_CANCEL`)
		if (!data) return res.status(403).send({ message: 'No data Found' })
		res.status(200).send({ data: data })
		await cacheSave(`${bppUri}:${itemId}:ENROLLED`, false)
	} catch (err) {
		console.log(err)
		res.status(400).send({ status: false })
	}
}

exports.onCancel = async (req, res) => {
	try {
		const transactionId = req.body.context.transaction_id
		const messageId = req.body.context.message_id
		await cacheSave(`${transactionId}:${messageId}:ON_CANCEL`, req.body)
		await sendMessage(`${transactionId}:${messageId}`, transactionId + messageId)
		res.status(200).json({ status: true, message: 'BAP Received CANCELLATION From BPP' })
	} catch (err) {}
}

exports.status = async (req, res) => {
	try {
		const transactionId = req.body.transaction_id
		const messageId = uuidv4()
		const bppUri = req.body.bppUri
		const orderId = req.body.orderId
		await requester.postRequest(
			bppUri + '/status',
			{},
			requestBodyGenerator('bpp_status', { orderId }, transactionId, messageId),
			{ shouldSign: true }
		)
		const message = await getMessage(`${transactionId}:${messageId}`)
		if (message !== transactionId + messageId)
			return res.status(400).json({ message: 'Something Went Wrong (Redis Message Issue)' })
		const data = await cacheGet(`${transactionId}:${messageId}:ON_STATUS`)
		if (!data) return res.status(403).send({ message: 'No data Found' })
		res.status(200).send({ data: data })
	} catch (err) {
		console.log(err)
		res.status(400).send({ status: false })
	}
}

exports.onStatus = async (req, res) => {
	try {
		const transactionId = req.body.context.transaction_id
		const messageId = req.body.context.message_id
		await cacheSave(`${transactionId}:${messageId}:ON_STATUS`, req.body)
		await sendMessage(`${transactionId}:${messageId}`, transactionId + messageId)
		res.status(200).json({ status: true, message: 'BAP Received STATUS From BPP' })
	} catch (err) {}
}

exports.userEnrollmentStatus = async (req, res) => {
	try {
		const bppUri = req.body.bppUri
		const itemId = req.body.itemId
		res.status(200).send({ isEnrolled: (await cacheGet(`${bppUri}:${itemId}:ENROLLED`)) ? true : false })
	} catch (err) {}
}

exports.enrolledSessions = async (req, res) => {
	try {
		const enrollmentStatues = await getKeys('*:*:ENROLLED')
		let collector = {}
		await Promise.all(
			enrollmentStatues.map(async (key) => {
				const parts = key.split(':')
				let itemId
				let bppUri
				if (parts.length === 5) {
					bppUri = [parts[0], parts[1], parts[2]].join(':')
					itemId = parts[3]
				} else {
					bppUri = [parts[0], parts[1]].join(':')
					itemId = parts[2]
				}
				const session = await cacheGet(key)
				if (session) {
					//Probably Not Thread Safe
					if (!collector[bppUri]) collector[bppUri] = [session]
					else collector[bppUri].push(session)
				}
			})
		)
		res.status(200).send(collector)
	} catch (err) {
	}
}

exports.signHeader =  async (req, res) => { 
	const message = req.body;
	const header = await createAuthorizationHeaderForBPP(JSON.stringify(message))

	res.status(200).send({header})
}