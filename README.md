# n8n-nodes-gowa

![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

This is an n8n community node for [GOWA (Go WhatsApp Web MultiDevice)](https://github.com/aldinokemal/go-whatsapp-web-multidevice) API integration.

GOWA provides a comprehensive WhatsApp Web API implementation written in Go, supporting multi-device functionality and extensive WhatsApp features.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Usage](#usage)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

This node supports the following operations:

### App Management

* **Login** - Login to WhatsApp Web
* **Logout** - Logout from WhatsApp Web
* **Get Device Info** - Get device information
* **Reconnect** - Reconnect to WhatsApp Web

### Send Messages

* **Send Text** - Send text messages
* **Send Image** - Send images with optional caption
* **Send Audio** - Send audio files
* **Send File** - Send files/documents
* **Send Video** - Send videos with optional caption
* **Send Contact** - Send contact information
* **Send Location** - Send location coordinates
* **Send Poll** - Send polls with multiple options

### Message Management

* **Delete Message** - Delete a message
* **Revoke Message** - Revoke a message for everyone
* **React to Message** - Add emoji reactions to messages
* **Update Message** - Update message content
* **Read Message** - Mark message as read
* **Unread Message** - Mark message as unread

### Group Management

* **Create Group** - Create new WhatsApp groups
* **Add Participant** - Add participants to groups
* **Remove Participant** - Remove participants from groups
* **Promote Participant** - Promote participants to admin
* **Demote Participant** - Demote participants from admin
* **Leave Group** - Leave a group

### User Operations

* **Get User Info** - Get user profile information
* **Get Avatar** - Get user avatar image
* **Set Avatar** - Set user avatar image
* **Get Privacy Settings** - Get privacy settings
* **Check Contact** - Check if contact is on WhatsApp

## Credentials

This node requires GOWA API credentials:

1. **Host URL** - URL of your GOWA API server (default: <http://localhost:3000>)
2. **Username** - Basic auth username
3. **Password** - Basic auth password

The credentials use HTTP Basic Authentication to connect to your GOWA API instance.

## Usage

1. Set up your GOWA API server following the [official documentation](https://github.com/aldinokemal/go-whatsapp-web-multidevice)
2. Configure the GOWA API credentials in n8n
3. Add the GOWA node to your workflow
4. Select the desired resource and operation
5. Configure the required parameters for your operation

### Example: Send Text Message

1. Select **Send** as the resource
2. Select **Send Text** as the operation
3. Enter the phone number (with country code, without +)
4. Enter your message text
5. Execute the node

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [GOWA GitHub Repository](https://github.com/aldinokemal/go-whatsapp-web-multidevice)
* [GOWA API Documentation](https://github.com/aldinokemal/go-whatsapp-web-multidevice/blob/main/docs/openapi.yaml)

## License

[MIT](LICENSE.md)
