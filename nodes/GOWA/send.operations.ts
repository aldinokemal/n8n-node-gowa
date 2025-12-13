import {
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeProperties,
	NodeOperationError,
} from 'n8n-workflow';
import { OperationExecutor, RequestOptions } from './types';
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
		options: [
			{
				name: 'Send Chat Presence',
				value: 'sendChatPresence',
				description: 'Send typing indicator to start or stop showing that you are composing a message',
				action: 'Send chat presence typing indicator',
			},
			{
				name: 'Send Contact',
				value: 'sendContact',
				description: 'Send a contact',
				action: 'Send a contact',
			},
			{
				name: 'Send Link',
				value: 'sendLink',
				description: 'Send a link',
				action: 'Send a link',
			},
			{
				name: 'Send Location',
				value: 'sendLocation',
				description: 'Send a location',
				action: 'Send a location',
			},
			{
				name: 'Send Media',
				value: 'sendMedia',
				description: 'Send media files (image, audio, video, or any file)',
				action: 'Send media files',
			},
			{
				name: 'Send Poll',
				value: 'sendPoll',
				description: 'Send a poll with multiple options',
				action: 'Send a poll',
			},
			{
				name: 'Send Presence',
				value: 'sendPresence',
				description: 'Send presence status',
				action: 'Send presence status',
			},
			{
				name: 'Send Sticker',
				value: 'sendSticker',
				description: 'Send sticker with automatic conversion to WebP format',
				action: 'Send a sticker',
			},
			{
				name: 'Send Text',
				value: 'sendText',
				description: 'Send a text message',
				action: 'Send a text message',
			},
		],
		default: 'sendText',
	},
];

export const sendProperties: INodeProperties[] = [
	{
		displayName: 'Phone or Group ID',
		name: 'phoneNumber',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendText', 'sendContact', 'sendLink', 'sendLocation', 'sendChatPresence', 'sendPoll', 'sendMedia', 'sendSticker'],
			},
		},
		default: '',
		placeholder: '628123456789',
		description: 'Phone number with country code or Group ID',
	},
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
];

async function handleFileUpload(this: IExecuteFunctions, endpoint: string, fileParam: string, apiFieldName: string, itemIndex: number): Promise<any> {
	const phoneNumber = this.getNodeParameter('phoneNumber', itemIndex) as string;
	const binaryPropertyName = this.getNodeParameter(fileParam, itemIndex) as string;

	const binaryData = this.helpers.assertBinaryData(itemIndex, binaryPropertyName);
	const fileBuffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);

	const credentials = await this.getCredentials('goWhatsappApi');
	const baseUrl = credentials.hostUrl as string || 'http://localhost:3000';
	const fullUrl = `${baseUrl.replace(/\/$/, '')}${endpoint}`;
	const deviceIdHeader = await getDeviceIdHeader(this);

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
	const deviceIdHeader = await getDeviceIdHeader(this);

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
	const deviceIdHeader = await getDeviceIdHeader(this);

	const requestOptions: RequestOptions = {
		method: 'POST' as IHttpRequestMethods,
		url: '',
		body: {} as any,
	};

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
		case 'sendText':
			const message = this.getNodeParameter('message', itemIndex) as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/send/message`;
			requestOptions.body.message = message;
			break;

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
