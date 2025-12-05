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
      return result.data;
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
const handleFormDataApiCall = async (url, formData) => {
  try {
    const token = getAuthToken();
    
    const response = await fetch(url, {
      method: 'POST',
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

    return result.data;
  } catch (error) {
    console.error(`❌ API call failed to ${url}:`, error.message);
    throw error;
  }
};

/**
 * Get all chats
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} List of chats
 */
export const getChats = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(filters).forEach(key => {
    if (filters[key] && filters[key] !== 'all') {
      queryParams.append(key, filters[key]);
    }
  });
  
  const url = `${API_BASE_URL}/messages/chats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return handleApiCall(url, { method: 'GET' });
};

/**
 * Get chat by ID with messages
 * @param {string} id - Chat ID
 * @param {Object} options - Pagination options
 * @returns {Promise<Object>} Chat data with messages
 */
export const getChatById = async (id, options = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(options).forEach(key => {
    if (options[key]) {
      queryParams.append(key, options[key]);
    }
  });
  
  const url = `${API_BASE_URL}/messages/chats/${id}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return handleApiCall(url, { method: 'GET' });
};

/**
 * Send new message
 * @param {Object} messageData - Message data
 * @param {Array} attachments - File attachments
 * @returns {Promise<Object>} Sent message
 */
export const sendMessage = async (messageData, attachments = []) => {
  const formData = new FormData();
  
  // Append message data
  Object.keys(messageData).forEach(key => {
    if (messageData[key] !== null && messageData[key] !== undefined) {
      formData.append(key, messageData[key]);
    }
  });
  
  // Append attachments
  attachments.forEach(file => {
    formData.append('attachments', file);
  });

  return handleFormDataApiCall(`${API_BASE_URL}/messages/send`, formData);
};

/**
 * Delete chat
 * @param {string} id - Chat ID
 * @returns {Promise<Object>} Success message
 */
export const deleteChat = async (id) => {
  return handleApiCall(`${API_BASE_URL}/messages/chats/${id}`, { method: 'DELETE' });
};

/**
 * Mark chat as read
 * @param {string} id - Chat ID
 * @returns {Promise<Object>} Success message
 */
export const markChatAsRead = async (id) => {
  return handleApiCall(`${API_BASE_URL}/messages/chats/${id}/read`, {
    method: 'POST'
  });
};

/**
 * Get recipients for new message
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
  
  const url = `${API_BASE_URL}/messages/recipients${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return handleApiCall(url, { method: 'GET' });
};

/**
 * Get message statistics
 * @returns {Promise<Object>} Message statistics
 */
export const getMessageStats = async () => {
  return handleApiCall(`${API_BASE_URL}/messages/stats`, { method: 'GET' });
};

// Export as API object
export const messageApi = {
  getChats,
  getChatById,
  sendMessage,
  deleteChat,
  markChatAsRead,
  getRecipients,
  getMessageStats
};

export default messageApi;