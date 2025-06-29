import {
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';

export class GOWA implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'GOWA',
		name: 'gowa',
		icon: 'file:gowa.svg',
		group: ['messaging'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Go WhatsApp Web MultiDevice API',
		defaults: {
			name: 'GOWA',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'goWhatsappApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.hostUrl}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'App',
						value: 'app',
						description: 'App connection and device management',
					},
					{
						name: 'Group',
						value: 'group',
						description: 'Group management operations',
					},
					{
						name: 'Message',
						value: 'message',
						description: 'Message management operations',
					},
					{
						name: 'Send',
						value: 'send',
						description: 'Send messages and media',
					},
					{
						name: 'User',
						value: 'user',
						description: 'User profile and settings',
					},
				],
				default: 'send',
			},

			// APP OPERATIONS
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
						name: 'Login',
						value: 'login',
						description: 'Login to WhatsApp Web',
						action: 'Login to whats app web',
					},
					{
						name: 'Logout',
						value: 'logout',
						description: 'Logout from WhatsApp Web',
						action: 'Logout from whats app web',
					},
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
				default: 'login',
			},

			// SEND OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['send'],
					},
				},
				options: [
					{
						name: 'Send Audio',
						value: 'sendAudio',
						description: 'Send an audio file',
						action: 'Send an audio file',
					},
					{
						name: 'Send Contact',
						value: 'sendContact',
						description: 'Send a contact',
						action: 'Send a contact',
					},
					{
						name: 'Send File',
						value: 'sendFile',
						description: 'Send a file',
						action: 'Send a file',
					},
					{
						name: 'Send Image',
						value: 'sendImage',
						description: 'Send an image',
						action: 'Send an image',
					},
					{
						name: 'Send Location',
						value: 'sendLocation',
						description: 'Send a location',
						action: 'Send a location',
					},
					{
						name: 'Send Poll',
						value: 'sendPoll',
						description: 'Send a poll',
						action: 'Send a poll',
					},
					{
						name: 'Send Text',
						value: 'sendText',
						description: 'Send a text message',
						action: 'Send a text message',
					},
					{
						name: 'Send Video',
						value: 'sendVideo',
						description: 'Send a video',
						action: 'Send a video',
					},
				],
				default: 'sendText',
			},

			// MESSAGE OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['message'],
					},
				},
				options: [
					{
						name: 'Delete Message',
						value: 'deleteMessage',
						description: 'Delete a message',
						action: 'Delete a message',
					},
					{
						name: 'React to Message',
						value: 'reactMessage',
						description: 'React to a message',
						action: 'React to a message',
					},
					{
						name: 'Read Message',
						value: 'readMessage',
						description: 'Mark message as read',
						action: 'Mark message as read',
					},
					{
						name: 'Revoke Message',
						value: 'revokeMessage',
						description: 'Revoke a message',
						action: 'Revoke a message',
					},
					{
						name: 'Unread Message',
						value: 'unreadMessage',
						description: 'Mark message as unread',
						action: 'Mark message as unread',
					},
					{
						name: 'Update Message',
						value: 'updateMessage',
						description: 'Update a message',
						action: 'Update a message',
					},
				],
				default: 'deleteMessage',
			},

			// GROUP OPERATIONS
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

			// USER OPERATIONS
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

			// Common fields for sending messages
			{
				displayName: 'Phone Number',
				name: 'phoneNumber',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['send'],
						operation: ['sendText', 'sendImage', 'sendAudio', 'sendFile', 'sendVideo', 'sendContact', 'sendLocation', 'sendPoll'],
					},
				},
				default: '',
				placeholder: '628123456789',
				description: 'Phone number with country code (without +)',
			},

			// Text message fields
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['send'],
						operation: ['sendText'],
					},
				},
				default: '',
				description: 'Text message to send',
			},

			// Media fields
			{
				displayName: 'File URL',
				name: 'fileUrl',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['send'],
						operation: ['sendImage', 'sendAudio', 'sendFile', 'sendVideo'],
					},
				},
				default: '',
				description: 'URL of the file to send',
			},

			{
				displayName: 'Caption',
				name: 'caption',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['send'],
						operation: ['sendImage', 'sendVideo'],
					},
				},
				default: '',
				description: 'Caption for the media',
			},

			// Contact fields
			{
				displayName: 'Contact Name',
				name: 'contactName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['send'],
						operation: ['sendContact'],
					},
				},
				default: '',
				description: 'Name of the contact to send',
			},

			{
				displayName: 'Contact Phone',
				name: 'contactPhone',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['send'],
						operation: ['sendContact'],
					},
				},
				default: '',
				description: 'Phone number of the contact to send',
			},

			// Location fields
			{
				displayName: 'Latitude',
				name: 'latitude',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['send'],
						operation: ['sendLocation'],
					},
				},
				default: 0,
				description: 'Latitude coordinate',
			},

			{
				displayName: 'Longitude',
				name: 'longitude',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['send'],
						operation: ['sendLocation'],
					},
				},
				default: 0,
				description: 'Longitude coordinate',
			},

			// Poll fields
			{
				displayName: 'Poll Question',
				name: 'pollQuestion',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['send'],
						operation: ['sendPoll'],
					},
				},
				default: '',
				description: 'Question for the poll',
			},

			{
				displayName: 'Poll Options',
				name: 'pollOptions',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['send'],
						operation: ['sendPoll'],
					},
				},
				default: '',
				placeholder: 'Option 1, Option 2, Option 3',
				description: 'Poll options separated by commas',
			},

			// Message ID field for message operations
			{
				displayName: 'Message ID',
				name: 'messageId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['message'],
					},
				},
				default: '',
				description: 'ID of the message to operate on',
			},

			// Reaction emoji for react operation
			{
				displayName: 'Reaction',
				name: 'reaction',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['reactMessage'],
					},
				},
				default: '👍',
				description: 'Emoji reaction to add',
			},

			// Group fields
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
				description: 'Phone number of the participant',
			},

			// User fields
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
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let responseData: any;

				if (resource === 'app') {
					responseData = await executeAppOperation.call(this, operation, i);
				} else if (resource === 'send') {
					responseData = await executeSendOperation.call(this, operation, i);
				} else if (resource === 'message') {
					responseData = await executeMessageOperation.call(this, operation, i);
				} else if (resource === 'group') {
					responseData = await executeGroupOperation.call(this, operation, i);
				} else if (resource === 'user') {
					responseData = await executeUserOperation.call(this, operation, i);
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`);
				}

				if (Array.isArray(responseData)) {
					returnData.push.apply(returnData, responseData);
				} else {
					returnData.push({
						json: responseData,
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}

}

async function executeAppOperation(this: IExecuteFunctions, operation: string, itemIndex: number): Promise<any> {
	const requestOptions = {
		method: 'POST' as IHttpRequestMethods,
		url: '',
		body: {},
	};

		switch (operation) {
			case 'login':
				requestOptions.url = '/api/v1/auth/login';
				break;
			case 'logout':
				requestOptions.url = '/api/v1/auth/logout';
				break;
			case 'getDeviceInfo':
				requestOptions.method = 'GET' as IHttpRequestMethods;
				requestOptions.url = '/api/v1/app/device';
				break;
			case 'reconnect':
				requestOptions.url = '/api/v1/app/reconnect';
				break;
			default:
				throw new NodeOperationError(this.getNode(), `Unknown app operation: ${operation}`);
		}

	return await this.helpers.requestWithAuthentication.call(this, 'goWhatsappApi', requestOptions);
}

async function executeSendOperation(this: IExecuteFunctions, operation: string, itemIndex: number): Promise<any> {
		const phoneNumber = this.getNodeParameter('phoneNumber', itemIndex) as string;

	const requestOptions = {
		method: 'POST' as IHttpRequestMethods,
		url: '',
		body: {
			phone: phoneNumber,
		} as any,
	};

		switch (operation) {
			case 'sendText':
				const message = this.getNodeParameter('message', itemIndex) as string;
				requestOptions.url = '/api/v1/send/text';
				requestOptions.body.message = message;
				break;

			case 'sendImage':
				const imageUrl = this.getNodeParameter('fileUrl', itemIndex) as string;
				const imageCaption = this.getNodeParameter('caption', itemIndex, '') as string;
				requestOptions.url = '/api/v1/send/image';
				requestOptions.body.image = imageUrl;
				if (imageCaption) requestOptions.body.caption = imageCaption;
				break;

			case 'sendAudio':
				const audioUrl = this.getNodeParameter('fileUrl', itemIndex) as string;
				requestOptions.url = '/api/v1/send/audio';
				requestOptions.body.audio = audioUrl;
				break;

			case 'sendFile':
				const fileUrl = this.getNodeParameter('fileUrl', itemIndex) as string;
				requestOptions.url = '/api/v1/send/file';
				requestOptions.body.file = fileUrl;
				break;

			case 'sendVideo':
				const videoUrl = this.getNodeParameter('fileUrl', itemIndex) as string;
				const videoCaption = this.getNodeParameter('caption', itemIndex, '') as string;
				requestOptions.url = '/api/v1/send/video';
				requestOptions.body.video = videoUrl;
				if (videoCaption) requestOptions.body.caption = videoCaption;
				break;

			case 'sendContact':
				const contactName = this.getNodeParameter('contactName', itemIndex) as string;
				const contactPhone = this.getNodeParameter('contactPhone', itemIndex) as string;
				requestOptions.url = '/api/v1/send/contact';
				requestOptions.body.contact_name = contactName;
				requestOptions.body.contact_phone = contactPhone;
				break;

			case 'sendLocation':
				const latitude = this.getNodeParameter('latitude', itemIndex) as number;
				const longitude = this.getNodeParameter('longitude', itemIndex) as number;
				requestOptions.url = '/api/v1/send/location';
				requestOptions.body.latitude = latitude;
				requestOptions.body.longitude = longitude;
				break;

			case 'sendPoll':
				const pollQuestion = this.getNodeParameter('pollQuestion', itemIndex) as string;
				const pollOptionsStr = this.getNodeParameter('pollOptions', itemIndex) as string;
				const pollOptions = pollOptionsStr.split(',').map(opt => opt.trim());
				requestOptions.url = '/api/v1/send/poll';
				requestOptions.body.question = pollQuestion;
				requestOptions.body.options = pollOptions;
				break;

			default:
				throw new NodeOperationError(this.getNode(), `Unknown send operation: ${operation}`);
		}

	return await this.helpers.requestWithAuthentication.call(this, 'goWhatsappApi', requestOptions);
}

async function executeMessageOperation(this: IExecuteFunctions, operation: string, itemIndex: number): Promise<any> {
		const messageId = this.getNodeParameter('messageId', itemIndex) as string;

	const requestOptions = {
		method: 'POST' as IHttpRequestMethods,
		url: '',
		body: {
			message_id: messageId,
		} as any,
	};

		switch (operation) {
			case 'deleteMessage':
				requestOptions.url = '/api/v1/message/delete';
				break;
			case 'revokeMessage':
				requestOptions.url = '/api/v1/message/revoke';
				break;
			case 'reactMessage':
				const reaction = this.getNodeParameter('reaction', itemIndex) as string;
				requestOptions.url = '/api/v1/message/react';
				requestOptions.body.emoji = reaction;
				break;
			case 'updateMessage':
				requestOptions.url = '/api/v1/message/update';
				break;
			case 'readMessage':
				requestOptions.url = '/api/v1/message/read';
				break;
			case 'unreadMessage':
				requestOptions.url = '/api/v1/message/unread';
				break;
			default:
				throw new NodeOperationError(this.getNode(), `Unknown message operation: ${operation}`);
		}

	return await this.helpers.requestWithAuthentication.call(this, 'goWhatsappApi', requestOptions);
}

async function executeGroupOperation(this: IExecuteFunctions, operation: string, itemIndex: number): Promise<any> {
	const requestOptions = {
		method: 'POST' as IHttpRequestMethods,
		url: '',
		body: {} as any,
	};

		switch (operation) {
			case 'createGroup':
				const groupName = this.getNodeParameter('groupName', itemIndex) as string;
				requestOptions.url = '/api/v1/group/create';
				requestOptions.body.name = groupName;
				break;

			case 'addParticipant':
				const addGroupId = this.getNodeParameter('groupId', itemIndex) as string;
				const addParticipantPhone = this.getNodeParameter('participantPhone', itemIndex) as string;
				requestOptions.url = '/api/v1/group/participants/add';
				requestOptions.body.group_id = addGroupId;
				requestOptions.body.phone = addParticipantPhone;
				break;

			case 'removeParticipant':
				const removeGroupId = this.getNodeParameter('groupId', itemIndex) as string;
				const removeParticipantPhone = this.getNodeParameter('participantPhone', itemIndex) as string;
				requestOptions.url = '/api/v1/group/participants/remove';
				requestOptions.body.group_id = removeGroupId;
				requestOptions.body.phone = removeParticipantPhone;
				break;

			case 'promoteParticipant':
				const promoteGroupId = this.getNodeParameter('groupId', itemIndex) as string;
				const promoteParticipantPhone = this.getNodeParameter('participantPhone', itemIndex) as string;
				requestOptions.url = '/api/v1/group/participants/promote';
				requestOptions.body.group_id = promoteGroupId;
				requestOptions.body.phone = promoteParticipantPhone;
				break;

			case 'demoteParticipant':
				const demoteGroupId = this.getNodeParameter('groupId', itemIndex) as string;
				const demoteParticipantPhone = this.getNodeParameter('participantPhone', itemIndex) as string;
				requestOptions.url = '/api/v1/group/participants/demote';
				requestOptions.body.group_id = demoteGroupId;
				requestOptions.body.phone = demoteParticipantPhone;
				break;

			case 'leaveGroup':
				const leaveGroupId = this.getNodeParameter('groupId', itemIndex) as string;
				requestOptions.url = '/api/v1/group/leave';
				requestOptions.body.group_id = leaveGroupId;
				break;

			default:
				throw new NodeOperationError(this.getNode(), `Unknown group operation: ${operation}`);
		}

	return await this.helpers.requestWithAuthentication.call(this, 'goWhatsappApi', requestOptions);
}

async function executeUserOperation(this: IExecuteFunctions, operation: string, itemIndex: number): Promise<any> {
	const requestOptions = {
		method: 'GET' as IHttpRequestMethods,
		url: '',
		qs: {} as any,
	};

		switch (operation) {
			case 'getUserInfo':
				const userInfoPhone = this.getNodeParameter('userPhone', itemIndex, '') as string;
				requestOptions.url = '/api/v1/user/info';
				if (userInfoPhone) requestOptions.qs.phone = userInfoPhone;
				break;

			case 'getAvatar':
				const avatarPhone = this.getNodeParameter('userPhone', itemIndex, '') as string;
				requestOptions.url = '/api/v1/user/avatar';
				if (avatarPhone) requestOptions.qs.phone = avatarPhone;
				break;

			case 'setAvatar':
				requestOptions.method = 'POST' as IHttpRequestMethods;
				requestOptions.url = '/api/v1/user/avatar';
				break;

			case 'getPrivacySettings':
				requestOptions.url = '/api/v1/user/privacy';
				break;

			case 'checkContact':
				const checkPhone = this.getNodeParameter('userPhone', itemIndex) as string;
				requestOptions.url = '/api/v1/user/check';
				requestOptions.qs.phone = checkPhone;
				break;

			default:
				throw new NodeOperationError(this.getNode(), `Unknown user operation: ${operation}`);
		}

	return await this.helpers.requestWithAuthentication.call(this, 'goWhatsappApi', requestOptions);
}