import {
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeProperties,
	NodeOperationError,
} from 'n8n-workflow';
import { OperationExecutor, RequestOptions } from './types';
import { getDeviceIdHeader } from './app.operations';

export const messageOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['message'],
			},
		},
		options: [
			{
				name: 'Delete Message',
				value: 'deleteMessage',
				description: 'Delete a message',
				action: 'Delete a message',
			},
			{
				name: 'Download Media',
				value: 'downloadMedia',
				description: 'Download media content from a message',
				action: 'Download media from message',
			},
			{
				name: 'Forward Message',
				value: 'forwardMessage',
				description: 'Forward a message from local chat storage to another chat',
				action: 'Forward a stored message',
			},
			{
				name: 'Mark as Played',
				value: 'markAsPlayed',
				description: 'Send a played receipt for an incoming audio message or voice note',
				action: 'Mark an audio message as played',
			},
			{
				name: 'React to Message',
				value: 'reactMessage',
				description: 'React to a message',
				action: 'React to a message',
			},
			{
				name: 'Read Message',
				value: 'readMessage',
				description: 'Mark message as read',
				action: 'Mark message as read',
			},
			{
				name: 'Revoke Message',
				value: 'revokeMessage',
				description: 'Revoke a message',
				action: 'Revoke a message',
			},
			{
				name: 'Star Message',
				value: 'starMessage',
				description: 'Star a message',
				action: 'Star a message',
			},
			{
				name: 'Unstar Message',
				value: 'unstarMessage',
				description: 'Unstar a message',
				action: 'Unstar a message',
			},
			{
				name: 'Update Message',
				value: 'updateMessage',
				description: 'Update a message',
				action: 'Update a message',
			},
		],
		default: 'revokeMessage',
	},
];

export const messageProperties: INodeProperties[] = [
	{
		displayName: 'Phone Number or Group ID',
		name: 'phoneOrGroupId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
			},
		},
		default: '',
		description: 'Phone number or group ID. For Forward Message, enter the destination chat.',
	},
	{
		displayName: 'Message ID',
		name: 'messageId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
			},
		},
		default: '',
		description: 'ID of the message to operate on',
	},
	{
		displayName: 'Emoji',
		name: 'emoji',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['reactMessage'],
			},
		},
		default: '👍',
		description: 'Emoji reaction to add',
	},
	{
		displayName: 'New Message',
		name: 'newMessage',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['updateMessage'],
			},
		},
		default: '',
		description: 'The new content of the message',
	},
	{
		displayName: 'Force Reupload',
		name: 'forceReupload',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['forwardMessage'],
			},
		},
		default: false,
		description: 'Whether to reupload media instead of reusing the original reference',
	},
	{
		displayName: 'Content Type',
		name: 'editMediaType',
		type: 'options',
		options: [
			{ name: 'Document Caption', value: 'document' },
			{ name: 'Image Caption', value: 'image' },
			{ name: 'Text', value: '' },
		],
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['updateMessage'],
			},
		},
		default: '',
		description: 'Select the original message type to edit text or a media caption',
	},
	{
		displayName: 'Link Preview URL',
		name: 'editLink',
		type: 'string',
		placeholder: 'https://example.com',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['updateMessage'],
				editMediaType: [''],
			},
		},
		default: '',
		description: 'Optional URL to include as a link preview when editing text',
	},
];

export const executeMessageOperation: OperationExecutor = async function (
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<any> {
	const messageId = this.getNodeParameter('messageId', itemIndex) as string;
	const phoneOrGroupId = this.getNodeParameter('phoneOrGroupId', itemIndex) as string;

	const credentials = await this.getCredentials('goWhatsappApi');
	const baseUrl = credentials.hostUrl as string || 'http://localhost:3000';
	const deviceIdHeader = getDeviceIdHeader(this, itemIndex, credentials);

	const requestOptions: RequestOptions = {
		method: 'POST' as IHttpRequestMethods,
		url: '',
		body: {
			phone: phoneOrGroupId,
		} as any,
	};

	switch (operation) {
		case 'deleteMessage':
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/message/${messageId}/delete`;
			break;
		case 'downloadMedia':
			requestOptions.method = 'GET';
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/message/${messageId}/download`;
			requestOptions.qs = { phone: phoneOrGroupId };
			delete requestOptions.body;
			break;
		case 'reactMessage':
			const emoji = this.getNodeParameter('emoji', itemIndex) as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/message/${messageId}/reaction`;
			requestOptions.body.emoji = emoji;
			break;
		case 'forwardMessage':
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/message/${messageId}/forward`;
			requestOptions.body.force_reupload = this.getNodeParameter('forceReupload', itemIndex);
			break;
		case 'markAsPlayed':
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/message/${messageId}/played`;
			break;
		case 'readMessage':
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/message/${messageId}/read`;
			break;
		case 'revokeMessage':
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/message/${messageId}/revoke`;
			break;
		case 'starMessage':
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/message/${messageId}/star`;
			break;
		case 'unstarMessage':
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/message/${messageId}/unstar`;
			break;
		case 'updateMessage': {
			const newMessage = this.getNodeParameter('newMessage', itemIndex) as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/message/${messageId}/update`;
			requestOptions.body.message = newMessage;
			const mediaType = this.getNodeParameter('editMediaType', itemIndex, '');
			if (mediaType) {
				requestOptions.body.media_type = mediaType;
			} else {
				const link = this.getNodeParameter('editLink', itemIndex, '');
				if (link) {
					requestOptions.body.link = link;
				}
			}
			break;
		}
		default:
			throw new NodeOperationError(this.getNode(), `Unknown message operation: ${operation}`);
	}

	const response = await this.helpers.requestWithAuthentication.call(this, 'goWhatsappApi', {
		...requestOptions,
		headers: deviceIdHeader,
		json: true,
	});
	return response;
};
