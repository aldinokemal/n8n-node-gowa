# New WhatsApp Web API Endpoints Added to n8n Integration

This document summarizes the new endpoints that have been implemented in your n8n GOWA (Go WhatsApp Web) integration based on the OpenAPI specification you provided.

## Updated Endpoints

### Group Management Operations

#### Existing Operations (Updated to New API URLs)
1. **Add Participant** (`addParticipant`)
   - **New Endpoint**: `/group/participants` (POST)
   - **Old Endpoint**: `/group/participant/add`
   - **Request Body**: `group_id`, `participants[]`

2. **Remove Participant** (`removeParticipant`)
   - **New Endpoint**: `/group/participants/remove` (POST)
   - **Old Endpoint**: `/group/participant/remove`
   - **Request Body**: `group_id`, `participants[]`

3. **Promote Participant** (`promoteParticipant`)
   - **New Endpoint**: `/group/participants/promote` (POST)
   - **Old Endpoint**: `/group/participant/promote`
   - **Request Body**: `group_id`, `participants[]`

4. **Demote Participant** (`demoteParticipant`)
   - **New Endpoint**: `/group/participants/demote` (POST)
   - **Old Endpoint**: `/group/participant/demote`
   - **Request Body**: `group_id`, `participants[]`

5. **Leave Group** (`leaveGroup`)
   - **New Endpoint**: `/group/leave` (POST)
   - **Request Body**: `group_id` (updated from `id`)

#### New Group Operations

6. **Join Group With Link** (`joinGroupWithLink`)
   - **Endpoint**: `/group/join-with-link` (POST)
   - **Request Body**: `link`
   - **Parameters**: Group invite link (e.g., `https://chat.whatsapp.com/...`)

7. **Get Participant Requests** (`getParticipantRequests`)
   - **Endpoint**: `/group/participant-requests` (GET)
   - **Query Parameter**: `group_id`
   - **Description**: Get list of pending participant requests to join the group

8. **Approve Participant Request** (`approveParticipantRequest`)
   - **Endpoint**: `/group/participant-requests/approve` (POST)
   - **Request Body**: `group_id`, `participants[]`
   - **Description**: Approve pending participant requests

9. **Reject Participant Request** (`rejectParticipantRequest`)
   - **Endpoint**: `/group/participant-requests/reject` (POST)
   - **Request Body**: `group_id`, `participants[]`
   - **Description**: Reject pending participant requests

10. **Set Group Photo** (`setGroupPhoto`)
    - **Endpoint**: `/group/photo` (POST)
    - **Content Type**: `multipart/form-data`
    - **Parameters**: 
      - `group_id` (required)
      - `photo` (file upload or leave empty to remove)
    - **Options**: Upload file or remove existing photo

11. **Set Group Name** (`setGroupName`)
    - **Endpoint**: `/group/name` (POST)
    - **Request Body**: `group_id`, `name`
    - **Validation**: Max 25 characters

12. **Set Group Locked Status** (`setGroupLocked`)
    - **Endpoint**: `/group/locked` (POST)
    - **Request Body**: `group_id`, `locked` (boolean)
    - **Description**: Lock/unlock group so only admins can modify group info

13. **Set Group Announce Mode** (`setGroupAnnounce`)
    - **Endpoint**: `/group/announce` (POST)
    - **Request Body**: `group_id`, `announce` (boolean)
    - **Description**: Enable/disable announce mode so only admins can send messages

14. **Set Group Topic** (`setGroupTopic`)
    - **Endpoint**: `/group/topic` (POST)
    - **Request Body**: `group_id`, `topic`
    - **Description**: Set or remove group topic/description (leave topic empty to remove)

### Send Operations

#### New Send Operation

15. **Send Chat Presence** (`sendChatPresence`)
    - **Endpoint**: `/send/chat-presence` (POST)
    - **Request Body**: `phone`, `action`
    - **Action Options**: 
      - `start` - Begin typing indicator
      - `stop` - End typing indicator
    - **Description**: Send typing indicator to show that you are composing a message

## Implementation Details

### Group Operations Features
- **File Upload Support**: Group photo setting supports both file upload and photo removal
- **Batch Operations**: Participant management supports multiple participants in a single request
- **Request Management**: Full workflow for managing group join requests (list, approve, reject)
- **Group Settings**: Comprehensive group configuration (name, topic, locked status, announce mode)

### Send Operations Features
- **Typing Indicators**: Real-time typing presence to enhance user experience
- **Action Control**: Start and stop typing indicators on demand

### Technical Implementation
- All new endpoints follow the existing n8n node pattern
- Proper error handling and validation
- Support for both form data and JSON request bodies where appropriate
- Backward compatibility maintained for existing operations
- Updated to use the new API parameter names (`group_id` instead of `id`)

## Usage Examples

### Join a Group
```
Resource: Group
Operation: Join Group With Link
Group Link: https://chat.whatsapp.com/XXXXXXXXXXXXXXXXX
```

### Manage Participant Requests
```
Resource: Group
Operation: Get Participant Requests
Group ID: 120363024512399999@g.us

Resource: Group
Operation: Approve Participant Request
Group ID: 120363024512399999@g.us
Participants: 6281234567890,6281234567891
```

### Set Group Settings
```
Resource: Group
Operation: Set Group Name
Group ID: 120363024512399999@g.us
Group Name: My New Group Name

Resource: Group
Operation: Set Group Locked Status
Group ID: 120363024512399999@g.us
Locked: true
```

### Send Typing Indicator
```
Resource: Chatting
Operation: Send Chat Presence
Phone or Group ID: 6289685024051@s.whatsapp.net
Chat Presence Action: Start Typing
```

All operations include proper error handling and will return appropriate HTTP status codes (200, 400, 500) as defined in the OpenAPI specification.