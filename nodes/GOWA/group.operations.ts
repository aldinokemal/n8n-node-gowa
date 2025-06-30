import {
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeProperties,
	NodeOperationError,
} from 'n8n-workflow';
import { OperationExecutor, RequestOptions } from './types';

export const groupOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['group'],
			},
		},
		options: [
			{
				name: 'Add Participant',
				value: 'addParticipant',
				description: 'Add participant to group',
				action: 'Add participant to group',
			},
			{
				name: 'Create Group',
				value: 'createGroup',
				description: 'Create a new group',
				action: 'Create a new group',
			},
			{
				name: 'Demote Participant',
				value: 'demoteParticipant',
				description: 'Demote participant from admin',
				action: 'Demote participant from admin',
			},
			{
				name: 'Leave Group',
				value: 'leaveGroup',
				description: 'Leave a group',
				action: 'Leave a group',
			},
			{
				name: 'Promote Participant',
				value: 'promoteParticipant',
				description: 'Promote participant to admin',
				action: 'Promote participant to admin',
			},
			{
				name: 'Remove Participant',
				value: 'removeParticipant',
				description: 'Remove participant from group',
				action: 'Remove participant from group',
			},
		],
		default: 'createGroup',
	},
];

export const groupProperties: INodeProperties[] = [
	{
		displayName: 'Group Name',
		name: 'groupName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['createGroup'],
			},
		},
		default: '',
		description: 'Name of the group to create',
	},
	{
		displayName: 'Participants',
		name: 'groupParticipants',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['createGroup'],
			},
		},
		default: '',
		placeholder: '628123,628456',
		description: 'Comma-separated phone numbers of participants to add to the new group',
	},
	{
		displayName: 'Group ID',
		name: 'groupId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['addParticipant', 'removeParticipant', 'promoteParticipant', 'demoteParticipant', 'leaveGroup'],
			},
		},
		default: '',
		description: 'ID of the group',
	},
	{
		displayName: 'Participant Phone',
		name: 'participantPhone',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['addParticipant', 'removeParticipant', 'promoteParticipant', 'demoteParticipant'],
			},
		},
		default: '',
		description: 'Comma-separated phone numbers of the participant(s)',
	},
];

export const executeGroupOperation: OperationExecutor = async function (
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<any> {
	// Get credentials to retrieve base URL
	const credentials = await this.getCredentials('goWhatsappApi');
	const baseUrl = credentials.hostUrl as string || 'http://localhost:3000';

	const requestOptions: RequestOptions = {
		method: 'POST' as IHttpRequestMethods,
		url: '',
		body: {} as any,
	};

	switch (operation) {
		case 'createGroup':
			const groupName = this.getNodeParameter('groupName', itemIndex) as string;
			const groupParticipants = this.getNodeParameter('groupParticipants', itemIndex, '') as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/group/create`;
			requestOptions.body.name = groupName;
			if (groupParticipants) {
				requestOptions.body.participants = groupParticipants.split(',').map(p => p.trim());
			}
			break;

		case 'addParticipant':
			const addGroupId = this.getNodeParameter('groupId', itemIndex) as string;
			const addParticipantPhone = this.getNodeParameter('participantPhone', itemIndex) as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/group/participant/add`;
			requestOptions.body.id = addGroupId;
			requestOptions.body.participants = addParticipantPhone.split(',').map(p => p.trim());
			break;

		case 'removeParticipant':
			const removeGroupId = this.getNodeParameter('groupId', itemIndex) as string;
			const removeParticipantPhone = this.getNodeParameter('participantPhone', itemIndex) as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/group/participant/remove`;
			requestOptions.body.id = removeGroupId;
			requestOptions.body.participants = removeParticipantPhone.split(',').map(p => p.trim());
			break;

		case 'promoteParticipant':
			const promoteGroupId = this.getNodeParameter('groupId', itemIndex) as string;
			const promoteParticipantPhone = this.getNodeParameter('participantPhone', itemIndex) as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/group/participant/promote`;
			requestOptions.body.id = promoteGroupId;
			requestOptions.body.participants = promoteParticipantPhone.split(',').map(p => p.trim());
			break;

		case 'demoteParticipant':
			const demoteGroupId = this.getNodeParameter('groupId', itemIndex) as string;
			const demoteParticipantPhone = this.getNodeParameter('participantPhone', itemIndex) as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/group/participant/demote`;
			requestOptions.body.id = demoteGroupId;
			requestOptions.body.participants = demoteParticipantPhone.split(',').map(p => p.trim());
			break;

		case 'leaveGroup':
			const leaveGroupId = this.getNodeParameter('groupId', itemIndex) as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/group/leave`;
			requestOptions.body.id = leaveGroupId;
			break;

		default:
			throw new NodeOperationError(this.getNode(), `Unknown group operation: ${operation}`);
	}

	const response = await this.helpers.requestWithAuthentication.call(this, 'goWhatsappApi', {
		...requestOptions,
		json: true,
	});
	return response;
};