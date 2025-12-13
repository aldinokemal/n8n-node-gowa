import {
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeProperties,
	NodeOperationError,
} from 'n8n-workflow';
import { OperationExecutor, RequestOptions } from './types';
import { getDeviceIdHeader } from './app.operations';

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
				name: 'Change Push Name',
				value: 'changePushName',
				description: 'Update the display name (push name) shown to others in WhatsApp',
				action: 'Change push name',
			},
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
				name: 'Get Business Profile',
				value: 'getBusinessProfile',
				description: 'Get business profile information',
				action: 'Get business profile information',
			},
			{
				name: 'Get My Contacts',
				value: 'getMyContacts',
				description: 'Get list of user contacts',
				action: 'Get my contacts',
			},
			{
				name: 'Get My Groups',
				value: 'getMyGroups',
				description: 'Get list of groups the user is in',
				action: 'Get my groups',
			},
			{
				name: 'Get My Newsletters',
				value: 'getMyNewsletters',
				description: 'Get list of newsletters the user follows',
				action: 'Get my newsletters',
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
				operation: ['getUserInfo', 'getAvatar', 'checkContact', 'getBusinessProfile'],
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
	{
		displayName: 'Push Name',
		name: 'pushName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['changePushName'],
			},
		},
		default: '',
		description: 'The new display name to set',
	},
];

export const executeUserOperation: OperationExecutor = async function (
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<any> {
	const credentials = await this.getCredentials('goWhatsappApi');
	const baseUrl = credentials.hostUrl as string || 'http://localhost:3000';
	const deviceIdHeader = await getDeviceIdHeader(this);

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
			const avatarResponse = await this.helpers.requestWithAuthentication.call(this, 'goWhatsappApi', {
				method: 'POST' as IHttpRequestMethods,
				url: `${baseUrl.replace(/\/$/, '')}/user/avatar`,
				headers: deviceIdHeader,
				formData,
				json: true,
			});
			return avatarResponse;

		case 'getPrivacySettings':
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/user/my/privacy`;
			break;

		case 'checkContact':
			const checkPhone = this.getNodeParameter('userPhone', itemIndex) as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/user/check`;
			requestOptions.qs.phone = checkPhone;
			break;

		case 'getBusinessProfile':
			const businessPhone = this.getNodeParameter('userPhone', itemIndex) as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/user/business-profile`;
			requestOptions.qs.phone = businessPhone;
			break;

		case 'changePushName':
			const pushName = this.getNodeParameter('pushName', itemIndex) as string;
			const pushNameResponse = await this.helpers.requestWithAuthentication.call(this, 'goWhatsappApi', {
				method: 'POST' as IHttpRequestMethods,
				url: `${baseUrl.replace(/\/$/, '')}/user/pushname`,
				headers: deviceIdHeader,
				body: { push_name: pushName },
				json: true,
			});
			return pushNameResponse;

		case 'getMyGroups':
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/user/my/groups`;
			break;

		case 'getMyNewsletters':
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/user/my/newsletters`;
			break;

		case 'getMyContacts':
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/user/my/contacts`;
			break;

		default:
			throw new NodeOperationError(this.getNode(), `Unknown user operation: ${operation}`);
	}

	const response = await this.helpers.requestWithAuthentication.call(this, 'goWhatsappApi', {
		...requestOptions,
		headers: deviceIdHeader,
		json: true,
	});
	return response;
};