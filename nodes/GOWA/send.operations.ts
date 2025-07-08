import {
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeProperties,
	NodeOperationError,
} from 'n8n-workflow';
import { OperationExecutor, RequestOptions } from './types';

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
				name: 'Send Audio',
				value: 'sendAudio',
				description: 'Send an audio file',
				action: 'Send an audio file',
			},
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
				name: 'Send Image',
				value: 'sendImage',
				description: 'Send an image',
				action: 'Send an image',
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
				name: 'Send Presence',
				value: 'sendPresence',
				description: 'Send presence status',
				action: 'Send presence status',
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
				operation: ['sendText', 'sendImage', 'sendContact', 'sendLink', 'sendLocation', 'sendAudio', 'sendChatPresence'],
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
		displayName: 'Image Source',
		name: 'imageSource',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendImage'],
			},
		},
		options: [
			{
				name: 'File Upload',
				value: 'file',
				description: 'Upload image file from binary data',
			},
			{
				name: 'Image URL',
				value: 'url',
				description: 'Send image from URL',
			},
		],
		default: 'url',
		description: 'Choose whether to upload a file or use an image URL',
	},
	{
		displayName: 'Image File Property',
		name: 'imageFile',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendImage'],
				imageSource: ['file'],
			},
		},
		default: 'data',
		description: 'Name of the binary property containing the image file',
	},
	{
		displayName: 'Image URL',
		name: 'imageUrl',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendImage'],
				imageSource: ['url'],
			},
		},
		default: '',
		placeholder: 'https://example.com/image.jpg',
		description: 'URL of the image to send',
	},
	{
		displayName: 'Audio Source',
		name: 'audioSource',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendAudio'],
			},
		},
		options: [
			{
				name: 'File Upload',
				value: 'file',
				description: 'Upload audio file from binary data',
			},
			{
				name: 'Audio URL',
				value: 'url',
				description: 'Send audio from URL',
			},
		],
		default: 'url',
		description: 'Choose whether to upload a file or use an audio URL',
	},
	{
		displayName: 'Audio File Property',
		name: 'audioFile',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendAudio'],
				audioSource: ['file'],
			},
		},
		default: 'data',
		description: 'Name of the binary property containing the audio file',
	},
	{
		displayName: 'Audio URL',
		name: 'audioUrl',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendAudio'],
				audioSource: ['url'],
			},
		},
		default: '',
		placeholder: 'https://example.com/audio.mp3',
		description: 'URL of the audio to send',
	},
	{
		displayName: 'Caption',
		name: 'caption',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['send'],
				operation: ['sendImage', 'sendLink'],
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
				operation: ['sendText', 'sendImage', 'sendContact', 'sendLink', 'sendLocation', 'sendAudio'],
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
				operation: ['sendImage'],
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
				operation: ['sendImage'],
			},
		},
		default: false,
		description: 'Whether to compress the media',
	},
];

async function handleFileUpload(this: IExecuteFunctions, endpoint: string, fileParam: string, apiFieldName: string, itemIndex: number): Promise<any> {
	const phoneNumber = this.getNodeParameter('phoneNumber', itemIndex) as string;
	const binaryPropertyName = this.getNodeParameter(fileParam, itemIndex) as string;

	const binaryData = this.helpers.assertBinaryData(itemIndex, binaryPropertyName);

	// Get credentials to retrieve base URL
	const credentials = await this.getCredentials('goWhatsappApi');
	const baseUrl = credentials.hostUrl as string || 'http://localhost:3000';
	const fullUrl = `${baseUrl.replace(/\/$/, '')}${endpoint}`;

	const formData = {
		phone: phoneNumber,
		[apiFieldName]: {
			value: binaryData.data,
			options: {
				filename: binaryData.fileName || 'file',
				contentType: binaryData.mimeType,
			},
		},
	};

	// Add optional parameters
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

	if (apiFieldName === 'image') {
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
		formData,
		json: true,
	});
	return response;
}

export const executeSendOperation: OperationExecutor = async function (
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<any> {
	// Get credentials to retrieve base URL
	const credentials = await this.getCredentials('goWhatsappApi');
	const baseUrl = credentials.hostUrl as string || 'http://localhost:3000';

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

		case 'sendImage':
			const imageSource = this.getNodeParameter('imageSource', itemIndex) as string;

			if (imageSource === 'file') {
				return await handleFileUpload.call(this, '/send/image', 'imageFile', 'image', itemIndex);
			} else {
				// Handle image URL
				const imageUrl = this.getNodeParameter('imageUrl', itemIndex) as string;
				requestOptions.url = `${baseUrl.replace(/\/$/, '')}/send/image`;
				requestOptions.body.image_url = imageUrl;

				// Add optional parameters
				const caption = this.getNodeParameter('caption', itemIndex, '') as string;
				if (caption) {
					requestOptions.body.caption = caption;
				}

				const viewOnce = this.getNodeParameter('viewOnce', itemIndex, false) as boolean;
				if (viewOnce) {
					requestOptions.body.view_once = viewOnce;
				}

				const compress = this.getNodeParameter('compress', itemIndex, false) as boolean;
				if (compress) {
					requestOptions.body.compress = compress;
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

		case 'sendAudio':
			const audioSource = this.getNodeParameter('audioSource', itemIndex) as string;

			if (audioSource === 'file') {
				return await handleFileUpload.call(this, '/send/audio', 'audioFile', 'audio', itemIndex);
			} else {
				// Handle audio URL
				const audioUrl = this.getNodeParameter('audioUrl', itemIndex) as string;
				requestOptions.url = `${baseUrl.replace(/\/$/, '')}/send/audio`;
				requestOptions.body.audio_url = audioUrl;
			}
			break;

		default:
			throw new NodeOperationError(this.getNode(), `Unknown send operation: ${operation}`);
	}

	const response = await this.helpers.requestWithAuthentication.call(this, 'goWhatsappApi', {
		...requestOptions,
		json: true,
	});
	return response;
};
