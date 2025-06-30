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
				name: 'Reconnect',
				value: 'reconnect',
				description: 'Reconnect to WhatsApp Web',
				action: 'Reconnect to whats app web',
			},
		],
		default: 'getDeviceInfo',
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
		case 'reconnect':
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/app/reconnect`;
			break;
		default:
			throw new NodeOperationError(this.getNode(), `Unknown app operation: ${operation}`);
	}

	const response = await this.helpers.requestWithAuthentication.call(this, 'goWhatsappApi', {
		...requestOptions,
		json: true,
	});
	return response;
};
