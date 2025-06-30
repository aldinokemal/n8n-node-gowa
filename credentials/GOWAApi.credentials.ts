import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class GOWAApi implements ICredentialType {
	name = 'goWhatsappApi';
	displayName = 'GOWA API';
	documentationUrl = 'https://github.com/aldinokemal/go-whatsapp-web-multidevice';
	properties: INodeProperties[] = [
		{
			displayName: 'Host URL',
			name: 'hostUrl',
			type: 'string',
			default: 'http://localhost:3000',
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			}
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{"Basic "+($credentials.username + ":" + $credentials.password).base64Encode()}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials?.hostUrl}}',
			url: '/',
		},
	};
}
