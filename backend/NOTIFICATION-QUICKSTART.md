# Notification System - Quick Start Guide

## ✅ Installation Complete!

Your notification system is now fully installed and ready to use. All backend and frontend files have been created and integrated.

## 🚀 Getting Started

### 1. Install Dependencies (if not already done)

```bash
cd backend
npm install
```

The notification system uses these packages (already in package.json):
- `mongoose` - Database ORM
- `express` - Web framework
- `multer` - File upload handling
- `cloudinary` - File storage
- `jsonwebtoken` - Authentication
- `http-status-codes` - HTTP status codes

### 2. Start the Backend Server

```bash
cd backend
npm start
```

The server will start on port 5000 (or your configured PORT) and you should see:
```
✅ MongoDB connected successfully
📅 Starting notification scheduler...
✅ Notification scheduler started successfully
✅ Server running on port 5000
```

### 3. Test the API

#### Using cURL:

**Get all notifications:**
```bash
curl -X GET http://localhost:5000/api/notifications \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Create a notification:**
```bash
curl -X POST http://localhost:5000/api/notifications \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Notification",
    "message": "This is a test notification",
    "type": "info",
    "priority": "medium",
    "category": "general",
    "targetType": "all",
    "scheduleType": "immediate"
  }'
```

**Get notification statistics:**
```bash
curl -X GET http://localhost:5000/api/notifications/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Using Postman:

1. Import the API endpoints from `backend/docs/notification-api.md`
2. Set Authorization header: `Bearer YOUR_JWT_TOKEN`
3. Test each endpoint

### 4. Frontend Integration

The frontend is already integrated! Navigate to:
```
http://localhost:5173/dashboard/notifications
```

You should see:
- ✅ Notifications list page
- ✅ Search and filter functionality
- ✅ Create, edit, delete actions
- ✅ Pin/unpin notifications
- ✅ Send scheduled notifications
- ✅ Statistics dashboard

## 📋 Quick Test Checklist

### Backend Tests:
- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] Notification scheduler starts
- [ ] GET /api/notifications returns data
- [ ] POST /api/notifications creates notification
- [ ] GET /api/notifications/stats returns statistics
- [ ] GET /api/notifications/templates returns templates
- [ ] Authentication works (401 without token)

### Frontend Tests:
- [ ] Notifications page loads
- [ ] Search functionality works
- [ ] Filters work (status, priority, category)
- [ ] Create notification button navigates correctly
- [ ] Delete notification works
- [ ] Pin/unpin notification works
- [ ] Statistics display correctly
- [ ] Loading states show properly
- [ ] Error handling works

## 🎯 Common Use Cases

### 1. Send a Fee Reminder

```javascript
POST /api/notifications/from-template

{
  "templateName": "feeReminder",
  "variables": {
    "amount": "5000",
    "dueDate": "January 31, 2024"
  },
  "targetType": "specific_class",
  "targetClass": "10",
  "targetSection": "A",
  "scheduleType": "immediate"
}
```

### 2. Schedule an Exam Announcement

```javascript
POST /api/notifications/from-template

{
  "templateName": "examSchedule",
  "variables": {
    "examName": "Final Examination 2024",
    "examDate": "March 15, 2024"
  },
  "targetType": "students",
  "scheduleType": "scheduled",
  "scheduledAt": "2024-03-01T09:00:00Z"
}
```

### 3. Send Emergency Alert

```javascript
POST /api/notifications/from-template

{
  "templateName": "emergencyAlert",
  "variables": {
    "emergencyMessage": "School will be closed today due to heavy rain. Stay safe!"
  },
  "targetType": "all",
  "scheduleType": "immediate",
  "overrides": {
    "priority": "urgent"
  }
}
```

### 4. Create Custom Notification

```javascript
POST /api/notifications

{
  "title": "Parent-Teacher Meeting",
  "message": "Parent-Teacher meeting scheduled for all Grade 10 students on January 20th at 3:00 PM.",
  "type": "info",
  "priority": "high",
  "category": "meeting",
  "targetType": "specific_class",
  "targetClass": "10",
  "actionButton": {
    "text": "Confirm Attendance",
    "url": "/meetings/confirm",
    "action": "redirect"
  },
  "allowComments": true,
  "scheduleType": "immediate"
}
```

## 🔧 Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution:** 
- Check MONGODB_URI in .env file
- Ensure MongoDB is running
- Verify network connectivity

### Issue: "Authentication failed"
**Solution:**
- Check JWT_SECRET in .env file
- Verify token is valid and not expired
- Ensure Authorization header format: `Bearer TOKEN`

### Issue: "File upload fails"
**Solution:**
- Check Cloudinary credentials in .env
- Verify file size (max 10MB)
- Check file type is allowed

### Issue: "Notifications not appearing in frontend"
**Solution:**
- Check VITE_BACKEND_URL in frontend .env
- Verify CORS settings in backend
- Check browser console for errors
- Ensure user is authenticated

### Issue: "Scheduled notifications not sending"
**Solution:**
- Check notification scheduler is running
- Verify scheduledAt time is in future
- Check server logs for errors
- Ensure notification status is 'scheduled'

## 📊 Monitoring

### Check Notification Statistics:
```bash
curl -X GET http://localhost:5000/api/notifications/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### View Recent Notifications:
```bash
curl -X GET "http://localhost:5000/api/notifications?limit=10&sortBy=createdAt&sortOrder=desc" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Check Scheduled Notifications:
```bash
curl -X GET "http://localhost:5000/api/notifications?status=scheduled" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🎨 Customization

### Add New Template:
Edit `backend/utils/notificationTemplates.js` and add your template:

```javascript
export const notificationTemplates = {
  // ... existing templates
  
  myCustomTemplate: {
    title: 'My Custom Title',
    message: 'My custom message with {variable}',
    type: 'info',
    priority: 'medium',
    category: 'general'
  }
};
```

### Modify Notification Model:
Edit `backend/models/Notification.js` to add custom fields.

### Add Custom Endpoints:
Edit `backend/controllers/notificationController.js` and `backend/routes/notificationRoutes.js`.

## 📚 Documentation

- **API Documentation:** `backend/docs/notification-api.md`
- **System Overview:** `backend/README-notifications.md`
- **Test Script:** `backend/utils/testNotifications.js`

## 🎉 Next Steps

1. **Create your first notification** via the frontend UI
2. **Test notification templates** with different variables
3. **Schedule a notification** for future delivery
4. **Monitor statistics** to track engagement
5. **Customize templates** for your specific needs
6. **Integrate with external services** (email, SMS, push notifications)

## 💡 Tips

- Use templates for consistency
- Test with small groups first
- Monitor delivery and read rates
- Schedule important notifications in advance
- Use appropriate priority levels
- Enable comments for interactive notifications
- Pin important announcements
- Set expiration dates for time-sensitive notifications

## 🆘 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review server logs for errors
3. Check browser console for frontend errors
4. Verify all environment variables are set
5. Ensure database connection is working
6. Test API endpoints with cURL or Postman

---

**Your notification system is ready to use! Start sending notifications to your users now! 🚀**