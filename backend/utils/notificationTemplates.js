/**
 * Notification Templates
 * Pre-defined templates for common notification types
 */

export const notificationTemplates = {
  // Academic notifications
  examSchedule: {
    title: 'Exam Schedule Released',
    message: 'The examination schedule for {examName} has been released. Please check your timetable and prepare accordingly.',
    type: 'info',
    priority: 'high',
    category: 'exam',
    actionButton: {
      text: 'View Schedule',
      action: 'redirect'
    }
  },

  examResults: {
    title: 'Exam Results Published',
    message: 'Results for {examName} are now available. You can view your results in the student portal.',
    type: 'success',
    priority: 'high',
    category: 'exam',
    actionButton: {
      text: 'View Results',
      action: 'redirect'
    }
  },

  homeworkAssigned: {
    title: 'New Homework Assignment',
    message: 'New homework has been assigned for {subject}. Due date: {dueDate}. Please complete and submit on time.',
    type: 'info',
    priority: 'medium',
    category: 'academic',
    actionButton: {
      text: 'View Assignment',
      action: 'redirect'
    }
  },

  classScheduleChange: {
    title: 'Class Schedule Updated',
    message: 'There has been a change in the class schedule for {className}. Please check the updated timetable.',
    type: 'warning',
    priority: 'high',
    category: 'academic',
    actionButton: {
      text: 'View Timetable',
      action: 'redirect'
    }
  },

  // Fee notifications
  feeReminder: {
    title: 'Fee Payment Reminder',
    message: 'This is a reminder that your fee payment of ₹{amount} is due on {dueDate}. Please make the payment to avoid late fees.',
    type: 'warning',
    priority: 'high',
    category: 'fees',
    actionButton: {
      text: 'Pay Now',
      action: 'redirect'
    }
  },

  feeOverdue: {
    title: 'Fee Payment Overdue',
    message: 'Your fee payment of ₹{amount} is overdue. Please make the payment immediately to avoid penalties.',
    type: 'error',
    priority: 'urgent',
    category: 'fees',
    actionButton: {
      text: 'Pay Now',
      action: 'redirect'
    }
  },

  feeReceived: {
    title: 'Fee Payment Received',
    message: 'We have received your fee payment of ₹{amount}. Receipt number: {receiptNo}. Thank you for your payment.',
    type: 'success',
    priority: 'medium',
    category: 'fees',
    actionButton: {
      text: 'Download Receipt',
      action: 'download'
    }
  },

  // Attendance notifications
  lowAttendance: {
    title: 'Low Attendance Alert',
    message: 'Your attendance is currently {percentage}%, which is below the required minimum. Please ensure regular attendance.',
    type: 'warning',
    priority: 'high',
    category: 'attendance'
  },

  attendanceReport: {
    title: 'Monthly Attendance Report',
    message: 'Your attendance report for {month} is ready. Overall attendance: {percentage}%.',
    type: 'info',
    priority: 'medium',
    category: 'attendance',
    actionButton: {
      text: 'View Report',
      action: 'redirect'
    }
  },

  // Event notifications
  schoolEvent: {
    title: 'Upcoming School Event',
    message: '{eventName} is scheduled for {eventDate}. {eventDescription}',
    type: 'info',
    priority: 'medium',
    category: 'event',
    actionButton: {
      text: 'Event Details',
      action: 'redirect'
    }
  },

  holidayAnnouncement: {
    title: 'Holiday Announcement',
    message: 'School will remain closed on {holidayDate} due to {reason}. Classes will resume on {resumeDate}.',
    type: 'info',
    priority: 'medium',
    category: 'holiday'
  },

  // Meeting notifications
  parentMeeting: {
    title: 'Parent-Teacher Meeting',
    message: 'Parent-Teacher meeting is scheduled for {meetingDate} at {meetingTime}. Your presence is requested.',
    type: 'info',
    priority: 'high',
    category: 'meeting',
    actionButton: {
      text: 'Confirm Attendance',
      action: 'redirect'
    }
  },

  staffMeeting: {
    title: 'Staff Meeting',
    message: 'Staff meeting is scheduled for {meetingDate} at {meetingTime}. Agenda: {agenda}',
    type: 'info',
    priority: 'high',
    category: 'meeting'
  },

  // General notifications
  systemMaintenance: {
    title: 'System Maintenance',
    message: 'The system will be under maintenance from {startTime} to {endTime} on {date}. Services may be temporarily unavailable.',
    type: 'warning',
    priority: 'medium',
    category: 'maintenance'
  },

  welcomeMessage: {
    title: 'Welcome to {instituteName}',
    message: 'Welcome to our school management system! We are excited to have you as part of our community.',
    type: 'success',
    priority: 'medium',
    category: 'general'
  },

  certificateReady: {
    title: 'Certificate Ready for Download',
    message: 'Your {certificateType} certificate is ready for download. Please download it from the certificates section.',
    type: 'success',
    priority: 'medium',
    category: 'general',
    actionButton: {
      text: 'Download Certificate',
      action: 'download'
    }
  },

  // Emergency notifications
  emergencyAlert: {
    title: 'Emergency Alert',
    message: '{emergencyMessage}',
    type: 'error',
    priority: 'urgent',
    category: 'general'
  },

  weatherAlert: {
    title: 'Weather Alert',
    message: 'Due to adverse weather conditions, {action}. Please stay safe and follow the instructions.',
    type: 'warning',
    priority: 'urgent',
    category: 'general'
  }
};

/**
 * Create notification from template
 * @param {string} templateName - Name of the template
 * @param {object} variables - Variables to replace in the template
 * @param {object} overrides - Fields to override in the template
 * @returns {object} Notification data
 */
export function createNotificationFromTemplate(templateName, variables = {}, overrides = {}) {
  const template = notificationTemplates[templateName];
  
  if (!template) {
    throw new Error(`Template '${templateName}' not found`);
  }

  // Clone the template
  const notification = { ...template };

  // Replace variables in title and message
  notification.title = replaceVariables(notification.title, variables);
  notification.message = replaceVariables(notification.message, variables);

  // Apply overrides
  Object.assign(notification, overrides);

  return notification;
}

/**
 * Replace variables in a string
 * @param {string} text - Text with variables in {variableName} format
 * @param {object} variables - Object with variable values
 * @returns {string} Text with variables replaced
 */
function replaceVariables(text, variables) {
  return text.replace(/\{(\w+)\}/g, (match, variableName) => {
    return variables[variableName] || match;
  });
}

/**
 * Get all available templates
 * @returns {array} Array of template names
 */
export function getAvailableTemplates() {
  return Object.keys(notificationTemplates);
}

/**
 * Get template by name
 * @param {string} templateName - Name of the template
 * @returns {object} Template object
 */
export function getTemplate(templateName) {
  return notificationTemplates[templateName];
}

/**
 * Validate template variables
 * @param {string} templateName - Name of the template
 * @param {object} variables - Variables to validate
 * @returns {object} Validation result
 */
export function validateTemplateVariables(templateName, variables) {
  const template = notificationTemplates[templateName];
  
  if (!template) {
    return { isValid: false, error: `Template '${templateName}' not found` };
  }

  // Extract required variables from template
  const titleVariables = extractVariables(template.title);
  const messageVariables = extractVariables(template.message);
  const requiredVariables = [...new Set([...titleVariables, ...messageVariables])];

  // Check if all required variables are provided
  const missingVariables = requiredVariables.filter(variable => 
    !variables.hasOwnProperty(variable)
  );

  if (missingVariables.length > 0) {
    return {
      isValid: false,
      error: `Missing required variables: ${missingVariables.join(', ')}`,
      missingVariables
    };
  }

  return { isValid: true };
}

/**
 * Extract variables from text
 * @param {string} text - Text to extract variables from
 * @returns {array} Array of variable names
 */
function extractVariables(text) {
  const matches = text.match(/\{(\w+)\}/g);
  if (!matches) return [];
  
  return matches.map(match => match.slice(1, -1)); // Remove { and }
}

export default {
  notificationTemplates,
  createNotificationFromTemplate,
  getAvailableTemplates,
  getTemplate,
  validateTemplateVariables
};