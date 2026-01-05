import {
	IExecuteFunctions,
	IHttpRequestMethods,
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
				name: 'Unfollow Newsletter',
				value: 'unfollowNewsletter',
				description: 'Unfollow a newsletter',
				action: 'Unfollow a newsletter',
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
				operation: ['unfollowNewsletter'],
			},
		},
		default: '',
		placeholder: '120363024512399999@newsletter',
		description: 'The newsletter ID to unfollow',
	},
];

export const executeNewsletterOperation: OperationExecutor = async function (
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<any> {
	const credentials = await this.getCredentials('goWhatsappApi');
	const baseUrl = credentials.hostUrl as string || 'http://localhost:3000';
	const deviceIdHeader = await getDeviceIdHeader(this);

	const requestOptions: RequestOptions = {
		method: 'POST' as IHttpRequestMethods,
		url: '',
		body: {} as any,
	};

	switch (operation) {
		case 'unfollowNewsletter':
			const newsletterId = this.getNodeParameter('newsletterId', itemIndex) as string;
			requestOptions.url = `${baseUrl.replace(/\/$/, '')}/newsletter/unfollow`;
			requestOptions.body.newsletter_id = newsletterId;
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
