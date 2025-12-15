// import cron from 'node-cron'; // Commented out for now
import Notification from '../models/Notification.js';
import NotificationRecipient from '../models/NotificationRecipient.js';
import Student from '../models/Student.js';
import Employee from '../models/Employee.js';

/**
 * Notification Scheduler Service
 * Handles scheduled notifications and delivery tracking
 */
class NotificationScheduler {
  constructor() {
    this.isRunning = false;
    this.scheduledJobs = new Map();
  }

  /**
   * Start the notification scheduler
   */
  start() {
    if (this.isRunning) {
      console.log('📅 Notification scheduler is already running');
      return;
    }

    console.log('📅 Starting notification scheduler...');

    // Check for scheduled notifications every minute
    this.schedulerJob = setInterval(async () => {
      await this.processScheduledNotifications();
    }, 60000); // 1 minute

    // Clean up expired notifications daily
    this.cleanupJob = setInterval(async () => {
      await this.cleanupExpiredNotifications();
    }, 24 * 60 * 60 * 1000); // 24 hours

    // Update delivery statistics every 5 minutes
    this.statsJob = setInterval(async () => {
      await this.updateDeliveryStats();
    }, 5 * 60 * 1000); // 5 minutes

    this.isRunning = true;
    console.log('✅ Notification scheduler started successfully');
  }

  /**
   * Stop the notification scheduler
   */
  stop() {
    if (!this.isRunning) {
      console.log('📅 Notification scheduler is not running');
      return;
    }

    console.log('📅 Stopping notification scheduler...');

    if (this.schedulerJob) {
      clearInterval(this.schedulerJob);
    }
    if (this.cleanupJob) {
      clearInterval(this.cleanupJob);
    }
    if (this.statsJob) {
      clearInterval(this.statsJob);
    }

    // Cancel all scheduled jobs
    this.scheduledJobs.forEach((job, notificationId) => {
      job.cancel();
      this.scheduledJobs.delete(notificationId);
    });

    this.isRunning = false;
    console.log('✅ Notification scheduler stopped');
  }

  /**
   * Process scheduled notifications that are due
   */
  async processScheduledNotifications() {
    try {
      const now = new Date();
      
      // Find notifications scheduled to be sent now or in the past
      const scheduledNotifications = await Notification.find({
        status: 'scheduled',
        scheduledAt: { $lte: now },
        isActive: true
      });

      if (scheduledNotifications.length === 0) {
        return;
      }

      console.log(`📤 Processing ${scheduledNotifications.length} scheduled notifications`);

      for (const notification of scheduledNotifications) {
        try {
          await this.sendNotification(notification);
        } catch (error) {
          console.error(`❌ Error sending notification ${notification._id}:`, error);
          
          // Mark as failed
          notification.status = 'failed';
          await notification.save();
        }
      }
    } catch (error) {
      console.error('❌ Error processing scheduled notifications:', error);
    }
  }

  /**
   * Send a notification to its recipients
   */
  async sendNotification(notification) {
    console.log(`📤 Sending notification: ${notification.title}`);

    try {
      // Get recipients based on target type
      const recipients = await this.getNotificationRecipients(notification);

      if (recipients.length === 0) {
        console.log(`⚠️ No recipients found for notification ${notification._id}`);
        notification.status = 'sent';
        notification.deliveredCount = 0;
        await notification.save();
        return;
      }

      // Create recipient records for tracking
      const recipientRecords = recipients.map(recipient => ({
        notification: notification._id,
        recipient: recipient._id,
        recipientModel: recipient.model,
        recipientName: recipient.name,
        recipientEmail: recipient.email,
        recipientPhone: recipient.phone,
        deliveryStatus: 'delivered', // In real implementation, this would be 'pending'
        deliveredAt: new Date()
      }));

      // Bulk insert recipient records
      await NotificationRecipient.insertMany(recipientRecords);

      // Update notification status
      notification.status = 'sent';
      notification.deliveredCount = recipients.length;
      notification.totalRecipients = recipients.length;
      await notification.save();

      console.log(`✅ Notification sent to ${recipients.length} recipients`);

      // In a real implementation, you would integrate with:
      // - Email service (SendGrid, AWS SES, etc.)
      // - SMS service (Twilio, AWS SNS, etc.)
      // - Push notification service (Firebase, OneSignal, etc.)
      // - In-app notification system

    } catch (error) {
      console.error(`❌ Error sending notification ${notification._id}:`, error);
      throw error;
    }
  }

  /**
   * Get recipients for a notification based on target type
   */
  async getNotificationRecipients(notification) {
    const recipients = [];

    try {
      switch (notification.targetType) {
        case 'all':
          // Get all active students and employees
          const [students, employees] = await Promise.all([
            Student.find({ status: 'active' }).select('studentName mobileNo selectClass section'),
            Employee.find({ status: 'active' }).select('employeeName mobileNo employeeRole department')
          ]);

          recipients.push(
            ...students.map(student => ({
              _id: student._id,
              model: 'Student',
              name: student.studentName,
              email: null, // Add email field to Student model if needed
              phone: student.mobileNo,
              class: student.selectClass,
              section: student.section
            })),
            ...employees.map(employee => ({
              _id: employee._id,
              model: 'Employee',
              name: employee.employeeName,
              email: null, // Add email field to Employee model if needed
              phone: employee.mobileNo,
              role: employee.employeeRole,
              department: employee.department
            }))
          );
          break;

        case 'students':
          const allStudents = await Student.find({ status: 'active' })
            .select('studentName mobileNo selectClass section');
          
          recipients.push(...allStudents.map(student => ({
            _id: student._id,
            model: 'Student',
            name: student.studentName,
            email: null,
            phone: student.mobileNo,
            class: student.selectClass,
            section: student.section
          })));
          break;

        case 'employees':
          const allEmployees = await Employee.find({ status: 'active' })
            .select('employeeName mobileNo employeeRole department');
          
          recipients.push(...allEmployees.map(employee => ({
            _id: employee._id,
            model: 'Employee',
            name: employee.employeeName,
            email: null,
            phone: employee.mobileNo,
            role: employee.employeeRole,
            department: employee.department
          })));
          break;

        case 'teachers':
          const teachers = await Employee.find({
            status: 'active',
            employeeRole: { $regex: 'teacher', $options: 'i' }
          }).select('employeeName mobileNo employeeRole department');
          
          recipients.push(...teachers.map(teacher => ({
            _id: teacher._id,
            model: 'Employee',
            name: teacher.employeeName,
            email: null,
            phone: teacher.mobileNo,
            role: teacher.employeeRole,
            department: teacher.department
          })));
          break;

        case 'staff':
          const staff = await Employee.find({
            status: 'active',
            employeeRole: { $not: { $regex: 'teacher', $options: 'i' } }
          }).select('employeeName mobileNo employeeRole department');
          
          recipients.push(...staff.map(employee => ({
            _id: employee._id,
            model: 'Employee',
            name: employee.employeeName,
            email: null,
            phone: employee.mobileNo,
            role: employee.employeeRole,
            department: employee.department
          })));
          break;

        case 'specific_class':
          const classStudents = await Student.find({
            selectClass: notification.targetClass,
            section: notification.targetSection,
            status: 'active'
          }).select('studentName mobileNo selectClass section');
          
          recipients.push(...classStudents.map(student => ({
            _id: student._id,
            model: 'Student',
            name: student.studentName,
            email: null,
            phone: student.mobileNo,
            class: student.selectClass,
            section: student.section
          })));
          break;

        case 'specific_users':
          // Get specific users from the notification's specificUsers array
          for (const specificUser of notification.specificUsers) {
            let user = null;
            
            if (specificUser.userModel === 'Student') {
              user = await Student.findById(specificUser.user)
                .select('studentName mobileNo selectClass section');
              
              if (user) {
                recipients.push({
                  _id: user._id,
                  model: 'Student',
                  name: user.studentName,
                  email: null,
                  phone: user.mobileNo,
                  class: user.selectClass,
                  section: user.section
                });
              }
            } else if (specificUser.userModel === 'Employee') {
              user = await Employee.findById(specificUser.user)
                .select('employeeName mobileNo employeeRole department');
              
              if (user) {
                recipients.push({
                  _id: user._id,
                  model: 'Employee',
                  name: user.employeeName,
                  email: null,
                  phone: user.mobileNo,
                  role: user.employeeRole,
                  department: user.department
                });
              }
            }
          }
          break;

        default:
          console.warn(`⚠️ Unknown target type: ${notification.targetType}`);
      }

      return recipients;
    } catch (error) {
      console.error('❌ Error getting notification recipients:', error);
      throw error;
    }
  }

  /**
   * Clean up expired notifications
   */
  async cleanupExpiredNotifications() {
    try {
      console.log('🧹 Cleaning up expired notifications...');

      const now = new Date();
      
      // Mark expired notifications as inactive
      const result = await Notification.updateMany(
        {
          expiresAt: { $lt: now },
          isActive: true
        },
        {
          $set: { isActive: false }
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`🧹 Marked ${result.modifiedCount} notifications as expired`);
      }

      // Clean up old notification recipients (older than 90 days)
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const cleanupResult = await NotificationRecipient.deleteMany({
        createdAt: { $lt: ninetyDaysAgo }
      });

      if (cleanupResult.deletedCount > 0) {
        console.log(`🧹 Cleaned up ${cleanupResult.deletedCount} old recipient records`);
      }

    } catch (error) {
      console.error('❌ Error cleaning up expired notifications:', error);
    }
  }

  /**
   * Update delivery statistics for notifications
   */
  async updateDeliveryStats() {
    try {
      // This would be used to sync with external delivery services
      // and update delivery/read statistics
      console.log('📊 Updating delivery statistics...');

      // In a real implementation, you would:
      // 1. Query external services for delivery status
      // 2. Update NotificationRecipient records
      // 3. Aggregate stats and update Notification records

    } catch (error) {
      console.error('❌ Error updating delivery stats:', error);
    }
  }

  /**
   * Schedule a specific notification
   */
  async scheduleNotification(notification) {
    if (notification.scheduleType !== 'scheduled' || !notification.scheduledAt) {
      return;
    }

    const scheduledTime = new Date(notification.scheduledAt);
    const now = new Date();

    if (scheduledTime <= now) {
      // Send immediately if scheduled time has passed
      await this.sendNotification(notification);
      return;
    }

    // Calculate delay in milliseconds
    const delay = scheduledTime.getTime() - now.getTime();

    // Schedule the notification
    const timeoutId = setTimeout(async () => {
      try {
        await this.sendNotification(notification);
        this.scheduledJobs.delete(notification._id.toString());
      } catch (error) {
        console.error(`❌ Error sending scheduled notification ${notification._id}:`, error);
      }
    }, delay);

    // Store the timeout ID for potential cancellation
    this.scheduledJobs.set(notification._id.toString(), {
      timeoutId,
      scheduledAt: scheduledTime,
      cancel: () => clearTimeout(timeoutId)
    });

    console.log(`📅 Notification ${notification._id} scheduled for ${scheduledTime}`);
  }

  /**
   * Cancel a scheduled notification
   */
  cancelScheduledNotification(notificationId) {
    const job = this.scheduledJobs.get(notificationId.toString());
    if (job) {
      job.cancel();
      this.scheduledJobs.delete(notificationId.toString());
      console.log(`❌ Cancelled scheduled notification ${notificationId}`);
    }
  }
}

// Create singleton instance
const notificationScheduler = new NotificationScheduler();

export default notificationScheduler;