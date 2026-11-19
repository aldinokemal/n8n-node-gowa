import {
	IExecuteFunctions,
	INodeProperties,
	NodeOperationError,
} from 'n8n-workflow';
import { OperationExecutor, RequestOptions } from './types';
import { getDeviceIdHeader } from './app.operations';

export const newsletterOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['newsletter'],
			},
		},
		options: [
			{
				name: 'Download Newsletter Media',
				value: 'downloadNewsletterMedia',
				description: 'Get metadata and a URL for media saved by GOWA',
				action: 'Download media from a newsletter message',
			},
			{
				name: 'Follow Newsletter',
				value: 'followNewsletter',
				description: 'Follow a WhatsApp channel',
				action: 'Follow a newsletter',
			},
			{
				name: 'Get Newsletter Info',
				value: 'getNewsletterInfo',
				description: 'Get channel metadata by ID or invite',
				action: 'Get information about a newsletter',
			},
			{
				name: 'Get Newsletter Message Updates',
				value: 'getNewsletterMessageUpdates',
				description: 'Get reaction and forward counts after a message',
				action: 'Get newsletter message counters',
			},
			{
				name: 'Get Newsletter Messages',
				value: 'getNewsletterMessages',
				description: 'Get recent channel messages from WhatsApp',
				action: 'Get messages from a newsletter',
			},
			{
				name: 'List Live Subscriptions',
				value: 'listNewsletterLiveUpdates',
				description: 'List live channel subscriptions for this device',
				action: 'List newsletter live subscriptions',
			},
			{
				name: 'Search Newsletter Directory',
				value: 'searchNewsletterDirectory',
				description: 'Search public WhatsApp channels by name',
				action: 'Search the newsletter directory',
			},
			{
				name: 'Subscribe to Live Updates',
				value: 'subscribeNewsletterLiveUpdates',
				description: 'Receive channel message updates through GOWA webhooks',
				action: 'Subscribe to newsletter live updates',
			},
			{
				name: 'Unfollow Newsletter',
				value: 'unfollowNewsletter',
				description: 'Unfollow a newsletter',
				action: 'Unfollow a newsletter',
			},
			{
				name: 'Unsubscribe From Live Updates',
				value: 'unsubscribeNewsletterLiveUpdates',
				description: 'Stop renewing a live channel subscription',
				action: 'Unsubscribe from newsletter live updates',
			},
		],
		default: 'unfollowNewsletter',
	},
];

export const newsletterProperties: INodeProperties[] = [
	{
		displayName: 'Newsletter ID',
		name: 'newsletterId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['newsletter'],
				operation: [
					'downloadNewsletterMedia', 'followNewsletter', 'getNewsletterMessageUpdates',
					'getNewsletterMessages', 'subscribeNewsletterLiveUpdates', 'unfollowNewsletter',
					'unsubscribeNewsletterLiveUpdates',
				],
			},
		},
		default: '',
		placeholder: '120363024512399999@newsletter',
		description: 'WhatsApp channel JID',
	},
	{
		displayName: 'Newsletter Identifier',
		name: 'newsletterIdentifier',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['newsletter'],
				operation: ['getNewsletterInfo'],
			},
		},
		default: '',
		description: 'Channel JID or invite code or URL',
	},
	{
		displayName: 'Look Up By',
		name: 'newsletterLookupBy',
		type: 'options',
		options: [
			{ name: 'Invite', value: 'invite' },
			{ name: 'Newsletter ID', value: 'newsletter_id' },
		],
		displayOptions: {
			show: {
				resource: ['newsletter'],
				operation: ['getNewsletterInfo'],
			},
		},
		default: 'newsletter_id',
		description: 'Choose how to identify the channel',
	},
	{
		displayName: 'Message Count',
		name: 'newsletterCount',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100, numberPrecision: 0 },
		displayOptions: {
			show: {
				resource: ['newsletter'],
				operation: ['getNewsletterMessages', 'getNewsletterMessageUpdates'],
			},
		},
		default: 50,
		description: 'Maximum number of channel messages to return',
	},
	{
		displayName: 'Before Message ID',
		name: 'newsletterBefore',
		type: 'number',
		typeOptions: { minValue: 0, numberPrecision: 0 },
		displayOptions: {
			show: {
				resource: ['newsletter'],
				operation: ['getNewsletterMessages'],
			},
		},
		default: 0,
		description: 'Only fetch messages before this server ID. Leave at zero to start with the newest message.',
	},
	{
		displayName: 'After Message ID',
		name: 'newsletterAfter',
		type: 'number',
		required: true,
		typeOptions: { minValue: 1, numberPrecision: 0 },
		displayOptions: {
			show: {
				resource: ['newsletter'],
				operation: ['getNewsletterMessageUpdates'],
			},
		},
		default: 1,
		description: 'Start fetching counters after this server ID',
	},
	{
		displayName: 'Since',
		name: 'newsletterSince',
		type: 'number',
		typeOptions: { minValue: 0, numberPrecision: 0 },
		displayOptions: {
			show: {
				resource: ['newsletter'],
				operation: ['getNewsletterMessageUpdates'],
			},
		},
		default: 0,
		description: 'Only include changes since this Unix timestamp in seconds. Leave at zero to omit this filter.',
	},
	{
		displayName: 'Server Message ID',
		name: 'newsletterServerId',
		type: 'number',
		required: true,
		typeOptions: { minValue: 1, numberPrecision: 0 },
		displayOptions: {
			show: {
				resource: ['newsletter'],
				operation: ['downloadNewsletterMedia'],
			},
		},
		default: 1,
		description: 'Server ID of the channel message containing media',
	},
	{
		displayName: 'Search Text',
		name: 'newsletterSearch',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['newsletter'],
				operation: ['searchNewsletterDirectory'],
			},
		},
		default: '',
		description: 'Name or partial name of a public channel',
	},
	{
		displayName: 'Result Count',
		name: 'newsletterDirectoryCount',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 50, numberPrecision: 0 },
		displayOptions: {
			show: {
				resource: ['newsletter'],
				operation: ['searchNewsletterDirectory'],
			},
		},
		default: 20,
		description: 'Maximum number of channels to return',
	},
	{
		displayName: 'Cursor',
		name: 'newsletterCursor',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['newsletter'],
				operation: ['searchNewsletterDirectory'],
			},
		},
		default: '',
		description: 'Cursor from the previous page of results',
	},
];

export const executeNewsletterOperation: OperationExecutor = async function (
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<any> {
	const credentials = await this.getCredentials('goWhatsappApi');
	const baseUrl = String(credentials.hostUrl || 'http://localhost:3000').replace(/\/$/, '');
	const deviceIdHeader = getDeviceIdHeader(this, itemIndex, credentials);

	const requestOptions: RequestOptions = {
		method: 'GET',
		url: '',
	};

	switch (operation) {
		case 'followNewsletter':
		case 'subscribeNewsletterLiveUpdates':
		case 'unfollowNewsletter': {
			const endpoint = {
				followNewsletter: 'follow',
				subscribeNewsletterLiveUpdates: 'live-updates',
				unfollowNewsletter: 'unfollow',
			}[operation];
			requestOptions.method = 'POST';
			requestOptions.url = `${baseUrl}/newsletter/${endpoint}`;
			requestOptions.body = { newsletter_id: this.getNodeParameter('newsletterId', itemIndex) };
			break;
		}
		case 'getNewsletterInfo': {
			const lookupBy = this.getNodeParameter('newsletterLookupBy', itemIndex);
			const identifier = this.getNodeParameter('newsletterIdentifier', itemIndex);
			requestOptions.url = `${baseUrl}/newsletter/info`;
			requestOptions.qs = lookupBy === 'invite' ? { invite: identifier } : { newsletter_id: identifier };
			break;
		}
		case 'getNewsletterMessages': {
			const before = this.getNodeParameter('newsletterBefore', itemIndex, 0);
			requestOptions.url = `${baseUrl}/newsletter/messages`;
			requestOptions.qs = {
				newsletter_id: this.getNodeParameter('newsletterId', itemIndex),
				count: this.getNodeParameter('newsletterCount', itemIndex),
				...(before ? { before } : {}),
			};
			break;
		}
		case 'getNewsletterMessageUpdates': {
			const since = this.getNodeParameter('newsletterSince', itemIndex, 0);
			requestOptions.url = `${baseUrl}/newsletter/message-updates`;
			requestOptions.qs = {
				newsletter_id: this.getNodeParameter('newsletterId', itemIndex),
				after: this.getNodeParameter('newsletterAfter', itemIndex),
				count: this.getNodeParameter('newsletterCount', itemIndex),
				...(since ? { since } : {}),
			};
			break;
		}
		case 'downloadNewsletterMedia': {
			const serverId = encodeURIComponent(String(this.getNodeParameter('newsletterServerId', itemIndex)));
			requestOptions.url = `${baseUrl}/newsletter/messages/${serverId}/download`;
			requestOptions.qs = { newsletter_id: this.getNodeParameter('newsletterId', itemIndex) };
			break;
		}
		case 'searchNewsletterDirectory': {
			const cursor = this.getNodeParameter('newsletterCursor', itemIndex, '');
			requestOptions.url = `${baseUrl}/newsletter/directory`;
			requestOptions.qs = {
				search_text: this.getNodeParameter('newsletterSearch', itemIndex),
				limit: this.getNodeParameter('newsletterDirectoryCount', itemIndex),
				...(cursor ? { cursor } : {}),
			};
			break;
		}
		case 'listNewsletterLiveUpdates':
			requestOptions.url = `${baseUrl}/newsletter/live-updates`;
			break;
		case 'unsubscribeNewsletterLiveUpdates':
			requestOptions.method = 'DELETE';
			requestOptions.url = `${baseUrl}/newsletter/live-updates`;
			requestOptions.qs = { newsletter_id: this.getNodeParameter('newsletterId', itemIndex) };
			break;

		default:
			throw new NodeOperationError(this.getNode(), `Unknown newsletter operation: ${operation}`);
	}

	const response = await this.helpers.requestWithAuthentication.call(this, 'goWhatsappApi', {
		...requestOptions,
		headers: deviceIdHeader,
		json: true,
	});
	return response;
};
