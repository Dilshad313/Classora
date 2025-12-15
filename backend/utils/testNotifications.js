/**
 * Test script for notification system
 * Run this to test basic notification functionality
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Notification from '../models/Notification.js';
import Student from '../models/Student.js';
import Employee from '../models/Employee.js';
import { createNotificationFromTemplate } from './notificationTemplates.js';

dotenv.config();

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

async function testNotificationSystem() {
  console.log('🧪 Testing Notification System...\n');

  try {
    // Test 1: Create a basic notification
    console.log('📝 Test 1: Creating basic notification...');
    
    const basicNotification = await Notification.create({
      title: 'Test Notification',
      message: 'This is a test notification to verify the system works.',
      type: 'info',
      priority: 'medium',
      category: 'general',
      sender: new mongoose.Types.ObjectId(),
      senderName: 'Test Admin',
      targetType: 'all',
      totalRecipients: 100,
      status: 'sent',
      createdBy: new mongoose.Types.ObjectId()
    });

    console.log(`✅ Created notification: ${basicNotification._id}`);

    // Test 2: Test notification templates
    console.log('\n📝 Test 2: Testing notification templates...');
    
    const templateNotification = createNotificationFromTemplate('examSchedule', {
      examName: 'Final Examination 2024',
      examDate: 'March 15, 2024'
    });

    console.log('✅ Template notification created:', templateNotification.title);

    // Test 3: Test notification queries
    console.log('\n📝 Test 3: Testing notification queries...');
    
    const notifications = await Notification.find({ status: 'sent' }).limit(5);
    console.log(`✅ Found ${notifications.length} sent notifications`);

    // Test 4: Test notification statistics
    console.log('\n📝 Test 4: Testing notification statistics...');
    
    const stats = await Notification.getStats(basicNotification.createdBy);
    console.log('✅ Statistics:', stats[0] || { message: 'No stats available' });

    // Test 5: Test mark as read functionality
    console.log('\n📝 Test 5: Testing mark as read...');
    
    const testUserId = new mongoose.Types.ObjectId();
    await basicNotification.markAsRead(testUserId, 'Student');
    console.log('✅ Marked notification as read');

    // Test 6: Test comment functionality
    console.log('\n📝 Test 6: Testing comments...');
    
    // Enable comments first
    basicNotification.allowComments = true;
    await basicNotification.save();
    
    await basicNotification.addComment(testUserId, 'Student', 'Test Student', 'This is a test comment');
    console.log('✅ Added comment to notification');

    // Test 7: Test click tracking
    console.log('\n📝 Test 7: Testing click tracking...');
    
    await basicNotification.incrementClick();
    console.log('✅ Incremented click count');

    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    await Notification.findByIdAndDelete(basicNotification._id);
    console.log('✅ Test notification deleted');

    console.log('\n🎉 All tests passed! Notification system is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

async function testRecipientCounting() {
  console.log('\n📊 Testing recipient counting...');

  try {
    const [studentCount, employeeCount] = await Promise.all([
      Student.countDocuments({ status: 'active' }),
      Employee.countDocuments({ status: 'active' })
    ]);

    console.log(`📈 Active students: ${studentCount}`);
    console.log(`📈 Active employees: ${employeeCount}`);
    console.log(`📈 Total potential recipients: ${studentCount + employeeCount}`);

    // Test class-specific counting
    const classes = await Student.distinct('selectClass', { status: 'active' });
    console.log(`📈 Available classes: ${classes.join(', ')}`);

    for (const className of classes.slice(0, 3)) { // Test first 3 classes
      const classCount = await Student.countDocuments({
        selectClass: className,
        status: 'active'
      });
      console.log(`📈 Students in class ${className}: ${classCount}`);
    }

  } catch (error) {
    console.error('❌ Recipient counting test failed:', error);
  }
}

async function runTests() {
  await connectDB();
  await testNotificationSystem();
  await testRecipientCounting();
  
  console.log('\n✅ All tests completed!');
  process.exit(0);
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(error => {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  });
}

export { testNotificationSystem, testRecipientCounting };