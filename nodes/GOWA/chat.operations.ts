import {
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeProperties,
	NodeOperationError,
} from 'n8n-workflow';
import { OperationExecutor, RequestOptions } from './types';

export const chatOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['chat'],
			},
		},
		options: [
			{
				name: 'List Chats',
				value: 'listChats',
				description: 'Get list of chats',
				action: 'Get list of chats',
			},
			{
				name: 'Get Chat Messages',
				value: 'getChatMessages',
				description: 'Get messages from a specific chat',
				action: 'Get messages from a specific chat',
			},
			{
				name: 'Pin Chat',
				value: 'pinChat',
				description: 'Pin or unpin a chat',
				action: 'Pin or unpin a chat',
			},
		],
		default: 'listChats',
	},
];

export const chatProperties: INodeProperties[] = [
	// Properties for List Chats
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['listChats', 'getChatMessages'],
			},
		},
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['listChats', 'getChatMessages'],
			},
		},
		default: 0,
		description: 'Number of chats to skip (for pagination)',
	},
	{
		displayName: 'Search',
		name: 'search',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['listChats', 'getChatMessages'],
			},
		},
		default: '',
		description: 'Search term',
	},
	{
		displayName: 'Has Media',
		name: 'hasMedia',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['listChats'],
			},
		},
		default: false,
		description: 'Whether to filter chats that contain media messages',
	},

	// Properties for Get Chat Messages
	{
		displayName: 'Chat JID',
		name: 'chatJid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['getChatMessages', 'pinChat'],
			},
		},
		default: '',
		description: 'Chat JID (e.g., phone@s.whatsapp.net for individual or groupid@g.us for group)',
	},
	{
		displayName: 'Start Time',
		name: 'startTime',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['getChatMessages'],
			},
		},
		default: '',
		description: 'Filter messages from this timestamp (ISO 8601 format)',
	},
	{
		displayName: 'End Time',
		name: 'endTime',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['getChatMessages'],
			},
		},
		default: '',
		description: 'Filter messages until this timestamp (ISO 8601 format)',
	},
	{
		displayName: 'Media Only',
		name: 'mediaOnly',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['getChatMessages'],
			},
		},
		default: false,
		description: 'Whether to only return messages with media content',
	},
	{
		displayName: 'Is From Me',
		name: 'isFromMe',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['getChatMessages'],
			},
		},
		default: false,
		description: 'Whether to filter messages by sender (true for you, false for others)',
	},

	// Properties for Pin Chat
	{
		displayName: 'Pinned',
		name: 'pinned',
		type: 'boolean',
		required: true,
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['pinChat'],
			},
		},
		default: true,
		description: 'Whether to pin (true) or unpin (false) the chat',
	},
];

export const executeChatOperation: OperationExecutor = async function (
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<any> {
	const credentials = await this.getCredentials('goWhatsappApi');
	const baseUrl = credentials.hostUrl as string || 'http://localhost:3000';

	const requestOptions: RequestOptions = {
		method: 'GET' as IHttpRequestMethods,
		url: '',
		qs: {},
		body: {},
	};

	switch (operation) {
		case 'listChats':
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/chats`;
			requestOptions.qs = {
				limit: this.getNodeParameter('limit', itemIndex),
				offset: this.getNodeParameter('offset', itemIndex),
				search: this.getNodeParameter('search', itemIndex),
				has_media: this.getNodeParameter('hasMedia', itemIndex),
			};
			break;
		case 'getChatMessages':
			const chatJidForMessages = this.getNodeParameter('chatJid', itemIndex) as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/chat/${chatJidForMessages}/messages`;
			requestOptions.qs = {
				limit: this.getNodeParameter('limit', itemIndex),
				offset: this.getNodeParameter('offset', itemIndex),
				start_time: this.getNodeParameter('startTime', itemIndex),
				end_time: this.getNodeParameter('endTime', itemIndex),
				media_only: this.getNodeParameter('mediaOnly', itemIndex),
				is_from_me: this.getNodeParameter('isFromMe', itemIndex),
				search: this.getNodeParameter('search', itemIndex),
			};
			break;
		case 'pinChat':
			const chatJidForPin = this.getNodeParameter('chatJid', itemIndex) as string;
			requestOptions.method = 'POST';
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/chat/${chatJidForPin}/pin`;
			requestOptions.body = {
				pinned: this.getNodeParameter('pinned', itemIndex),
			};
			break;
		default:
			throw new NodeOperationError(this.getNode(), `Unknown chat operation: ${operation}`);
	}

	const response = await this.helpers.requestWithAuthentication.call(this, 'goWhatsappApi', {
		...requestOptions,
		json: true,
	});
	return response;
};
