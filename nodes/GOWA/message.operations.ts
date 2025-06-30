import {
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeProperties,
	NodeOperationError,
} from 'n8n-workflow';
import { OperationExecutor, RequestOptions } from './types';

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
		description: 'Phone number (for private chat) or Group ID (for group chat)',
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
];

export const executeMessageOperation: OperationExecutor = async function (
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<any> {
	const messageId = this.getNodeParameter('messageId', itemIndex) as string;
	const phoneOrGroupId = this.getNodeParameter('phoneOrGroupId', itemIndex) as string;

	// Get credentials to retrieve base URL
	const credentials = await this.getCredentials('goWhatsappApi');
	const baseUrl = credentials.hostUrl as string || 'http://localhost:3000';

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
		case 'reactMessage':
			const emoji = this.getNodeParameter('emoji', itemIndex) as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/message/${messageId}/reaction`;
			requestOptions.body.emoji = emoji;
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
		case 'updateMessage':
			const newMessage = this.getNodeParameter('newMessage', itemIndex) as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/message/${messageId}/update`;
			requestOptions.body.message = newMessage;
			break;
		default:
			throw new NodeOperationError(this.getNode(), `Unknown message operation: ${operation}`);
	}

	const response = await this.helpers.requestWithAuthentication.call(this, 'goWhatsappApi', {
		...requestOptions,
		json: true,
	});
	return response;
};
