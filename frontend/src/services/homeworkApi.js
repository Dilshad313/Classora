// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

/**
 * Get token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Handle API calls with authentication
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
 * Handle form data API calls
 */
const handleFormDataApiCall = async (url, formData, method = 'POST') => {
  try {
    const token = getAuthToken();
    
    const response = await fetch(url, {
      method: method,
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
 * Get all homeworks with filters
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} List of homeworks
 */
export const getHomeworks = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(filters).forEach(key => {
    if (filters[key] && filters[key] !== 'all') {
      queryParams.append(key, filters[key]);
    }
  });
  
  const url = `${API_BASE_URL}/homework${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return handleApiCall(url, { method: 'GET' });
};

/**
 * Get homework by ID
 * @param {string} id - Homework ID
 * @returns {Promise<Object>} Homework data
 */
export const getHomeworkById = async (id) => {
  return handleApiCall(`${API_BASE_URL}/homework/${id}`, { method: 'GET' });
};

/**
 * Create new homework
 * @param {Object} homeworkData - Homework data
 * @returns {Promise<Object>} Created homework
 */
export const createHomework = async (homeworkData) => {
  return handleApiCall(`${API_BASE_URL}/homework`, {
    method: 'POST',
    body: JSON.stringify(homeworkData)
  });
};

/**
 * Update homework
 * @param {string} id - Homework ID
 * @param {Object} homeworkData - Updated homework data
 * @returns {Promise<Object>} Updated homework
 */
export const updateHomework = async (id, homeworkData) => {
  return handleApiCall(`${API_BASE_URL}/homework/${id}`, {
    method: 'PUT',
    body: JSON.stringify(homeworkData)
  });
};

/**
 * Delete homework
 * @param {string} id - Homework ID
 * @returns {Promise<Object>} Success message
 */
export const deleteHomework = async (id) => {
  return handleApiCall(`${API_BASE_URL}/homework/${id}`, { method: 'DELETE' });
};

/**
 * Bulk delete homeworks
 * @param {Array} ids - Array of homework IDs
 * @returns {Promise<Object>} Success message
 */
export const bulkDeleteHomeworks = async (ids) => {
  return handleApiCall(`${API_BASE_URL}/homework/bulk-delete`, {
    method: 'POST',
    body: JSON.stringify({ ids })
  });
};

/**
 * Get homework statistics
 * @returns {Promise<Object>} Homework statistics
 */
export const getHomeworkStats = async () => {
  return handleApiCall(`${API_BASE_URL}/homework/stats/summary`, { method: 'GET' });
};

/**
 * Get dropdown data (classes, teachers, subjects)
 * @returns {Promise<Object>} Dropdown data
 */
export const getDropdownData = async () => {
  return handleApiCall(`${API_BASE_URL}/homework/dropdown-data`, { method: 'GET' });
};

/**
 * Upload homework attachment
 * @param {string} id - Homework ID
 * @param {File} file - File to upload
 * @returns {Promise<Object>} Uploaded attachment
 */
export const uploadAttachment = async (id, file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return handleFormDataApiCall(`${API_BASE_URL}/homework/${id}/attachments`, formData, 'POST');
};

/**
 * Delete homework attachment
 * @param {string} id - Homework ID
 * @param {string} attachmentId - Attachment ID
 * @returns {Promise<Object>} Success message
 */
export const deleteAttachment = async (id, attachmentId) => {
  return handleApiCall(`${API_BASE_URL}/homework/${id}/attachments/${attachmentId}`, { 
    method: 'DELETE' 
  });
};

// Export as API object
export const homeworkApi = {
  getHomeworks,
  getHomeworkById,
  createHomework,
  updateHomework,
  deleteHomework,
  bulkDeleteHomeworks,
  getHomeworkStats,
  getDropdownData,
  uploadAttachment,
  deleteAttachment
};

export default homeworkApi;