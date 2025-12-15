// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

/**
 * Get token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Helper function for API calls
 */
const handleApiCall = async (url, options = {}) => {
  try {
    const token = getAuthToken();
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    
    if (result.success) {
      return result;
    } else {
      throw new Error(result.message || 'API call failed');
    }
  } catch (error) {
    console.error(`❌ API call failed to ${url}:`, error.message);
    throw error;
  }
};

/**
 * Helper for form data API calls
 */
const handleFormDataApiCall = async (url, formData, method = 'POST') => {
  try {
    const token = getAuthToken();
    
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'API call failed');
    }

    return result;
  } catch (error) {
    console.error(`❌ API call failed to ${url}:`, error.message);
    throw error;
  }
};

/**
 * Get all notifications with filtering and pagination
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Notifications data with pagination
 */
export const getAllNotifications = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(filters).forEach(key => {
    if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
      queryParams.append(key, filters[key]);
    }
  });
  
  const url = `${API_BASE_URL}/notifications${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return handleApiCall(url, { method: 'GET' });
};

/**
 * Get single notification by ID
 * @param {string} id - Notification ID
 * @returns {Promise<Object>} Notification data
 */
export const getNotificationById = async (id) => {
  return handleApiCall(`${API_BASE_URL}/notifications/${id}`, { method: 'GET' });
};

/**
 * Create new notification
 * @param {Object} notificationData - Notification data
 * @param {Array} attachments - File attachments
 * @returns {Promise<Object>} Created notification
 */
export const createNotification = async (notificationData, attachments = []) => {
  const formData = new FormData();
  
  // Append notification data
  Object.keys(notificationData).forEach(key => {
    if (notificationData[key] !== null && notificationData[key] !== undefined) {
      if (typeof notificationData[key] === 'object' && !Array.isArray(notificationData[key])) {
        formData.append(key, JSON.stringify(notificationData[key]));
      } else if (Array.isArray(notificationData[key])) {
        formData.append(key, JSON.stringify(notificationData[key]));
      } else {
        formData.append(key, notificationData[key]);
      }
    }
  });
  
  // Append attachments
  attachments.forEach(file => {
    formData.append('attachments', file);
  });

  return handleFormDataApiCall(`${API_BASE_URL}/notifications`, formData);
};

/**
 * Update notification
 * @param {string} id - Notification ID
 * @param {Object} notificationData - Updated notification data
 * @param {Array} attachments - New file attachments
 * @returns {Promise<Object>} Updated notification
 */
export const updateNotification = async (id, notificationData, attachments = []) => {
  const formData = new FormData();
  
  // Append notification data
  Object.keys(notificationData).forEach(key => {
    if (notificationData[key] !== null && notificationData[key] !== undefined) {
      if (typeof notificationData[key] === 'object' && !Array.isArray(notificationData[key])) {
        formData.append(key, JSON.stringify(notificationData[key]));
      } else if (Array.isArray(notificationData[key])) {
        formData.append(key, JSON.stringify(notificationData[key]));
      } else {
        formData.append(key, notificationData[key]);
      }
    }
  });
  
  // Append new attachments
  attachments.forEach(file => {
    formData.append('attachments', file);
  });

  return handleFormDataApiCall(`${API_BASE_URL}/notifications/${id}`, formData, 'PUT');
};

/**
 * Delete notification
 * @param {string} id - Notification ID
 * @returns {Promise<Object>} Success message
 */
export const deleteNotification = async (id) => {
  return handleApiCall(`${API_BASE_URL}/notifications/${id}`, { method: 'DELETE' });
};

/**
 * Send scheduled notification immediately
 * @param {string} id - Notification ID
 * @returns {Promise<Object>} Success message
 */
export const sendNotification = async (id) => {
  return handleApiCall(`${API_BASE_URL}/notifications/${id}/send`, {
    method: 'POST'
  });
};

/**
 * Cancel scheduled notification
 * @param {string} id - Notification ID
 * @returns {Promise<Object>} Success message
 */
export const cancelNotification = async (id) => {
  return handleApiCall(`${API_BASE_URL}/notifications/${id}/cancel`, {
    method: 'POST'
  });
};

/**
 * Toggle pin status
 * @param {string} id - Notification ID
 * @returns {Promise<Object>} Success message
 */
export const togglePin = async (id) => {
  return handleApiCall(`${API_BASE_URL}/notifications/${id}/pin`, {
    method: 'POST'
  });
};

/**
 * Remove attachment from notification
 * @param {string} notificationId - Notification ID
 * @param {string} attachmentId - Attachment ID
 * @returns {Promise<Object>} Success message
 */
export const removeAttachment = async (notificationId, attachmentId) => {
  return handleApiCall(`${API_BASE_URL}/notifications/${notificationId}/attachments/${attachmentId}`, {
    method: 'DELETE'
  });
};

/**
 * Add comment to notification
 * @param {string} id - Notification ID
 * @param {string} comment - Comment text
 * @returns {Promise<Object>} Success message
 */
export const addComment = async (id, comment) => {
  return handleApiCall(`${API_BASE_URL}/notifications/${id}/comments`, {
    method: 'POST',
    body: JSON.stringify({ comment })
  });
};

/**
 * Get notification statistics
 * @returns {Promise<Object>} Notification statistics
 */
export const getNotificationStats = async () => {
  return handleApiCall(`${API_BASE_URL}/notifications/stats`, { method: 'GET' });
};

/**
 * Get available recipients for targeting
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Recipients data
 */
export const getRecipients = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(filters).forEach(key => {
    if (filters[key] && filters[key] !== 'all') {
      queryParams.append(key, filters[key]);
    }
  });
  
  const url = `${API_BASE_URL}/notifications/recipients${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return handleApiCall(url, { method: 'GET' });
};

/**
 * Get all notification templates
 * @returns {Promise<Array>} List of templates
 */
export const getNotificationTemplates = async () => {
  return handleApiCall(`${API_BASE_URL}/notifications/templates`, { method: 'GET' });
};

/**
 * Get single notification template
 * @param {string} templateName - Template name
 * @returns {Promise<Object>} Template data
 */
export const getNotificationTemplate = async (templateName) => {
  return handleApiCall(`${API_BASE_URL}/notifications/templates/${templateName}`, { method: 'GET' });
};

/**
 * Create notification from template
 * @param {Object} templateData - Template data with variables
 * @returns {Promise<Object>} Created notification
 */
export const createNotificationFromTemplate = async (templateData) => {
  return handleApiCall(`${API_BASE_URL}/notifications/from-template`, {
    method: 'POST',
    body: JSON.stringify(templateData)
  });
};

// User notification endpoints

/**
 * Get user notifications
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} User notifications
 */
export const getUserNotifications = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(filters).forEach(key => {
    if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
      queryParams.append(key, filters[key]);
    }
  });
  
  const url = `${API_BASE_URL}/user-notifications${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return handleApiCall(url, { method: 'GET' });
};

/**
 * Get single user notification
 * @param {string} id - Notification ID
 * @returns {Promise<Object>} Notification data
 */
export const getUserNotificationById = async (id) => {
  return handleApiCall(`${API_BASE_URL}/user-notifications/${id}`, { method: 'GET' });
};

/**
 * Mark notification as read
 * @param {string} id - Notification ID
 * @returns {Promise<Object>} Success message
 */
export const markNotificationAsRead = async (id) => {
  return handleApiCall(`${API_BASE_URL}/user-notifications/${id}/read`, {
    method: 'POST'
  });
};

/**
 * Mark all notifications as read
 * @returns {Promise<Object>} Success message
 */
export const markAllNotificationsAsRead = async () => {
  return handleApiCall(`${API_BASE_URL}/user-notifications/read-all`, {
    method: 'POST'
  });
};

/**
 * Add comment to user notification
 * @param {string} id - Notification ID
 * @param {string} comment - Comment text
 * @returns {Promise<Object>} Success message
 */
export const addUserComment = async (id, comment) => {
  return handleApiCall(`${API_BASE_URL}/user-notifications/${id}/comments`, {
    method: 'POST',
    body: JSON.stringify({ comment })
  });
};

/**
 * Track notification click
 * @param {string} id - Notification ID
 * @returns {Promise<Object>} Success message
 */
export const trackNotificationClick = async (id) => {
  return handleApiCall(`${API_BASE_URL}/user-notifications/${id}/click`, {
    method: 'POST'
  });
};

/**
 * Get user notification statistics
 * @returns {Promise<Object>} User notification statistics
 */
export const getUserNotificationStats = async () => {
  return handleApiCall(`${API_BASE_URL}/user-notifications/stats`, { method: 'GET' });
};

// Export as API object
export const notificationApi = {
  // Admin endpoints
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  sendNotification,
  cancelNotification,
  togglePin,
  removeAttachment,
  addComment,
  getNotificationStats,
  getRecipients,
  getNotificationTemplates,
  getNotificationTemplate,
  createNotificationFromTemplate,
  
  // User endpoints
  getUserNotifications,
  getUserNotificationById,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  addUserComment,
  trackNotificationClick,
  getUserNotificationStats
};

export default notificationApi;