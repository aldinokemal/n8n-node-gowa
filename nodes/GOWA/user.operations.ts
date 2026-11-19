import {
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeProperties,
	NodeOperationError,
} from 'n8n-workflow';
import { OperationExecutor, RequestOptions } from './types';
import { operationOptions, operationProperties } from './properties';
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
		options: operationOptions({
			changePushName: [
				'Change Push Name',
				'Change push name',
				'Update the display name (push name) shown to others in WhatsApp',
			],
			checkContact: ['Check Contact', 'Check if contact is on whats app', 'Check if contact is on WhatsApp'],
			getAvatar: ['Get Avatar', 'Get user avatar'],
			getBusinessProfile: [
				'Get Business Profile',
				'Get business profile information',
			],
			getMyContacts: ['Get My Contacts', 'Get my contacts', 'Get list of user contacts'],
			getMyDetailedContacts: [
				'Get My Detailed Contacts',
				'Get my detailed contacts',
				'List contacts with separate full, first, push, and business names',
			],
			getMyGroups: ['Get My Groups', 'Get my groups', 'Get list of groups the user is in'],
			getMyNewsletters: [
				'Get My Newsletters',
				'Get my newsletters',
				'Get list of newsletters the user follows',
			],
			getPrivacySettings: ['Get Privacy Settings', 'Get privacy settings', null],
			getUserInfo: ['Get User Info', 'Get user information'],
			setAvatar: ['Set Avatar', 'Set user avatar'],
			subscribePresence: [
				'Subscribe to Presence',
				'Subscribe to contact presence',
				'Receive contact presence updates through GOWA webhooks. For continuous tracking, set WHATSAPP_PRESENCE_ON_CONNECT=available and WHATSAPP_PRESENCE_PULSE_ENABLED=false on the server. Keeping the device available suppresses phone push notifications.',
			],
		}),
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
	...operationProperties('user', ['subscribePresence'], {
		presencePhone: {
			displayName: 'Contact Phone or JID',
			type: 'string',
			required: true,
			default: '',
			description: 'Contact to subscribe to for online and offline updates',
		},
	}),
];

export const executeUserOperation: OperationExecutor = async function (
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<any> {
	const credentials = await this.getCredentials('goWhatsappApi');
	const baseUrl = credentials.hostUrl as string || 'http://localhost:3000';
	const deviceIdHeader = getDeviceIdHeader(this, itemIndex, credentials);

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

		case 'getMyDetailedContacts':
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/user/my/contacts/detailed`;
			break;

		case 'subscribePresence':
			requestOptions.method = 'POST';
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/user/presence/subscribe`;
			requestOptions.body = { phone: this.getNodeParameter('presencePhone', itemIndex) };
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
