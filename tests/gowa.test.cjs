const assert = require('node:assert/strict');
const { test } = require('node:test');
const { NodeHelpers } = require('n8n-workflow');
const { Gowa } = require('../dist/nodes/GOWA/Gowa.node.js');

const node = new Gowa();
const workflowNode = { name: 'GOWA', typeVersion: 1 };
const host = 'http://localhost:3000/prefix';
const phone = '628123456789';
const chatJid = '12345@g.us';
const newsletterId = '12345@newsletter';
const scheduleId = 'd806cf6e-1ec8-4f8a-a461-e30eb3f68ef6';

function visibleProperty(name, parameters) {
	return node.description.properties.find((property) =>
		property.name === name &&
		NodeHelpers.displayParameter(parameters, property, workflowNode, node.description),
	);
}

function execution(parameters, requestWithAuthentication) {
	return node.execute.call({
		getInputData: () => parameters.map(() => ({ json: {} })),
		getNode: () => workflowNode,
		getNodeParameter: (name, itemIndex, fallback) => {
			const values = parameters[itemIndex];
			const property = visibleProperty(name, values);
			if (property && Object.hasOwn(values, name)) return values[name];
			if (fallback !== undefined) return fallback;
			assert.ok(property, `Parameter ${name} must be visible for ${values.operation}`);
			return property.default;
		},
		getCredentials: async () => ({ hostUrl: host + '/', deviceId: 'credential-device' }),
		continueOnFail: () => false,
		helpers: { requestWithAuthentication },
	});
}

async function checkRequest(resource, operation, params, method, path, expected = {}) {
	const parameters = { resource, operation, ...params };
	const operationField = visibleProperty('operation', parameters);
	assert.ok(operationField.options.some(({ value }) => value === operation));

	const response = { code: 'SUCCESS', results: { operation } };
	let requests = 0;
	const output = await execution([parameters], async (credential, request) => {
		requests++;
		assert.equal(credential, 'goWhatsappApi');
		assert.equal(request.method, method);
		assert.equal(request.url, host + path);
		assert.equal(request.json, true);
		assert.deepEqual(request.headers, { 'X-Device-Id': params.deviceIdOverride || 'credential-device' });
		if (Object.hasOwn(expected, 'body')) assert.deepEqual(request.body, expected.body);
		if (Object.hasOwn(expected, 'qs')) assert.deepEqual(request.qs, expected.qs);
		return response;
	});
	assert.equal(requests, 1);
	assert.deepEqual(output, [[{ json: response }]]);
}

test('existing user workflows select the device separately for each input item', async () => {
	const operation = { resource: 'user', operation: 'getMyContacts' };
	const requests = [];
	await execution([operation, { ...operation, deviceIdOverride: 'item-device' }], async (_credential, request) => {
		requests.push(request);
		return { code: 'SUCCESS' };
	});
	assert.deepEqual(requests.map(({ method, url, headers }) => [method, url, headers['X-Device-Id']]), [
		['GET', host + '/user/my/contacts', 'credential-device'],
		['GET', host + '/user/my/contacts', 'item-device'],
	]);
});

test('contacts, presence and incoming calls use the selected device', async () => {
	await checkRequest('user', 'getMyDetailedContacts', { deviceIdOverride: 'contacts-device' },
		'GET', '/user/my/contacts/detailed');
	await checkRequest('user', 'subscribePresence', { presencePhone: phone },
		'POST', '/user/presence/subscribe', { body: { phone } });
	const callerJid = phone + '@s.whatsapp.net';
	await checkRequest('call', 'rejectCall', { callerJid, callId: 'CALL1', deviceIdOverride: 'call-device' },
		'POST', '/call/reject', { body: { caller_jid: callerJid, call_id: 'CALL1' } });
});

test('chat operations encode the JID and keep the archive filter optional', async () => {
	await checkRequest('chat', 'archiveChat', { chatJid, archiveChatState: false },
		'POST', '/chat/12345%40g.us/archive', { body: { archived: false } });
	await checkRequest('chat', 'requestChatHistory', { chatJid, historyCount: 60 },
		'POST', '/chat/12345%40g.us/history', { body: { count: 60 } });
	const query = { limit: 50, offset: 0, search: '', has_media: false };
	await checkRequest('chat', 'listChats', {}, 'GET', '/chats', { qs: query });
	await checkRequest('chat', 'listChats', { archiveFilter: 'false' },
		'GET', '/chats', { qs: { ...query, archived: 'false' } });
});

test('message actions send the appropriate forward, receipt and edit payloads', async () => {
	const message = { phoneOrGroupId: phone, messageId: 'MSG1' };
	await checkRequest('message', 'forwardMessage', { ...message, forceReupload: true },
		'POST', '/message/MSG1/forward', { body: { phone, force_reupload: true } });
	await checkRequest('message', 'markAsPlayed', message,
		'POST', '/message/MSG1/played', { body: { phone } });

	const edit = { ...message, newMessage: 'new' };
	await checkRequest('message', 'updateMessage', edit,
		'POST', '/message/MSG1/update', { body: { phone, message: 'new' } });
	await checkRequest('message', 'updateMessage', { ...edit, editMediaType: 'document' },
		'POST', '/message/MSG1/update', { body: { phone, message: 'new', media_type: 'document' } });
	await checkRequest('message', 'updateMessage', { ...edit, editMediaType: '', editLink: 'https://example.com' },
		'POST', '/message/MSG1/update', { body: { phone, message: 'new', link: 'https://example.com' } });
});

test('newsletter lookups, messages, media and subscriptions use their API contracts', async () => {
	const channel = { newsletter_id: newsletterId };
	await checkRequest('newsletter', 'followNewsletter', { newsletterId }, 'POST', '/newsletter/follow', { body: channel });
	await checkRequest('newsletter', 'unfollowNewsletter', { newsletterId }, 'POST', '/newsletter/unfollow', { body: channel });
	await checkRequest('newsletter', 'getNewsletterInfo', { newsletterLookupBy: 'invite', newsletterIdentifier: 'INVITE' },
		'GET', '/newsletter/info', { qs: { invite: 'INVITE' } });
	await checkRequest('newsletter', 'getNewsletterInfo', { newsletterIdentifier: newsletterId },
		'GET', '/newsletter/info', { qs: channel });
	await checkRequest('newsletter', 'getNewsletterMessages', { newsletterId, newsletterBefore: 7 },
		'GET', '/newsletter/messages', { qs: { ...channel, count: 50, before: 7 } });
	await checkRequest('newsletter', 'getNewsletterMessageUpdates', { newsletterId, newsletterAfter: 9 },
		'GET', '/newsletter/message-updates', { qs: { ...channel, count: 50, after: 9 } });
	await checkRequest('newsletter', 'downloadNewsletterMedia', { newsletterId, newsletterServerId: 8 },
		'GET', '/newsletter/messages/8/download', { qs: channel });
	await checkRequest('newsletter', 'searchNewsletterDirectory', { newsletterSearch: 'news', newsletterCursor: 'next' },
		'GET', '/newsletter/directory', { qs: { search_text: 'news', limit: 20, cursor: 'next' } });
	await checkRequest('newsletter', 'listNewsletterLiveUpdates', {}, 'GET', '/newsletter/live-updates', { body: undefined });
	await checkRequest('newsletter', 'subscribeNewsletterLiveUpdates', { newsletterId },
		'POST', '/newsletter/live-updates', { body: channel });
	await checkRequest('newsletter', 'unsubscribeNewsletterLiveUpdates', { newsletterId },
		'DELETE', '/newsletter/live-updates', { qs: channel, body: undefined });
});

test('text sends keep their default payload and add optional settings only when used', async () => {
	const text = { phoneNumber: phone, message: 'hi' };
	await checkRequest('send', 'sendText', text, 'POST', '/send/message', { body: { phone, message: 'hi' } });
	await checkRequest('send', 'sendText', { ...text, mentions: ' 1234, @everyone , ' },
		'POST', '/send/message', { body: { phone, message: 'hi', mentions: ['1234', '@everyone'] } });
	await checkRequest('send', 'sendText', { ...text, phoneNumber: 'status@broadcast', allowStatusReshare: true },
		'POST', '/send/message', { body: { phone: 'status@broadcast', message: 'hi', allow_reshare: true } });
	const scheduledAt = '2027-01-01T09:00:00+07:00';
	await checkRequest('send', 'sendText', { ...text, replyMessageId: 'MSG1', scheduledAt, scheduleTimezone: 'Asia/Jakarta' },
		'POST', '/send/message', {
			body: { phone, message: 'hi', reply_message_id: 'MSG1', scheduled_at: scheduledAt, timezone: 'Asia/Jakarta' },
		});
});

test('schedule management calls the matching route without requiring a recipient', async () => {
	await checkRequest('send', 'listScheduledSends', {}, 'GET', '/send/schedules',
		{ qs: { status: '', search: '', limit: 25, offset: 0 }, body: undefined });
	for (const [operation, method, suffix] of [
		['getScheduledSend', 'GET', ''],
		['pauseScheduledSend', 'POST', '/pause'],
		['resumeScheduledSend', 'POST', '/resume'],
		['cancelScheduledSend', 'POST', '/cancel'],
	]) {
		await checkRequest('send', operation, { scheduleId }, method, `/send/schedules/${scheduleId}${suffix}`,
			{ body: undefined });
	}
});

const interactive = { phoneNumber: phone, interactiveBody: 'Choose an option' };

test('interactive sends accept buttons, single-select lists and carousel cards', async () => {
	const buttons = [{ name: 'quick_reply', params: { display_text: 'Yes', id: 'yes' } }];
	const listButtons = [{
		name: 'single_select',
		params: { title: 'Choose', sections: [{ title: 'Options', rows: [{ id: 'a', title: 'A' }] }] },
	}];
	const cards = [{ body: 'One', buttons }, { body: 'Two', buttons }];

	for (const items of [buttons, listButtons]) {
		await checkRequest('send', 'sendInteractive', { ...interactive, interactiveItems: JSON.stringify(items) },
			'POST', '/send/interactive', { body: { phone, body: interactive.interactiveBody, buttons: items } });
	}
	await checkRequest('send', 'sendInteractive', {
		...interactive, interactiveItems: cards, interactiveLayout: 'cards', interactiveFooter: 'Choose one',
	}, 'POST', '/send/interactive', {
		body: { phone, body: interactive.interactiveBody, cards, footer: 'Choose one' },
	});
});

test('interactive sends hide unsupported reply and forwarding fields', () => {
	const parameters = { resource: 'send', operation: 'sendInteractive' };
	assert.equal(visibleProperty('replyMessageId', parameters), undefined);
	assert.equal(visibleProperty('isForwarded', parameters), undefined);
});

test('invalid interactive items fail before calling GOWA', async () => {
	for (const [interactiveItems, error] of [['{', /valid JSON/], ['{}', /non-empty array/], [[], /non-empty array/]]) {
		await assert.rejects(
			execution([{ ...interactive, resource: 'send', operation: 'sendInteractive', interactiveItems }], () => {
				assert.fail('GOWA must not receive an invalid interactive payload');
			}),
			error,
		);
	}
});
