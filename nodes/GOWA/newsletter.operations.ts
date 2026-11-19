import {
	IExecuteFunctions,
	INodeProperties,
	NodeOperationError,
} from 'n8n-workflow';
import { OperationExecutor, RequestOptions } from './types';
import { operationOptions, operationProperties } from './properties';
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
		options: operationOptions({
			downloadNewsletterMedia: [
				'Download Newsletter Media',
				'Download media from a newsletter message',
				'Get metadata and a URL for media saved by GOWA',
			],
			followNewsletter: ['Follow Newsletter', 'Follow a newsletter', 'Follow a WhatsApp channel'],
			getNewsletterInfo: [
				'Get Newsletter Info',
				'Get information about a newsletter',
				'Get channel metadata by ID or invite',
			],
			getNewsletterMessageUpdates: [
				'Get Newsletter Message Updates',
				'Get newsletter message counters',
				'Get reaction and forward counts after a message',
			],
			getNewsletterMessages: [
				'Get Newsletter Messages',
				'Get messages from a newsletter',
				'Get recent channel messages from WhatsApp',
			],
			listNewsletterLiveUpdates: [
				'List Live Subscriptions',
				'List newsletter live subscriptions',
				'List live channel subscriptions for this device',
			],
			searchNewsletterDirectory: [
				'Search Newsletter Directory',
				'Search the newsletter directory',
				'Search public WhatsApp channels by name',
			],
			subscribeNewsletterLiveUpdates: [
				'Subscribe to Live Updates',
				'Subscribe to newsletter live updates',
				'Receive channel message updates through GOWA webhooks',
			],
			unfollowNewsletter: ['Unfollow Newsletter', 'Unfollow a newsletter'],
			unsubscribeNewsletterLiveUpdates: [
				'Unsubscribe From Live Updates',
				'Unsubscribe from newsletter live updates',
				'Stop renewing a live channel subscription',
			],
		}),
		default: 'unfollowNewsletter',
	},
];

export const newsletterProperties: INodeProperties[] = [
	...operationProperties('newsletter', [
		'downloadNewsletterMedia', 'followNewsletter', 'getNewsletterMessageUpdates',
		'getNewsletterMessages', 'subscribeNewsletterLiveUpdates', 'unfollowNewsletter',
		'unsubscribeNewsletterLiveUpdates',
	], {
		newsletterId: {
			displayName: 'Newsletter ID',
			type: 'string',
			required: true,
			default: '',
			placeholder: '120363024512399999@newsletter',
			description: 'WhatsApp channel JID',
		},
	}),
	...operationProperties('newsletter', ['getNewsletterInfo'], {
		newsletterIdentifier: {
			displayName: 'Newsletter Identifier',
			type: 'string',
			required: true,
			default: '',
			description: 'Channel JID or invite code or URL',
		},
		newsletterLookupBy: {
			displayName: 'Look Up By',
			type: 'options',
			options: [
				{ name: 'Invite', value: 'invite' },
				{ name: 'Newsletter ID', value: 'newsletter_id' },
			],
			default: 'newsletter_id',
			description: 'Choose how to identify the channel',
		},
	}),
	...operationProperties('newsletter', ['getNewsletterMessages', 'getNewsletterMessageUpdates'], {
		newsletterCount: {
			displayName: 'Message Count',
			type: 'number',
			typeOptions: { minValue: 1, maxValue: 100, numberPrecision: 0 },
			default: 50,
			description: 'Maximum number of channel messages to return',
		},
	}),
	...operationProperties('newsletter', ['getNewsletterMessages'], {
		newsletterBefore: {
			displayName: 'Before Message ID',
			type: 'number',
			typeOptions: { minValue: 0, numberPrecision: 0 },
			default: 0,
			description: 'Only fetch messages before this server ID. Leave at zero to start with the newest message.',
		},
	}),
	...operationProperties('newsletter', ['getNewsletterMessageUpdates'], {
		newsletterAfter: {
			displayName: 'After Message ID',
			type: 'number',
			required: true,
			typeOptions: { minValue: 1, numberPrecision: 0 },
			default: 1,
			description: 'Start fetching counters after this server ID',
		},
		newsletterSince: {
			displayName: 'Since',
			type: 'number',
			typeOptions: { minValue: 0, numberPrecision: 0 },
			default: 0,
			description: 'Only include changes since this Unix timestamp in seconds. Leave at zero to omit this filter.',
		},
	}),
	...operationProperties('newsletter', ['downloadNewsletterMedia'], {
		newsletterServerId: {
			displayName: 'Server Message ID',
			type: 'number',
			required: true,
			typeOptions: { minValue: 1, numberPrecision: 0 },
			default: 1,
			description: 'Server ID of the channel message containing media',
		},
	}),
	...operationProperties('newsletter', ['searchNewsletterDirectory'], {
		newsletterSearch: {
			displayName: 'Search Text',
			type: 'string',
			required: true,
			default: '',
			description: 'Name or partial name of a public channel',
		},
		newsletterDirectoryCount: {
			displayName: 'Result Count',
			type: 'number',
			typeOptions: { minValue: 1, maxValue: 50, numberPrecision: 0 },
			default: 20,
			description: 'Maximum number of channels to return',
		},
		newsletterCursor: {
			displayName: 'Cursor',
			type: 'string',
			default: '',
			description: 'Cursor from the previous page of results',
		},
	}),
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
