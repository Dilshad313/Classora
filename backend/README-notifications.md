# Notification System

A comprehensive notification system for the school management platform that enables administrators to send targeted notifications to students, employees, and other users.

## Features

### Core Functionality
- ✅ Create and manage notifications
- ✅ Multiple target types (all users, students, employees, specific classes, individuals)
- ✅ Rich content support with attachments
- ✅ Scheduled notifications
- ✅ Notification templates for common use cases
- ✅ Read receipts and delivery tracking
- ✅ Comments and interactions
- ✅ Priority levels and categories
- ✅ Expiration dates
- ✅ Pin important notifications

### Admin Features
- ✅ Full CRUD operations for notifications
- ✅ Bulk operations (send, cancel, delete)
- ✅ Advanced filtering and search
- ✅ Comprehensive analytics and statistics
- ✅ Template management
- ✅ Recipient management
- ✅ File attachment support

### User Features
- ✅ View personalized notifications
- ✅ Mark notifications as read
- ✅ Add comments (if enabled)
- ✅ Track notification interactions
- ✅ Filter by category, priority, read status
- ✅ Search functionality

### Technical Features
- ✅ RESTful API design
- ✅ MongoDB with Mongoose ODM
- ✅ File upload with Cloudinary integration
- ✅ JWT authentication
- ✅ Input validation and sanitization
- ✅ Error handling and logging
- ✅ Pagination and sorting
- ✅ Background job processing
- ✅ Rate limiting

## File Structure

```
backend/
├── models/
│   ├── Notification.js              # Main notification model
│   └── NotificationRecipient.js     # Delivery tracking model
├── controllers/
│   ├── notificationController.js    # Admin notification controller
│   └── userNotificationController.js # User notification controller
├── routes/
│   ├── notificationRoutes.js        # Admin notification routes
│   └── userNotificationRoutes.js    # User notification routes
├── utils/
│   ├── notificationScheduler.js     # Background job scheduler
│   ├── notificationTemplates.js     # Predefined templates
│   └── testNotifications.js         # Test utilities
└── docs/
    └── notification-api.md           # API documentation
```

## Installation

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**
   Ensure these variables are set in your `.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/school-management
   JWT_SECRET=your-jwt-secret
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-key
   CLOUDINARY_API_SECRET=your-cloudinary-secret
   ```

3. **Start the Server**
   ```bash
   npm start
   ```

## API Endpoints

### Admin Endpoints (`/api/notifications`)
- `GET /` - Get all notifications
- `POST /` - Create notification
- `GET /:id` - Get single notification
- `PUT /:id` - Update notification
- `DELETE /:id` - Delete notification
- `POST /:id/send` - Send scheduled notification
- `POST /:id/cancel` - Cancel scheduled notification
- `POST /:id/pin` - Toggle pin status
- `GET /stats` - Get statistics
- `GET /recipients` - Get available recipients
- `GET /templates` - Get notification templates
- `POST /from-template` - Create from template

### User Endpoints (`/api/user-notifications`)
- `GET /` - Get user notifications
- `GET /:id` - Get single notification (marks as read)
- `POST /:id/read` - Mark as read
- `POST /read-all` - Mark all as read
- `POST /:id/comments` - Add comment
- `POST /:id/click` - Track click
- `GET /stats` - Get user statistics

## Usage Examples

### Creating a Basic Notification

```javascript
const notification = {
  title: "Exam Schedule Released",
  message: "The final examination schedule has been released. Please check your timetable.",
  type: "info",
  priority: "high",
  category: "exam",
  targetType: "students",
  targetClass: "10",
  actionButton: {
    text: "View Schedule",
    url: "/exam-schedule",
    action: "redirect"
  }
};

// POST /api/notifications
```

### Using Templates

```javascript
const templateNotification = {
  templateName: "feeReminder",
  variables: {
    amount: "5000",
    dueDate: "January 31, 2024"
  },
  targetType: "specific_class",
  targetClass: "10",
  targetSection: "A"
};

// POST /api/notifications/from-template
```

### Scheduling Notifications

```javascript
const scheduledNotification = {
  title: "Exam Tomorrow",
  message: "Don't forget about your mathematics exam tomorrow at 9:00 AM.",
  scheduleType: "scheduled",
  scheduledAt: "2024-01-20T08:00:00Z",
  targetType: "specific_class",
  targetClass: "10"
};
```

## Available Templates

The system includes predefined templates for common scenarios:

- **Academic**: `examSchedule`, `examResults`, `homeworkAssigned`, `classScheduleChange`
- **Fees**: `feeReminder`, `feeOverdue`, `feeReceived`
- **Attendance**: `lowAttendance`, `attendanceReport`
- **Events**: `schoolEvent`, `holidayAnnouncement`
- **Meetings**: `parentMeeting`, `staffMeeting`
- **General**: `systemMaintenance`, `welcomeMessage`, `certificateReady`
- **Emergency**: `emergencyAlert`, `weatherAlert`

## Target Types

- `all` - All users (students + employees)
- `students` - All active students
- `employees` - All active employees
- `teachers` - Only teaching staff
- `staff` - Only non-teaching staff
- `specific_class` - Students of a specific class and section
- `specific_users` - Individual users by ID

## Priority Levels

- `low` - Low priority notifications
- `medium` - Standard notifications (default)
- `high` - Important notifications
- `urgent` - Critical notifications requiring immediate attention

## Categories

- `general` - General announcements
- `academic` - Academic-related notifications
- `fees` - Fee and payment related
- `attendance` - Attendance related
- `exam` - Examination related
- `event` - Events and activities
- `holiday` - Holiday announcements
- `meeting` - Meeting notifications
- `maintenance` - System maintenance

## File Attachments

Supported file types:
- **Images**: JPEG, PNG, GIF, WebP
- **Documents**: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
- **Text**: TXT, CSV

Limits:
- Maximum 5 files per notification
- 10MB per file
- 50MB total per request

## Testing

Run the test suite to verify functionality:

```bash
node backend/utils/testNotifications.js
```

This will test:
- Basic notification creation
- Template functionality
- Database queries
- Statistics generation
- Read tracking
- Comment system
- Click tracking

## Background Jobs

The notification scheduler handles:
- **Scheduled Notifications**: Automatically sends notifications at scheduled times
- **Cleanup**: Removes expired notifications and old data
- **Statistics**: Updates delivery and read statistics
- **Retry Logic**: Handles failed deliveries (when integrated with external services)

## Integration Points

The notification system is designed to integrate with:

### Email Services
- SendGrid
- AWS SES
- Mailgun
- SMTP servers

### SMS Services
- Twilio
- AWS SNS
- TextLocal

### Push Notifications
- Firebase Cloud Messaging
- OneSignal
- Apple Push Notification Service

### Webhooks
Real-time notifications for external systems when:
- Notifications are sent
- Users read notifications
- Users interact with notifications

## Security Features

- **Authentication**: JWT-based authentication required
- **Authorization**: Role-based access control
- **Input Validation**: Comprehensive input sanitization
- **Rate Limiting**: Prevents API abuse
- **File Upload Security**: File type and size validation
- **XSS Protection**: Content sanitization

## Performance Considerations

- **Database Indexing**: Optimized queries with proper indexes
- **Pagination**: Large result sets are paginated
- **Caching**: Template and recipient data caching
- **Background Processing**: Heavy operations run in background
- **File Storage**: Cloudinary CDN for file delivery

## Monitoring and Analytics

Track key metrics:
- Notification delivery rates
- Read rates by category/priority
- User engagement metrics
- Failed delivery reasons
- Popular notification types
- Peak usage times

## Troubleshooting

### Common Issues

1. **Notifications not sending**
   - Check notification status
   - Verify target recipients exist
   - Check scheduler is running

2. **File upload failures**
   - Verify Cloudinary configuration
   - Check file size and type limits
   - Ensure proper permissions

3. **Authentication errors**
   - Verify JWT token validity
   - Check user permissions
   - Ensure proper headers

4. **Database connection issues**
   - Check MongoDB connection
   - Verify database credentials
   - Check network connectivity

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=notification:*
```

## Future Enhancements

Planned features:
- [ ] Real-time notifications via WebSocket
- [ ] Advanced scheduling (recurring notifications)
- [ ] A/B testing for notification content
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Notification preferences per user
- [ ] Integration with calendar systems
- [ ] Advanced template editor
- [ ] Notification approval workflow
- [ ] Bulk import/export functionality

## Contributing

When contributing to the notification system:

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Ensure backward compatibility
5. Test with different user roles
6. Verify file upload functionality
7. Check performance impact

## Support

For issues or questions:
1. Check the API documentation
2. Run the test suite
3. Check server logs
4. Verify configuration
5. Contact the development team

---

The notification system is a critical component of the school management platform, enabling effective communication between administrators, teachers, students, and parents. It's designed to be scalable, reliable, and user-friendly while providing comprehensive functionality for all notification needs.