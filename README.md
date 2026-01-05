# n8n-nodes-gowa

[![npm version](https://badge.fury.io/js/%40aldinokemal2104%2Fn8n-nodes-gowa.svg)](https://www.npmjs.com/package/@aldinokemal2104/n8n-nodes-gowa)

![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

This is an n8n community node for [GOWA (Go WhatsApp Web MultiDevice)](https://github.com/aldinokemal/go-whatsapp-web-multidevice) API integration.

GOWA provides a comprehensive WhatsApp Web API implementation written in Go, supporting multi-device functionality and extensive WhatsApp features.

**This version (3.0.0) is compatible with GOWA API v8.**

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Usage](#usage)

## Installation

### Option 1: Install from npm (Recommended)

```bash
npm install @aldinokemal2104/n8n-nodes-gowa
```

### Option 2: Manual Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

- Open Settings > Community Nodes > Install
- Enter `@aldinokemal2104/n8n-nodes-gowa`
- Click Install

## Operations

This node supports the following operations:

### App Management

- **Get Connection Status** - Check whether the WhatsApp client is connected and logged in
- **Get Device Info** - Get device information
- **Login** - Login to WhatsApp server with QR code
- **Login with Code** - Login with pairing code
- **Logout** - Remove database and logout
- **Reconnect** - Reconnect to WhatsApp Web

### Device Management (v8)

- **List Devices** - List all registered devices with connection status
- **Add Device** - Create a new device slot for multi-device management
- **Get Device** - Get detailed information about a specific device
- **Remove Device** - Remove a device from the server
- **Login Device** - Initiate QR code login for a specific device
- **Login Device with Code** - Initiate pairing code login for a specific device
- **Logout Device** - Logout a specific device from WhatsApp
- **Reconnect Device** - Reconnect a specific device to WhatsApp
- **Get Device Status** - Get connection status of a specific device

### Send Messages

- **Send Text** - Send text messages (with optional disappearing message duration)
- **Send Link** - Send links with optional caption
- **Send Media** - Send media files (image, audio, video, or any file) with optional caption
- **Send Sticker** - Send sticker with automatic conversion to WebP format
- **Send Contact** - Send contact information
- **Send Location** - Send location coordinates
- **Send Poll** - Send polls with multiple options
- **Send Chat Presence** - Send typing indicator (start/stop)
- **Send Presence** - Send presence status (available/unavailable)

### Message Management

- **Delete Message** - Delete a message
- **Download Media** - Download media content from a message
- **Revoke Message** - Revoke a message for everyone
- **React to Message** - Add emoji reactions to messages
- **Update Message** - Update message content
- **Read Message** - Mark message as read
- **Star Message** - Star a message
- **Unstar Message** - Unstar a message

### Group Management

- **Create Group** - Create new WhatsApp groups
- **Add Participant** - Add participants to groups
- **Remove Participant** - Remove participants from groups
- **Promote Participant** - Promote participants to admin
- **Demote Participant** - Demote participants from admin
- **Leave Group** - Leave a group
- **Join Group With Link** - Join group using invite link
- **Get Participant Requests** - Get list of participant requests to join group
- **Approve Participant Request** - Approve participant request to join group
- **Reject Participant Request** - Reject participant request to join group
- **Set Group Name** - Set group name
- **Set Group Photo** - Set or remove group photo
- **Set Group Topic** - Set or remove group topic/description
- **Set Group Locked Status** - Lock/unlock group so only admins can modify group info
- **Set Group Announce Mode** - Enable/disable announce mode so only admins can send messages
- **Get Group Info** - Get information about a group
- **Get Group Participants** - Get list of participants in a group
- **Get Group Invite Link** - Get or reset group invite link
- **Export Group Participants** - Export group participants as CSV
- **Get Group Info From Link** - Get group information from an invitation link

### Chat Management

- **List Chats** - Get a list of all chat conversations
- **Get Chat Messages** - Retrieve messages from a specific chat
- **Label Chat** - Apply or remove a label from a chat conversation
- **Pin Chat** - Pin or unpin a chat in the conversation list
- **Set Disappearing Timer** - Set or disable disappearing messages for a chat

### User Operations

- **Change Push Name** - Update the display name shown to others in WhatsApp
- **Get User Info** - Get user profile information
- **Get Avatar** - Get user avatar image
- **Set Avatar** - Set user avatar image
- **Get Business Profile** - Get business profile information
- **Get Privacy Settings** - Get privacy settings
- **Get My Groups** - Get list of groups the user is in
- **Get My Newsletters** - Get list of newsletters the user follows
- **Get My Contacts** - Get list of user contacts
- **Check Contact** - Check if contact is on WhatsApp

### Newsletter Management

- **Unfollow Newsletter** - Unfollow a newsletter

## Credentials

This node requires GOWA API credentials:

1. **Host URL** - URL of your GOWA API server (default: <http://localhost:3000>)
2. **Username** - Basic auth username
3. **Password** - Basic auth password
4. **Device ID** - (Optional) Device identifier for multi-device support. Required when multiple devices are registered.

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

### Example: Send Media

1. Select **Send** as the resource
2. Select **Send Media** as the operation
3. Enter the phone number (with country code, without +)
4. Choose the media type (Image, Audio, Video, or File)
5. Choose the media source (File Upload or URL - note: Files can only be uploaded)
6. For file uploads: specify the binary property name containing the file
7. For URLs: enter the media URL
8. Optionally add a caption
9. Execute the node

### Example: Multi-Device Management

1. Select **Device** as the resource
2. Select **Add Device** to create a new device slot
3. Use **Login Device** or **Login Device with Code** to authenticate
4. Use **Get Device Status** to check connection status
5. Configure the Device ID in credentials for device-scoped operations

### Example: Get Business Profile

1. Select **User** as the resource
2. Select **Get Business Profile** as the operation
3. Enter the business phone number (with country code)
4. Execute the node

### Example: Send Chat Presence

1. Select **Send** as the resource
2. Select **Send Chat Presence** as the operation
3. Enter the phone number
4. Choose "Start Typing" or "Stop Typing" action
5. Execute the node

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [GOWA GitHub Repository](https://github.com/aldinokemal/go-whatsapp-web-multidevice)
- [GOWA API Documentation](https://github.com/aldinokemal/go-whatsapp-web-multidevice/blob/main/docs/openapi.yaml)
- [npm package](https://www.npmjs.com/package/@aldinokemal2104/n8n-nodes-gowa)

## License

[MIT](LICENSE.md)
