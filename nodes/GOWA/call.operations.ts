import { INodeProperties, NodeOperationError } from 'n8n-workflow';
import { getDeviceIdHeader } from './app.operations';
import { OperationExecutor } from './types';

export const callProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['call'] } },
		options: [
			{
				name: 'Reject Call',
				value: 'rejectCall',
				description: 'Reject a call that is still ringing',
				action: 'Reject an incoming call',
			},
		],
		default: 'rejectCall',
	},
	{
		displayName: 'Caller JID',
		name: 'callerJid',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['call'], operation: ['rejectCall'] } },
		default: '',
		description: 'Caller JID from payload.from in the call.offer webhook',
	},
	{
		displayName: 'Call ID',
		name: 'callId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['call'], operation: ['rejectCall'] } },
		default: '',
		description: 'ID from payload.call_id in the call.offer webhook',
	},
];

export const executeCallOperation: OperationExecutor = async function (operation, itemIndex) {
	if (operation !== 'rejectCall') {
		throw new NodeOperationError(this.getNode(), `Unknown call operation: ${operation}`, { itemIndex });
	}
	const credentials = await this.getCredentials('goWhatsappApi');
	const baseUrl = String(credentials.hostUrl || 'http://localhost:3000').replace(/\/$/, '');
	return this.helpers.requestWithAuthentication.call(this, 'goWhatsappApi', {
		method: 'POST',
		url: `${baseUrl}/call/reject`,
		headers: getDeviceIdHeader(this, itemIndex, credentials),
		body: {
			caller_jid: this.getNodeParameter('callerJid', itemIndex),
			call_id: this.getNodeParameter('callId', itemIndex),
		},
		json: true,
	});
};
