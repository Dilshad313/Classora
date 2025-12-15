# Notification System API Documentation

## Overview

The notification system provides comprehensive functionality for creating, managing, and delivering notifications to students, employees, and other users in the school management system.

## Base URL
```
/api/notifications
```

## Authentication
All endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Admin Notification Endpoints

### 1. Get All Notifications
**GET** `/api/notifications`

Retrieve all notifications with filtering and pagination.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20)
- `status` (string, optional): Filter by status (draft, scheduled, sent, failed, cancelled)
- `category` (string, optional): Filter by category
- `priority` (string, optional): Filter by priority
- `targetType` (string, optional): Filter by target type
- `search` (string, optional): Search in title, message, sender name
- `sortBy` (string, optional): Sort field (default: createdAt)
- `sortOrder` (string, optional): Sort order (asc, desc, default: desc)

**Response:**
```json
{
  "success": true,
  "message": "Notifications retrieved successfully",
  "data": {
    "notifications": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

### 2. Get Single Notification
**GET** `/api/notifications/:id`

Retrieve a specific notification by ID.

**Response:**
```json
{
  "success": true,
  "message": "Notification retrieved successfully",
  "data": {
    "_id": "...",
    "title": "Exam Schedule Released",
    "message": "...",
    "type": "info",
    "priority": "high",
    "category": "exam",
    "status": "sent",
    "totalRecipients": 150,
    "readCount": 75,
    "deliveredCount": 150,
    "readPercentage": 50,
    "deliveryPercentage": 100,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

### 3. Create Notification
**POST** `/api/notifications`

Create a new notification.

**Request Body:**
```json
{
  "title": "Exam Schedule Released",
  "message": "The examination schedule has been released...",
  "type": "info",
  "priority": "high",
  "category": "exam",
  "targetType": "students",
  "targetClass": "10",
  "targetSection": "A",
  "specificUsers": [],
  "scheduleType": "immediate",
  "scheduledAt": null,
  "expiresAt": "2024-02-15T23:59:59Z",
  "actionButton": {
    "text": "View Schedule",
    "url": "/exam-schedule",
    "action": "redirect"
  },
  "isPinned": false,
  "allowComments": true
}
```

**File Upload:**
- Field name: `attachments`
- Max files: 5
- Max size: 10MB per file
- Allowed types: Images, PDFs, Office documents

### 4. Update Notification
**PUT** `/api/notifications/:id`

Update an existing notification (only draft and scheduled notifications can be updated).

### 5. Delete Notification
**DELETE** `/api/notifications/:id`

Delete a notification and its attachments.

### 6. Send Notification
**POST** `/api/notifications/:id/send`

Send a scheduled notification immediately.

### 7. Cancel Notification
**POST** `/api/notifications/:id/cancel`

Cancel a scheduled notification.

### 8. Toggle Pin Status
**POST** `/api/notifications/:id/pin`

Pin or unpin a notification.

### 9. Remove Attachment
**DELETE** `/api/notifications/:id/attachments/:attachmentId`

Remove a specific attachment from a notification.

### 10. Add Comment
**POST** `/api/notifications/:id/comments`

Add a comment to a notification (if comments are enabled).

**Request Body:**
```json
{
  "comment": "This is a comment"
}
```

### 11. Get Statistics
**GET** `/api/notifications/stats`

Get notification statistics for the admin.

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total": 100,
      "sent": 80,
      "scheduled": 10,
      "draft": 10,
      "totalRecipients": 5000,
      "totalReads": 3500,
      "readRate": 70
    },
    "categoryStats": [...],
    "priorityStats": [...],
    "recentActivity": [...]
  }
}
```

### 12. Get Recipients
**GET** `/api/notifications/recipients`

Get available recipients for targeting notifications.

**Query Parameters:**
- `type` (string, optional): Filter by type (students, employees, classes)
- `search` (string, optional): Search recipients
- `classFilter` (string, optional): Filter students by class

## Template Endpoints

### 13. Get All Templates
**GET** `/api/notifications/templates`

Get all available notification templates.

### 14. Get Single Template
**GET** `/api/notifications/templates/:templateName`

Get a specific notification template.

### 15. Create from Template
**POST** `/api/notifications/from-template`

Create a notification from a predefined template.

**Request Body:**
```json
{
  "templateName": "examSchedule",
  "variables": {
    "examName": "Final Examination 2024",
    "examDate": "March 15, 2024"
  },
  "targetType": "students",
  "targetClass": "10",
  "scheduleType": "immediate",
  "overrides": {
    "priority": "urgent"
  }
}
```

## User Notification Endpoints

### Base URL
```
/api/user-notifications
```

### 1. Get User Notifications
**GET** `/api/user-notifications`

Get notifications for the current user (student/employee).

**Query Parameters:**
- `page`, `limit`: Pagination
- `category`, `priority`: Filtering
- `unreadOnly` (boolean): Show only unread notifications
- `search`: Search in title/message

### 2. Get Single User Notification
**GET** `/api/user-notifications/:id`

Get a specific notification and mark it as read.

### 3. Mark as Read
**POST** `/api/user-notifications/:id/read`

Mark a notification as read.

### 4. Mark All as Read
**POST** `/api/user-notifications/read-all`

Mark all notifications as read for the current user.

### 5. Add Comment
**POST** `/api/user-notifications/:id/comments`

Add a comment to a notification (if allowed).

### 6. Track Click
**POST** `/api/user-notifications/:id/click`

Track when a user clicks on a notification action.

### 7. Get User Stats
**GET** `/api/user-notifications/stats`

Get notification statistics for the current user.

## Notification Types

- `announcement`: General announcements
- `reminder`: Reminders for tasks/events
- `alert`: Important alerts
- `info`: Informational messages
- `warning`: Warning messages
- `success`: Success confirmations
- `error`: Error notifications

## Priority Levels

- `low`: Low priority
- `medium`: Medium priority (default)
- `high`: High priority
- `urgent`: Urgent notifications

## Categories

- `general`: General notifications
- `academic`: Academic related
- `fees`: Fee related
- `attendance`: Attendance related
- `exam`: Examination related
- `event`: Events and activities
- `holiday`: Holiday announcements
- `meeting`: Meeting notifications
- `maintenance`: System maintenance

## Target Types

- `all`: All users (students + employees)
- `students`: All students
- `employees`: All employees
- `teachers`: Only teachers
- `staff`: Only non-teaching staff
- `specific_class`: Students of a specific class
- `specific_users`: Specific individual users

## Status Values

- `draft`: Draft notification
- `scheduled`: Scheduled for future delivery
- `sent`: Successfully sent
- `failed`: Failed to send
- `cancelled`: Cancelled notification

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

## Rate Limiting

API requests are rate-limited to prevent abuse:
- 100 requests per 15-minute window per IP
- Applies to all notification endpoints

## File Upload Specifications

**Supported File Types:**
- Images: JPEG, PNG, GIF, WebP
- Documents: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
- Text: TXT, CSV

**Limits:**
- Maximum file size: 10MB per file
- Maximum files per notification: 5
- Total upload size limit: 50MB per request

## Webhook Integration

The notification system supports webhooks for real-time updates:

**Webhook Events:**
- `notification.sent`: When a notification is sent
- `notification.read`: When a notification is read
- `notification.clicked`: When a notification action is clicked
- `notification.failed`: When notification delivery fails

**Webhook Payload:**
```json
{
  "event": "notification.sent",
  "timestamp": "2024-01-15T10:00:00Z",
  "data": {
    "notificationId": "...",
    "title": "...",
    "recipientCount": 150
  }
}
```

## Best Practices

1. **Use Templates**: Use predefined templates for common notification types
2. **Target Appropriately**: Be specific with targeting to avoid spam
3. **Schedule Wisely**: Schedule notifications for appropriate times
4. **Monitor Delivery**: Check delivery and read statistics regularly
5. **Handle Failures**: Implement retry logic for failed deliveries
6. **Respect Limits**: Stay within rate limits and file size restrictions
7. **Test First**: Test notifications with small groups before mass delivery

## Examples

### Creating a Fee Reminder
```javascript
const notification = {
  title: "Fee Payment Reminder",
  message: "Your monthly fee of ₹5000 is due on January 31st...",
  type: "warning",
  priority: "high",
  category: "fees",
  targetType: "specific_class",
  targetClass: "10",
  targetSection: "A",
  actionButton: {
    text: "Pay Now",
    url: "/fee-payment",
    action: "redirect"
  }
};
```

### Using a Template
```javascript
const templateNotification = {
  templateName: "feeReminder",
  variables: {
    amount: "5000",
    dueDate: "January 31, 2024"
  },
  targetType: "specific_class",
  targetClass: "10"
};
```

### Scheduling a Notification
```javascript
const scheduledNotification = {
  title: "Exam Tomorrow",
  message: "Don't forget about your exam tomorrow...",
  scheduleType: "scheduled",
  scheduledAt: "2024-01-20T08:00:00Z",
  targetType: "students"
};
```