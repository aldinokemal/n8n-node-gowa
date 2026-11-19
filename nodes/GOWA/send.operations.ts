import {
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeProperties,
	NodeOperationError,
} from 'n8n-workflow';
import { OperationExecutor, RequestOptions } from './types';
import { operationOptions, operationProperties } from './properties';
import { getDeviceIdHeader } from './app.operations';

export const sendOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['send'],
			},
		},
		options: operationOptions({
			cancelScheduledSend: [
				'Cancel Scheduled Send',
				'Cancel a scheduled send',
				'Cancel a scheduled message',
			],
			getScheduledSend: ['Get Scheduled Send', 'Get a scheduled send', 'Get details of a scheduled message'],
			listScheduledSends: [
				'List Scheduled Sends',
				'List scheduled sends',
				'List scheduled messages for the selected device',
			],
			pauseScheduledSend: ['Pause Scheduled Send', 'Pause a scheduled send', 'Pause a scheduled message'],
			resumeScheduledSend: [
				'Resume Scheduled Send',
				'Resume a scheduled send',
				'Resume a paused scheduled message',
			],
			sendChatPresence: [
				'Send Chat Presence',
				'Send chat presence typing indicator',
				'Send typing indicator to start or stop showing that you are composing a message',
			],
			sendContact: ['Send Contact', 'Send a contact'],
			sendInteractive: [
				'Send Interactive Message',
				'Send an interactive message',
				'Send experimental WhatsApp buttons, lists, or carousel cards',
			],
			sendLink: ['Send Link', 'Send a link'],
			sendLocation: ['Send Location', 'Send a location'],
			sendMedia: ['Send Media', 'Send media files', 'Send media files (image, audio, video, or any file)'],
			sendPoll: ['Send Poll', 'Send a poll', 'Send a poll with multiple options'],
			sendPresence: ['Send Presence', 'Send presence status'],
			sendSticker: [
				'Send Sticker',
				'Send a sticker',
				'Send sticker with automatic conversion to WebP format',
			],
			sendText: ['Send Text', 'Send a text message'],
		}),
		default: 'sendText',
	},
];

export const sendProperties: INodeProperties[] = [
	...operationProperties('send', [
		'sendText',
		'sendContact',
		'sendLink',
		'sendLocation',
		'sendChatPresence',
		'sendPoll',
		'sendMedia',
		'sendSticker',
		'sendInteractive',
	], {
		phoneNumber: {
			displayName: 'Phone or Group ID',
			type: 'string',
			required: true,
			default: '',
			placeholder: '628123456789',
			description: 'Phone number with country code or Group ID',
		},
	}),
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendText'],
			},
		},
		default: '',
		description: 'Text message to send',
	},
	{
		displayName: 'Link',
		name: 'link',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendLink'],
			},
		},
		default: '',
		placeholder: 'https://example.com',
		description: 'URL link to send',
	},
	{
		displayName: 'Presence Type',
		name: 'presenceType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendPresence'],
			},
		},
		options: [
			{
				name: 'Available',
				value: 'available',
			},
			{
				name: 'Unavailable',
				value: 'unavailable',
			},
		],
		default: 'available',
		description: 'Presence status to send',
	},
	{
		displayName: 'Chat Presence Action',
		name: 'chatPresenceAction',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendChatPresence'],
			},
		},
		options: [
			{
				name: 'Start Typing',
				value: 'start',
				description: 'Start showing typing indicator',
			},
			{
				name: 'Stop Typing',
				value: 'stop',
				description: 'Stop showing typing indicator',
			},
		],
		default: 'start',
	},
	{
		displayName: 'Media Type',
		name: 'mediaType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendMedia'],
			},
		},
		options: [
			{
				name: 'Image',
				value: 'image',
				description: 'Send an image file',
			},
			{
				name: 'Audio',
				value: 'audio',
				description: 'Send an audio file',
			},
			{
				name: 'Video',
				value: 'video',
				description: 'Send a video file',
			},
			{
				name: 'File',
				value: 'file',
				description: 'Send any file',
			},
		],
		default: 'image',
		description: 'Type of media to send',
	},
	{
		displayName: 'Media Source',
		name: 'mediaSource',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendMedia'],
				mediaType: ['image', 'audio', 'video'],
			},
		},
		options: [
			{
				name: 'File Upload',
				value: 'file',
				description: 'Upload file from binary data',
			},
			{
				name: 'URL',
				value: 'url',
				description: 'Send from URL',
			},
		],
		default: 'file',
		description: 'Choose whether to upload a file or use a URL',
	},
	{
		displayName: 'Media Source',
		name: 'mediaSource',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendMedia'],
				mediaType: ['file'],
			},
		},
		options: [
			{
				name: 'File Upload',
				value: 'file',
				description: 'Upload file from binary data',
			},
		],
		default: 'file',
		description: 'Files can only be uploaded, not sent via URL',
	},
	{
		displayName: 'Binary Property',
		name: 'binaryProperty',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendMedia'],
				mediaSource: ['file'],
			},
		},
		default: 'data',
		description: 'Name of the binary property containing the file to upload',
	},
	{
		displayName: 'Media URL',
		name: 'mediaUrl',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendMedia'],
				mediaSource: ['url'],
				mediaType: ['image', 'audio', 'video'],
			},
		},
		default: '',
		placeholder: 'https://example.com/media.jpg',
		description: 'URL of the media to send',
	},

	{
		displayName: 'Caption',
		name: 'caption',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendMedia', 'sendLink'],
			},
		},
		default: '',
		description: 'Caption for the media or link',
	},
	{
		displayName: 'Contact Name',
		name: 'contactName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendContact'],
			},
		},
		default: '',
		description: 'Name of the contact to send',
	},
	{
		displayName: 'Contact Phone',
		name: 'contactPhone',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendContact'],
			},
		},
		default: '',
		description: 'Phone number of the contact to send',
	},
	{
		displayName: 'Latitude',
		name: 'latitude',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendLocation'],
			},
		},
		default: '',
		placeholder: '-7.797068',
		description: 'Latitude coordinate',
	},
	{
		displayName: 'Longitude',
		name: 'longitude',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendLocation'],
			},
		},
		default: '',
		placeholder: '110.370529',
		description: 'Longitude coordinate',
	},
	{
		displayName: 'Reply to Message ID',
		name: 'replyMessageId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendText', 'sendContact', 'sendLink', 'sendLocation', 'sendMedia'],
			},
		},
		default: '',
		description: 'Message ID to reply to',
	},
	{
		displayName: 'Is Forwarded',
		name: 'isForwarded',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['send'],
			},
		},
		default: false,
		description: 'Whether this is a forwarded message',
	},
	{
		displayName: 'View Once',
		name: 'viewOnce',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendMedia'],
				mediaType: ['image', 'video'],
			},
		},
		default: false,
		description: 'Whether the media should be viewed only once',
	},
	{
		displayName: 'Compress',
		name: 'compress',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendMedia'],
				mediaType: ['image', 'video'],
			},
		},
		default: false,
		description: 'Whether to compress the media',
	},
	{
		displayName: 'Question',
		name: 'question',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendPoll'],
			},
		},
		default: '',
		description: 'The question for the poll',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendPoll'],
			},
		},
		default: '',
		placeholder: 'Option 1,Option 2,Option 3',
		description: 'Comma-separated list of poll options',
	},
	{
		displayName: 'Max Answers',
		name: 'maxAnswer',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendPoll'],
			},
		},
		default: 1,
		description: 'The maximum number of answers allowed for the poll',
	},

	// Properties for Send Sticker
	{
		displayName: 'Sticker Source',
		name: 'stickerSource',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendSticker'],
			},
		},
		options: [
			{
				name: 'File Upload',
				value: 'file',
				description: 'Upload sticker from binary data',
			},
			{
				name: 'URL',
				value: 'url',
				description: 'Send sticker from URL',
			},
		],
		default: 'file',
		description: 'Choose whether to upload a file or use a URL',
	},
	{
		displayName: 'Binary Property',
		name: 'stickerBinaryProperty',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendSticker'],
				stickerSource: ['file'],
			},
		},
		default: 'data',
		description: 'Name of the binary property containing the sticker file',
	},
	{
		displayName: 'Sticker URL',
		name: 'stickerUrl',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendSticker'],
				stickerSource: ['url'],
			},
		},
		default: '',
		placeholder: 'https://example.com/sticker.png',
		description: 'URL of the sticker image (jpg/jpeg/png/webp/gif)',
	},
	{
		displayName: 'Duration',
		name: 'stickerDuration',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendSticker'],
			},
		},
		default: 0,
		description: 'Disappearing message duration in seconds (0 = no expiry)',
	},
	{
		displayName: 'Duration (Seconds)',
		name: 'duration',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendText', 'sendContact', 'sendLink', 'sendLocation', 'sendMedia', 'sendPoll'],
			},
		},
		default: 0,
		description: 'Disappearing message duration in seconds (0 = no expiry)',
	},
	...operationProperties('send', ['sendText'], {
		mentions: {
			displayName: 'Mentions',
			type: 'string',
			default: '',
			description: 'Comma-separated phone numbers or JIDs to mention. Use @everyone to mention all group participants.',
		},
		allowStatusReshare: {
			displayName: 'Allow Status Reshare',
			type: 'boolean',
			default: false,
			description: 'Whether viewers can reshare a message sent to status@broadcast',
		},
		scheduledAt: {
			displayName: 'Scheduled At',
			type: 'string',
			default: '',
			description: 'RFC3339 time with a timezone offset. Leave blank to send immediately.',
		},
		scheduleTimezone: {
			displayName: 'Schedule Timezone',
			type: 'string',
			default: 'UTC',
			description: 'IANA timezone for a scheduled message, such as Asia/Jakarta. Required when Scheduled At is set.',
		},
	}),
	...operationProperties('send', [
		'cancelScheduledSend',
		'getScheduledSend',
		'pauseScheduledSend',
		'resumeScheduledSend',
	], {
		scheduleId: {
			displayName: 'Schedule ID',
			type: 'string',
			required: true,
			default: '',
			description: 'ID returned when the message was scheduled',
		},
	}),
	...operationProperties('send', ['listScheduledSends'], {
		scheduleStatus: {
			displayName: 'Schedule Status',
			type: 'options',
			options: [
				{ name: 'Active', value: 'active' },
				{ name: 'All Statuses', value: '' },
				{ name: 'Cancelled', value: 'cancelled' },
				{ name: 'Completed', value: 'completed' },
				{ name: 'Failed', value: 'failed' },
				{ name: 'Paused', value: 'paused' },
				{ name: 'Running', value: 'running' },
			],
			default: '',
			description: 'Filter schedules by status',
		},
		scheduleSearch: {
			displayName: 'Search',
			type: 'string',
			default: '',
			description: 'Search scheduled messages by recipient or summary',
		},
		schedulePageSize: {
			displayName: 'Page Size',
			type: 'number',
			typeOptions: { minValue: 1, maxValue: 100, numberPrecision: 0 },
			default: 25,
			description: 'Maximum number of schedules to return',
		},
		scheduleOffset: {
			displayName: 'Offset',
			type: 'number',
			typeOptions: { minValue: 0, numberPrecision: 0 },
			default: 0,
			description: 'Number of schedules to skip for pagination',
		},
	}),
	...operationProperties('send', ['sendInteractive'], {
		interactiveBody: {
			displayName: 'Body Text',
			type: 'string',
			required: true,
			default: '',
			description: 'Main text shown above the interactive content',
		},
		interactiveFooter: {
			displayName: 'Footer Text',
			type: 'string',
			default: '',
			description: 'Optional text shown in the message footer',
		},
		interactiveLayout: {
			displayName: 'Layout',
			type: 'options',
			options: [
				{ name: 'Buttons', value: 'buttons' },
				{ name: 'Carousel Cards', value: 'cards' },
			],
			default: 'buttons',
			description: 'Choose buttons or carousel cards',
		},
		interactiveItems: {
			displayName: 'Items',
			type: 'json',
			required: true,
			default: '[]',
			description: 'JSON array of button or card objects in the format defined by the GOWA InteractiveSendRequest schema',
		},
	}),
];

async function handleFileUpload(this: IExecuteFunctions, endpoint: string, fileParam: string, apiFieldName: string, itemIndex: number): Promise<any> {
	const phoneNumber = this.getNodeParameter('phoneNumber', itemIndex) as string;
	const binaryPropertyName = this.getNodeParameter(fileParam, itemIndex) as string;

	const binaryData = this.helpers.assertBinaryData(itemIndex, binaryPropertyName);
	const fileBuffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);

	const credentials = await this.getCredentials('goWhatsappApi');
	const baseUrl = credentials.hostUrl as string || 'http://localhost:3000';
	const fullUrl = `${baseUrl.replace(/\/$/, '')}${endpoint}`;
	const deviceIdHeader = getDeviceIdHeader(this, itemIndex, credentials);

	const formData: any = {
		phone: phoneNumber,
		[apiFieldName]: {
			value: fileBuffer,
			options: {
				filename: binaryData.fileName || 'file',
				contentType: binaryData.mimeType,
			},
		},
	};

	const caption = this.getNodeParameter('caption', itemIndex, '') as string;
	if (caption) {
		formData.caption = caption;
	}

	const replyMessageId = this.getNodeParameter('replyMessageId', itemIndex, '') as string;
	if (replyMessageId) {
		formData.reply_message_id = replyMessageId;
	}

	const isForwarded = this.getNodeParameter('isForwarded', itemIndex, false) as boolean;
	if (isForwarded) {
		formData.is_forwarded = 'true';
	}

	const duration = this.getNodeParameter('duration', itemIndex, 0) as number;
	if (duration > 0) {
		formData.duration = duration.toString();
	}

	if (apiFieldName === 'image' || apiFieldName === 'video') {
		const viewOnce = this.getNodeParameter('viewOnce', itemIndex, false) as boolean;
		if (viewOnce) {
			formData.view_once = 'true';
		}

		const compress = this.getNodeParameter('compress', itemIndex, false) as boolean;
		if (compress) {
			formData.compress = 'true';
		}
	}

	const response = await this.helpers.requestWithAuthentication.call(this, 'goWhatsappApi', {
		method: 'POST' as IHttpRequestMethods,
		url: fullUrl,
		headers: deviceIdHeader,
		formData,
	});
	return JSON.parse(response);
}

async function handleStickerUpload(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<any> {
	const phoneNumber = this.getNodeParameter('phoneNumber', itemIndex) as string;
	const binaryPropertyName = this.getNodeParameter('stickerBinaryProperty', itemIndex) as string;

	const binaryData = this.helpers.assertBinaryData(itemIndex, binaryPropertyName);
	const fileBuffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);

	const credentials = await this.getCredentials('goWhatsappApi');
	const baseUrl = credentials.hostUrl as string || 'http://localhost:3000';
	const fullUrl = `${baseUrl.replace(/\/$/, '')}/send/sticker`;
	const deviceIdHeader = getDeviceIdHeader(this, itemIndex, credentials);

	const formData: any = {
		phone: phoneNumber,
		sticker: {
			value: fileBuffer,
			options: {
				filename: binaryData.fileName || 'sticker',
				contentType: binaryData.mimeType,
			},
		},
	};

	const duration = this.getNodeParameter('stickerDuration', itemIndex, 0) as number;
	if (duration > 0) {
		formData.duration = duration.toString();
	}

	const isForwarded = this.getNodeParameter('isForwarded', itemIndex, false) as boolean;
	if (isForwarded) {
		formData.is_forwarded = 'true';
	}

	const response = await this.helpers.requestWithAuthentication.call(this, 'goWhatsappApi', {
		method: 'POST' as IHttpRequestMethods,
		url: fullUrl,
		headers: deviceIdHeader,
		formData,
	});
	return JSON.parse(response);
}

export const executeSendOperation: OperationExecutor = async function (
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<any> {
	const credentials = await this.getCredentials('goWhatsappApi');
	const baseUrl = credentials.hostUrl as string || 'http://localhost:3000';
	const deviceIdHeader = getDeviceIdHeader(this, itemIndex, credentials);

	const requestOptions: RequestOptions = {
		method: 'POST' as IHttpRequestMethods,
		url: '',
		body: {} as any,
	};

	// Schedule operations do not have a recipient field.
	switch (operation) {
		case 'listScheduledSends':
			return this.helpers.requestWithAuthentication.call(this, 'goWhatsappApi', {
				method: 'GET',
				url: `${baseUrl.replace(/\/$/, '')}/send/schedules`,
				headers: deviceIdHeader,
				qs: {
					status: this.getNodeParameter('scheduleStatus', itemIndex, ''),
					search: this.getNodeParameter('scheduleSearch', itemIndex, ''),
					limit: this.getNodeParameter('schedulePageSize', itemIndex),
					offset: this.getNodeParameter('scheduleOffset', itemIndex),
				},
				json: true,
			});
		case 'cancelScheduledSend':
		case 'getScheduledSend':
		case 'pauseScheduledSend':
		case 'resumeScheduledSend': {
			const scheduleId = encodeURIComponent(String(this.getNodeParameter('scheduleId', itemIndex)));
			const action = {
				cancelScheduledSend: '/cancel',
				getScheduledSend: '',
				pauseScheduledSend: '/pause',
				resumeScheduledSend: '/resume',
			}[operation];
			return this.helpers.requestWithAuthentication.call(this, 'goWhatsappApi', {
				method: action ? 'POST' : 'GET',
				url: `${baseUrl.replace(/\/$/, '')}/send/schedules/${scheduleId}${action}`,
				headers: deviceIdHeader,
				json: true,
			});
		}
	}

	// Only get phone number for operations that need it (not sendPresence)
	if (operation !== 'sendPresence') {
		const phoneNumber = this.getNodeParameter('phoneNumber', itemIndex) as string;
		requestOptions.body.phone = phoneNumber;

		// Add common optional parameters for operations that support them (not for sendChatPresence)
		if (operation !== 'sendChatPresence') {
			const replyMessageId = this.getNodeParameter('replyMessageId', itemIndex, '') as string;
			if (replyMessageId) {
				requestOptions.body.reply_message_id = replyMessageId;
			}
		}
	}

	// Handle is_forwarded for all operations (including sendPresence)
	const isForwarded = this.getNodeParameter('isForwarded', itemIndex, false) as boolean;
	if (isForwarded) {
		requestOptions.body.is_forwarded = isForwarded;
	}

	// Handle duration for operations that support it
	if (['sendText', 'sendContact', 'sendLink', 'sendLocation', 'sendPoll'].includes(operation)) {
		const duration = this.getNodeParameter('duration', itemIndex, 0) as number;
		if (duration > 0) {
			requestOptions.body.duration = duration;
		}
	}

	switch (operation) {
		case 'sendText': {
			const message = this.getNodeParameter('message', itemIndex) as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/send/message`;
			requestOptions.body.message = message;
			const scheduledAt = this.getNodeParameter('scheduledAt', itemIndex, '');
			if (scheduledAt) {
				requestOptions.body.scheduled_at = scheduledAt;
				requestOptions.body.timezone = this.getNodeParameter('scheduleTimezone', itemIndex, 'UTC');
			}
			const mentions = String(this.getNodeParameter('mentions', itemIndex, ''))
				.split(',')
				.map((mention) => mention.trim())
				.filter(Boolean);
			if (mentions.length) {
				requestOptions.body.mentions = mentions;
			}
			if (this.getNodeParameter('allowStatusReshare', itemIndex, false)) {
				requestOptions.body.allow_reshare = true;
			}
			break;
		}

		case 'sendInteractive': {
			const input = this.getNodeParameter('interactiveItems', itemIndex);
			let items: unknown = input;
			if (typeof input === 'string') {
				try {
					items = JSON.parse(input);
				} catch {
					throw new NodeOperationError(this.getNode(), 'Interactive items must be valid JSON', { itemIndex });
				}
			}
			if (!Array.isArray(items) || items.length === 0) {
				throw new NodeOperationError(this.getNode(), 'Interactive items must be a non-empty array', { itemIndex });
			}
			const layout = this.getNodeParameter('interactiveLayout', itemIndex);
			const footer = this.getNodeParameter('interactiveFooter', itemIndex, '');
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/send/interactive`;
			requestOptions.body = {
				phone: requestOptions.body.phone,
				body: this.getNodeParameter('interactiveBody', itemIndex),
				...(footer ? { footer } : {}),
				...(layout === 'cards' ? { cards: items } : { buttons: items }),
			};
			break;
		}

		case 'sendLink':
			const link = this.getNodeParameter('link', itemIndex) as string;
			const linkCaption = this.getNodeParameter('caption', itemIndex, '') as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/send/link`;
			requestOptions.body.link = link;
			if (linkCaption) {
				requestOptions.body.caption = linkCaption;
			}
			break;

		case 'sendChatPresence':
			const chatPresenceAction = this.getNodeParameter('chatPresenceAction', itemIndex) as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/send/chat-presence`;
			requestOptions.body.action = chatPresenceAction;
			break;

		case 'sendPresence':
			const presenceType = this.getNodeParameter('presenceType', itemIndex) as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/send/presence`;
			requestOptions.body.type = presenceType;
			break;

		case 'sendMedia':
			const mediaType = this.getNodeParameter('mediaType', itemIndex) as string;
			const mediaSource = this.getNodeParameter('mediaSource', itemIndex) as string;

			if (mediaSource === 'file') {
				return await handleFileUpload.call(this, `/send/${mediaType}`, 'binaryProperty', mediaType, itemIndex);
			} else {
				// Handle media URL (only for image, audio, video)
				if (mediaType === 'file') {
					throw new NodeOperationError(this.getNode(), 'File type does not support URL source. Please use file upload.');
				}

				const mediaUrl = this.getNodeParameter('mediaUrl', itemIndex) as string;
				requestOptions.url = `${baseUrl.replace(/\/$/, '')}/send/${mediaType}`;
				requestOptions.body[`${mediaType}_url`] = mediaUrl;

				const caption = this.getNodeParameter('caption', itemIndex, '') as string;
				if (caption) {
					requestOptions.body.caption = caption;
				}

				const duration = this.getNodeParameter('duration', itemIndex, 0) as number;
				if (duration > 0) {
					requestOptions.body.duration = duration;
				}

				if (mediaType === 'image' || mediaType === 'video') {
					const viewOnce = this.getNodeParameter('viewOnce', itemIndex, false) as boolean;
					if (viewOnce) {
						requestOptions.body.view_once = viewOnce;
					}

					const compress = this.getNodeParameter('compress', itemIndex, false) as boolean;
					if (compress) {
						requestOptions.body.compress = compress;
					}
				}
			}
			break;

		case 'sendContact':
			const contactName = this.getNodeParameter('contactName', itemIndex) as string;
			const contactPhone = this.getNodeParameter('contactPhone', itemIndex) as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/send/contact`;
			requestOptions.body.contact_name = contactName;
			requestOptions.body.contact_phone = contactPhone;
			break;

		case 'sendLocation':
			const latitude = this.getNodeParameter('latitude', itemIndex) as string;
			const longitude = this.getNodeParameter('longitude', itemIndex) as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/send/location`;
			requestOptions.body.latitude = latitude;
			requestOptions.body.longitude = longitude;
			break;

		case 'sendPoll':
			const question = this.getNodeParameter('question', itemIndex) as string;
			const options = this.getNodeParameter('options', itemIndex) as unknown as string;
			const maxAnswer = this.getNodeParameter('maxAnswer', itemIndex) as number;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/send/poll`;
			requestOptions.body.question = question;
			requestOptions.body.options = options.split(',').map((option: string) => option.trim());
			requestOptions.body.max_answer = maxAnswer;
			break;

		case 'sendSticker':
			const stickerSource = this.getNodeParameter('stickerSource', itemIndex) as string;

			if (stickerSource === 'file') {
				return await handleStickerUpload.call(this, itemIndex);
			} else {
				const stickerUrl = this.getNodeParameter('stickerUrl', itemIndex) as string;
				requestOptions.url = `${baseUrl.replace(/\/$/, '')}/send/sticker`;
				requestOptions.body.sticker_url = stickerUrl;

				const stickerDuration = this.getNodeParameter('stickerDuration', itemIndex, 0) as number;
				if (stickerDuration > 0) {
					requestOptions.body.duration = stickerDuration;
				}
			}
			break;

		default:
			throw new NodeOperationError(this.getNode(), `Unknown send operation: ${operation}`);
	}

	const response = await this.helpers.requestWithAuthentication.call(this, 'goWhatsappApi', {
		...requestOptions,
		headers: deviceIdHeader,
		json: true,
	});
	return response;
};
