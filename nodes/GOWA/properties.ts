import type { INodeProperties, INodePropertyOptions } from 'n8n-workflow';

type OperationLabel = readonly [name: string, action: string, description?: string | null];

export function operationOptions(labels: Record<string, OperationLabel>): INodePropertyOptions[] {
	return Object.entries(labels).map(([value, [name, action, description = action]]) => ({
		name,
		value,
		action,
		...(description === null ? {} : { description }),
	}));
}

export function operationProperties(
	resource: string,
	operations: string[],
	properties: Record<string, Omit<INodeProperties, 'name' | 'displayOptions'>>,
): INodeProperties[] {
	return Object.entries(properties).map(([name, property]) => ({
		...property,
		name,
		displayOptions: { show: { resource: [resource], operation: operations } },
	}));
}
