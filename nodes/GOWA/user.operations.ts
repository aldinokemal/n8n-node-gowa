import {
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeProperties,
	NodeOperationError,
} from 'n8n-workflow';
import { OperationExecutor, RequestOptions } from './types';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: [
			{
				name: 'Check Contact',
				value: 'checkContact',
				description: 'Check if contact is on WhatsApp',
				action: 'Check if contact is on whats app',
			},
			{
				name: 'Get Avatar',
				value: 'getAvatar',
				description: 'Get user avatar',
				action: 'Get user avatar',
			},
			{
				name: 'Get Privacy Settings',
				value: 'getPrivacySettings',
				action: 'Get privacy settings',
			},
			{
				name: 'Get User Info',
				value: 'getUserInfo',
				description: 'Get user information',
				action: 'Get user information',
			},
			{
				name: 'Set Avatar',
				value: 'setAvatar',
				description: 'Set user avatar',
				action: 'Set user avatar',
			},
		],
		default: 'getUserInfo',
	},
];

export const userProperties: INodeProperties[] = [
	{
		displayName: 'User Phone',
		name: 'userPhone',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['getUserInfo', 'getAvatar', 'checkContact'],
			},
		},
		default: '',
		description: 'Phone number to get info for (leave empty for own info)',
	},
	{
		displayName: 'Avatar File Property',
		name: 'avatarFile',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['setAvatar'],
			},
		},
		default: 'data',
		description: 'Name of the binary property containing the avatar image file',
	},
];

export const executeUserOperation: OperationExecutor = async function (
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
		qs: {} as any,
	};

	switch (operation) {
		case 'getUserInfo':
			const userInfoPhone = this.getNodeParameter('userPhone', itemIndex, '') as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/user/info`;
			if (userInfoPhone) requestOptions.qs.phone = userInfoPhone;
			break;

		case 'getAvatar':
			const avatarPhone = this.getNodeParameter('userPhone', itemIndex, '') as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/user/avatar`;
			if (avatarPhone) requestOptions.qs.phone = avatarPhone;
			break;

		case 'setAvatar':
			const binaryPropertyName = this.getNodeParameter('avatarFile', itemIndex) as string;
			const binaryData = this.helpers.assertBinaryData(itemIndex, binaryPropertyName);
			const formData = {
				avatar: {
					value: binaryData.data,
					options: {
						filename: binaryData.fileName || 'file',
						contentType: binaryData.mimeType,
					},
				},
			};
			const response = await this.helpers.requestWithAuthentication.call(this, 'goWhatsappApi', {
				method: 'POST' as IHttpRequestMethods,
				url: `${baseUrl.replace(/\/$/, '')}/user/avatar`,
				formData,
				json: true,
			});
			return response;

		case 'getPrivacySettings':
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/user/my/privacy`;
			break;

		case 'checkContact':
			const checkPhone = this.getNodeParameter('userPhone', itemIndex) as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/user/check`;
			requestOptions.qs.phone = checkPhone;
			break;

		default:
			throw new NodeOperationError(this.getNode(), `Unknown user operation: ${operation}`);
	}

	const response = await this.helpers.requestWithAuthentication.call(this, 'goWhatsappApi', {
		...requestOptions,
		json: true,
	});
	return response;
};