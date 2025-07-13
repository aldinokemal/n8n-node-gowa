import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';

import { executeAppOperation, appOperations } from './app.operations';
import { executeSendOperation, sendOperations, sendProperties } from './send.operations';
import { executeMessageOperation, messageOperations, messageProperties } from './message.operations';
import { executeGroupOperation, groupOperations, groupProperties } from './group.operations';
import { executeUserOperation, userOperations, userProperties } from './user.operations';
import { executeChatOperation, chatOperations, chatProperties } from './chat.operations';

export class Gowa implements INodeType {
	description: INodeTypeDescription = {
		name: 'gowa',
		displayName: 'GOWA',
		icon: 'file:gowa-icon.svg',
		group: ['messaging'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
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
						name: 'Chat',
						value: 'chat',
						description: 'Chat conversations and messaging',
					},
					{
						name: 'Chatting',
						value: 'send',
						description: 'Send messages and media',
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
						name: 'User',
						value: 'user',
						description: 'User profile and settings',
					},
				],
				default: 'send',
			},
			...appOperations,
			...sendOperations,
			...sendProperties,
			...messageOperations,
			...messageProperties,
			...groupOperations,
			...groupProperties,
			...userOperations,
			...userProperties,
			...chatOperations,
			...chatProperties,
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
				} else if (resource === 'chat') {
					responseData = await executeChatOperation.call(this, operation, i);
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

