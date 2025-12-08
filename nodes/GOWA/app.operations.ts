import {
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeProperties,
	NodeOperationError,
} from 'n8n-workflow';
import { OperationExecutor, RequestOptions } from './types';

export const appOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['app'],
			},
		},
		options: [
			{
				name: 'Get Device Info',
				value: 'getDeviceInfo',
				description: 'Get device information',
				action: 'Get device information',
			},
			{
				name: 'Get Media by Path',
				value: 'getMediaByPath',
				description: 'Get media file by its storage path',
				action: 'Get media file by storage path',
			},
			{
				name: 'Reconnect',
				value: 'reconnect',
				description: 'Reconnect to WhatsApp Web',
				action: 'Reconnect to whats app web',
			},
		],
		default: 'getDeviceInfo',
	},
	{
		displayName: 'Media Path',
		name: 'mediaPath',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['app'],
				operation: ['getMediaByPath'],
			},
		},
		default: '',
		placeholder: 'statics/media/628123456789/2024-01-15/1705123456-abc123.jpg',
		description: 'The relative path to the media file (e.g., statics/media/phone/date/filename)',
	},
];

export const executeAppOperation: OperationExecutor = async function (
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<any> {
	// Get credentials to retrieve base URL
	const credentials = await this.getCredentials('goWhatsappApi');
	const baseUrl = credentials.hostUrl as string || 'http://localhost:3000';

	const requestOptions: RequestOptions = {
		method: 'GET' as IHttpRequestMethods,
		url: '',
		body: {},
		qs: {} as any,
	};

	switch (operation) {
		case 'getDeviceInfo':
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/app/devices`;
			break;
		case 'getMediaByPath':
			const mediaPath = this.getNodeParameter('mediaPath', itemIndex) as string;
			if (!mediaPath) {
				throw new NodeOperationError(this.getNode(), 'Media path is required');
			}
			// Remove leading slash if present and ensure it starts with statics/
			const cleanPath = mediaPath.replace(/^\/+/, '');
			if (!cleanPath.startsWith('statics/')) {
				throw new NodeOperationError(this.getNode(), 'Media path must start with "statics/"');
			}
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/${cleanPath}`;
			break;
		case 'reconnect':
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/app/reconnect`;
			break;
		default:
			throw new NodeOperationError(this.getNode(), `Unknown app operation: ${operation}`);
	}

	// For media operations, we need to handle binary data differently
	if (operation === 'getMediaByPath') {
		const response = await this.helpers.requestWithAuthentication.call(this, 'goWhatsappApi', {
			...requestOptions,
			encoding: 'binary',
			returnFullResponse: true,
		});
		
		return {
			mediaPath: this.getNodeParameter('mediaPath', itemIndex),
			statusCode: response.statusCode,
			headers: response.headers,
			contentType: response.headers['content-type'],
			contentLength: response.headers['content-length'],
			body: response.body,
		};
	}

	const response = await this.helpers.requestWithAuthentication.call(this, 'goWhatsappApi', {
		...requestOptions,
		json: true,
	});
	return response;
};
