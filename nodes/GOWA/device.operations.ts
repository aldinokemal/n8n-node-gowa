import {
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeProperties,
	NodeOperationError,
} from 'n8n-workflow';
import { OperationExecutor, RequestOptions } from './types';

export const deviceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['device'],
			},
		},
		options: [
			{
				name: 'Add Device',
				value: 'addDevice',
				description: 'Create a new device slot for multi-device management',
				action: 'Add a new device',
			},
			{
				name: 'Get Device',
				value: 'getDevice',
				description: 'Get detailed information about a specific device',
				action: 'Get device info',
			},
			{
				name: 'Get Device Status',
				value: 'getDeviceStatus',
				description: 'Get the current connection status of a specific device',
				action: 'Get device connection status',
			},
			{
				name: 'List Devices',
				value: 'listDevices',
				description: 'Returns all registered devices with their connection status',
				action: 'List all devices',
			},
			{
				name: 'Login Device',
				value: 'loginDevice',
				description: 'Initiate QR code login for a specific device',
				action: 'Login device with QR code',
			},
			{
				name: 'Login Device with Code',
				value: 'loginDeviceWithCode',
				description: 'Initiate pairing code login for a specific device',
				action: 'Login device with pairing code',
			},
			{
				name: 'Logout Device',
				value: 'logoutDevice',
				description: 'Logout a specific device from WhatsApp and remove its session',
				action: 'Logout device',
			},
			{
				name: 'Reconnect Device',
				value: 'reconnectDevice',
				description: 'Reconnect a specific device to WhatsApp',
				action: 'Reconnect device',
			},
			{
				name: 'Remove Device',
				value: 'removeDevice',
				description: 'Remove a device from the server (does not logout from WhatsApp)',
				action: 'Remove a device',
			},
		],
		default: 'listDevices',
	},
];

export const deviceProperties: INodeProperties[] = [
	{
		displayName: 'Device ID',
		name: 'deviceId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['getDevice', 'removeDevice', 'loginDevice', 'loginDeviceWithCode', 'logoutDevice', 'reconnectDevice', 'getDeviceStatus'],
			},
		},
		default: '',
	},
	{
		displayName: 'Custom Device ID',
		name: 'customDeviceId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['addDevice'],
			},
		},
		default: '',
		description: 'Optional custom device ID. If not provided, one will be generated.',
	},
	{
		displayName: 'Phone Number',
		name: 'phone',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['loginDeviceWithCode'],
			},
		},
		default: '',
		placeholder: '628912344551',
		description: 'Phone number to pair with',
	},
];

export const executeDeviceOperation: OperationExecutor = async function (
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<any> {
	const credentials = await this.getCredentials('goWhatsappApi');
	const baseUrl = credentials.hostUrl as string || 'http://localhost:3000';

	const requestOptions: RequestOptions = {
		method: 'GET' as IHttpRequestMethods,
		url: '',
		body: {},
		qs: {} as any,
	};

	switch (operation) {
		case 'listDevices':
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/devices`;
			break;

		case 'addDevice':
			const customDeviceId = this.getNodeParameter('customDeviceId', itemIndex, '') as string;
			requestOptions.method = 'POST';
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/devices`;
			if (customDeviceId) {
				requestOptions.body = { device_id: customDeviceId };
			}
			break;

		case 'getDevice':
			const getDeviceId = this.getNodeParameter('deviceId', itemIndex) as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/devices/${encodeURIComponent(getDeviceId)}`;
			break;

		case 'removeDevice':
			const removeDeviceId = this.getNodeParameter('deviceId', itemIndex) as string;
			requestOptions.method = 'DELETE';
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/devices/${encodeURIComponent(removeDeviceId)}`;
			break;

		case 'loginDevice':
			const loginDeviceId = this.getNodeParameter('deviceId', itemIndex) as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/devices/${encodeURIComponent(loginDeviceId)}/login`;
			break;

		case 'loginDeviceWithCode':
			const loginCodeDeviceId = this.getNodeParameter('deviceId', itemIndex) as string;
			const phone = this.getNodeParameter('phone', itemIndex) as string;
			requestOptions.method = 'POST';
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/devices/${encodeURIComponent(loginCodeDeviceId)}/login/code`;
			requestOptions.qs.phone = phone;
			break;

		case 'logoutDevice':
			const logoutDeviceId = this.getNodeParameter('deviceId', itemIndex) as string;
			requestOptions.method = 'POST';
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/devices/${encodeURIComponent(logoutDeviceId)}/logout`;
			break;

		case 'reconnectDevice':
			const reconnectDeviceId = this.getNodeParameter('deviceId', itemIndex) as string;
			requestOptions.method = 'POST';
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/devices/${encodeURIComponent(reconnectDeviceId)}/reconnect`;
			break;

		case 'getDeviceStatus':
			const statusDeviceId = this.getNodeParameter('deviceId', itemIndex) as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/devices/${encodeURIComponent(statusDeviceId)}/status`;
			break;

		default:
			throw new NodeOperationError(this.getNode(), `Unknown device operation: ${operation}`);
	}

	const response = await this.helpers.requestWithAuthentication.call(this, 'goWhatsappApi', {
		...requestOptions,
		json: true,
	});
	return response;
};
