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
				name: 'Approve Participant Request',
				value: 'approveParticipantRequest',
				description: 'Approve participant request to join group',
				action: 'Approve participant request to join group',
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
				name: 'Get Group Info',
				value: 'getGroupInfo',
				description: 'Get information about a group',
				action: 'Get group info',
			},
			{
				name: 'Get Group Info From Link',
				value: 'getGroupInfoFromLink',
				description: 'Get group information from invitation link',
				action: 'Get group info from link',
			},
			{
				name: 'Get Participant Requests',
				value: 'getParticipantRequests',
				description: 'Get list of participant requests to join group',
				action: 'Get list of participant requests to join group',
			},
			{
				name: 'Join Group With Link',
				value: 'joinGroupWithLink',
				description: 'Join group using invite link',
				action: 'Join group using invite link',
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
				name: 'Reject Participant Request',
				value: 'rejectParticipantRequest',
				description: 'Reject participant request to join group',
				action: 'Reject participant request to join group',
			},
			{
				name: 'Remove Participant',
				value: 'removeParticipant',
				description: 'Remove participant from group',
				action: 'Remove participant from group',
			},
			{
				name: 'Set Group Announce Mode',
				value: 'setGroupAnnounce',
				description: 'Enable/disable announce mode so only admins can send messages',
				action: 'Set group announce mode',
			},
			{
				name: 'Set Group Locked Status',
				value: 'setGroupLocked',
				description: 'Lock/unlock group so only admins can modify group info',
				action: 'Set group locked status',
			},
			{
				name: 'Set Group Name',
				value: 'setGroupName',
				action: 'Set group name',
			},
			{
				name: 'Set Group Topic',
				value: 'setGroupTopic',
				description: 'Set or remove group topic/description',
				action: 'Set group topic',
			},
		],
		default: 'createGroup',
	},
];

export const groupProperties: INodeProperties[] = [
	{
		displayName: 'Group Title',
		name: 'groupTitle',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['createGroup'],
			},
		},
		default: '',
		description: 'Title for the new group',
	},
	{
		displayName: 'Group Name',
		name: 'groupName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['setGroupName'],
			},
		},
		default: '',
		description: 'New name for the group',
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
				operation: ['addParticipant', 'removeParticipant', 'promoteParticipant', 'demoteParticipant', 'leaveGroup', 'getGroupInfo', 'getParticipantRequests', 'approveParticipantRequest', 'rejectParticipantRequest', 'setGroupName', 'setGroupLocked', 'setGroupAnnounce', 'setGroupTopic'],
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
	{
		displayName: 'Participants',
		name: 'participants',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['approveParticipantRequest', 'rejectParticipantRequest'],
			},
		},
		default: '',
		placeholder: '6281234567890,6281234567891',
		description: 'Comma-separated WhatsApp IDs of participants to approve/reject',
	},
	{
		displayName: 'Group Link',
		name: 'groupLink',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['joinGroupWithLink', 'getGroupInfoFromLink'],
			},
		},
		default: '',
		placeholder: 'https://chat.whatsapp.com/whatsappKeyJoinGroup',
		description: 'WhatsApp group invite link',
	},

	{
		displayName: 'Locked',
		name: 'locked',
		type: 'boolean',
		required: true,
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['setGroupLocked'],
			},
		},
		default: true,
		description: 'Whether to lock the group (true) or unlock it (false)',
	},
	{
		displayName: 'Announce Mode',
		name: 'announce',
		type: 'boolean',
		required: true,
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['setGroupAnnounce'],
			},
		},
		default: true,
		description: 'Whether to enable announce mode (true) or disable it (false)',
	},
	{
		displayName: 'Topic',
		name: 'topic',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['setGroupTopic'],
			},
		},
		default: '',
		description: 'The group topic/description. Leave empty to remove the topic.',
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
			const groupTitle = this.getNodeParameter('groupTitle', itemIndex) as string;
			const groupParticipants = this.getNodeParameter('groupParticipants', itemIndex, '') as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/group`;
			requestOptions.body.title = groupTitle;
			if (groupParticipants) {
				requestOptions.body.participants = groupParticipants.split(',').map(p => p.trim());
			}
			break;

		case 'addParticipant':
			const addGroupId = this.getNodeParameter('groupId', itemIndex) as string;
			const addParticipantPhone = this.getNodeParameter('participantPhone', itemIndex) as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/group/participants`;
			requestOptions.body.group_id = addGroupId;
			requestOptions.body.participants = addParticipantPhone.split(',').map(p => p.trim());
			break;

		case 'removeParticipant':
			const removeGroupId = this.getNodeParameter('groupId', itemIndex) as string;
			const removeParticipantPhone = this.getNodeParameter('participantPhone', itemIndex) as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/group/participants/remove`;
			requestOptions.body.group_id = removeGroupId;
			requestOptions.body.participants = removeParticipantPhone.split(',').map(p => p.trim());
			break;

		case 'promoteParticipant':
			const promoteGroupId = this.getNodeParameter('groupId', itemIndex) as string;
			const promoteParticipantPhone = this.getNodeParameter('participantPhone', itemIndex) as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/group/participants/promote`;
			requestOptions.body.group_id = promoteGroupId;
			requestOptions.body.participants = promoteParticipantPhone.split(',').map(p => p.trim());
			break;

		case 'demoteParticipant':
			const demoteGroupId = this.getNodeParameter('groupId', itemIndex) as string;
			const demoteParticipantPhone = this.getNodeParameter('participantPhone', itemIndex) as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/group/participants/demote`;
			requestOptions.body.group_id = demoteGroupId;
			requestOptions.body.participants = demoteParticipantPhone.split(',').map(p => p.trim());
			break;

		case 'leaveGroup':
			const leaveGroupId = this.getNodeParameter('groupId', itemIndex) as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/group/leave`;
			requestOptions.body.group_id = leaveGroupId;
			break;

		case 'joinGroupWithLink':
			const groupLink = this.getNodeParameter('groupLink', itemIndex) as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/group/join-with-link`;
			requestOptions.body.link = groupLink;
			break;

		case 'getGroupInfo':
			const infoGroupId = this.getNodeParameter('groupId', itemIndex) as string;
			requestOptions.method = 'GET' as IHttpRequestMethods;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/group/info?group_id=${encodeURIComponent(infoGroupId)}`;
			delete requestOptions.body;
			break;

		case 'getGroupInfoFromLink':
			const infoGroupLink = this.getNodeParameter('groupLink', itemIndex) as string;
			requestOptions.method = 'GET' as IHttpRequestMethods;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/group/info-from-link?link=${encodeURIComponent(infoGroupLink)}`;
			delete requestOptions.body;
			break;

		case 'getParticipantRequests':
			const getRequestsGroupId = this.getNodeParameter('groupId', itemIndex) as string;
			requestOptions.method = 'GET' as IHttpRequestMethods;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/group/participant-requests?group_id=${encodeURIComponent(getRequestsGroupId)}`;
			delete requestOptions.body;
			break;

		case 'approveParticipantRequest':
			const approveGroupId = this.getNodeParameter('groupId', itemIndex) as string;
			const approveParticipants = this.getNodeParameter('participants', itemIndex) as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/group/participant-requests/approve`;
			requestOptions.body.group_id = approveGroupId;
			requestOptions.body.participants = approveParticipants.split(',').map(p => p.trim());
			break;

		case 'rejectParticipantRequest':
			const rejectGroupId = this.getNodeParameter('groupId', itemIndex) as string;
			const rejectParticipants = this.getNodeParameter('participants', itemIndex) as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/group/participant-requests/reject`;
			requestOptions.body.group_id = rejectGroupId;
			requestOptions.body.participants = rejectParticipants.split(',').map(p => p.trim());
			break;



		case 'setGroupName':
			const nameGroupId = this.getNodeParameter('groupId', itemIndex) as string;
			const newGroupName = this.getNodeParameter('groupName', itemIndex) as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/group/name`;
			requestOptions.body.group_id = nameGroupId;
			requestOptions.body.name = newGroupName;
			break;

		case 'setGroupLocked':
			const lockedGroupId = this.getNodeParameter('groupId', itemIndex) as string;
			const locked = this.getNodeParameter('locked', itemIndex) as boolean;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/group/locked`;
			requestOptions.body.group_id = lockedGroupId;
			requestOptions.body.locked = locked;
			break;

		case 'setGroupAnnounce':
			const announceGroupId = this.getNodeParameter('groupId', itemIndex) as string;
			const announce = this.getNodeParameter('announce', itemIndex) as boolean;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/group/announce`;
			requestOptions.body.group_id = announceGroupId;
			requestOptions.body.announce = announce;
			break;

		case 'setGroupTopic':
			const topicGroupId = this.getNodeParameter('groupId', itemIndex) as string;
			const topic = this.getNodeParameter('topic', itemIndex, '') as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/group/topic`;
			requestOptions.body.group_id = topicGroupId;
			requestOptions.body.topic = topic;
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
