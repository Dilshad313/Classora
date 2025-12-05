// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

/**
 * Get token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get all meetings with filters
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Meetings data
 */
export const getMeetings = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const url = `${API_BASE_URL}/meetings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    console.log(`🔗 Fetching meetings from: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
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
      throw new Error(result.message || 'Failed to fetch meetings');
    }
  } catch (error) {
    console.error(`❌ Failed to fetch meetings:`, error.message);
    
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
    }
    
    throw error;
  }
};

/**
 * Get meeting by ID
 * @param {string} id - Meeting ID
 * @returns {Promise<Object>} Meeting data
 */
export const getMeetingById = async (id) => {
  try {
    console.log(`🔗 Fetching meeting: ${id}`);
    
    const response = await fetch(`${API_BASE_URL}/meetings/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
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
      throw new Error(result.message || 'Failed to fetch meeting');
    }
  } catch (error) {
    console.error(`❌ Failed to fetch meeting:`, error.message);
    throw error;
  }
};

/**
 * Create new meeting
 * @param {Object} meetingData - Meeting data
 * @returns {Promise<Object>} Created meeting
 */
export const createMeeting = async (meetingData) => {
  try {
    console.log('📤 Creating meeting:', meetingData);
    
    const response = await fetch(`${API_BASE_URL}/meetings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(meetingData),
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
      throw new Error(result.message || 'Create failed');
    }

    console.log('✅ Meeting created successfully');
    return result.data;
  } catch (error) {
    console.error('❌ Error creating meeting:', error);
    throw error;
  }
};

/**
 * Update meeting
 * @param {string} id - Meeting ID
 * @param {Object} meetingData - Updated meeting data
 * @returns {Promise<Object>} Updated meeting
 */
export const updateMeeting = async (id, meetingData) => {
  try {
    console.log(`📤 Updating meeting ${id}:`, meetingData);
    
    const response = await fetch(`${API_BASE_URL}/meetings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(meetingData),
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
      throw new Error(result.message || 'Update failed');
    }

    console.log('✅ Meeting updated successfully');
    return result.data;
  } catch (error) {
    console.error('❌ Error updating meeting:', error);
    throw error;
  }
};

/**
 * Delete meeting
 * @param {string} id - Meeting ID
 * @returns {Promise<Object>} Success message
 */
export const deleteMeeting = async (id) => {
  try {
    console.log(`🗑️ Deleting meeting: ${id}`);
    
    const response = await fetch(`${API_BASE_URL}/meetings/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
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
      throw new Error(result.message || 'Delete failed');
    }

    console.log('✅ Meeting deleted successfully');
    return result;
  } catch (error) {
    console.error('❌ Error deleting meeting:', error);
    throw error;
  }
};

/**
 * Join meeting
 * @param {string} id - Meeting ID
 * @returns {Promise<Object>} Meeting details for joining
 */
export const joinMeeting = async (id) => {
  try {
    console.log(`🚪 Joining meeting: ${id}`);
    
    const response = await fetch(`${API_BASE_URL}/meetings/${id}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
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
      throw new Error(result.message || 'Join failed');
    }

    console.log('✅ Meeting joined successfully');
    return result.data;
  } catch (error) {
    console.error('❌ Error joining meeting:', error);
    throw error;
  }
};

/**
 * Get available classes for meetings
 * @returns {Promise<Array>} List of classes
 */
export const getAvailableClasses = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/meetings/available-classes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to fetch classes');
    }
  } catch (error) {
    console.error(`❌ Failed to fetch classes:`, error.message);
    throw error;
  }
};

/**
 * Get available students for meetings
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} List of students
 */
export const getAvailableStudents = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const url = `${API_BASE_URL}/meetings/available-students${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to fetch students');
    }
  } catch (error) {
    console.error(`❌ Failed to fetch students:`, error.message);
    throw error;
  }
};

/**
 * Get available teachers for meetings
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} List of teachers
 */
export const getAvailableTeachers = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const url = `${API_BASE_URL}/meetings/available-teachers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to fetch teachers');
    }
  } catch (error) {
    console.error(`❌ Failed to fetch teachers:`, error.message);
    throw error;
  }
};

// Export as API object
export const meetingApi = {
  getMeetings,
  getMeetingById,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  joinMeeting,
  getAvailableClasses,
  getAvailableStudents,
  getAvailableTeachers
};

export default meetingApi;