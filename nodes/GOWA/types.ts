import {
	IExecuteFunctions,
	IHttpRequestMethods,
} from 'n8n-workflow';

export interface OperationExecutor {
	(this: IExecuteFunctions, operation: string, itemIndex: number): Promise<any>;
}

export interface RequestOptions {
	method: IHttpRequestMethods;
	url: string;
	body?: any;
	qs?: any;
	formData?: any;
}