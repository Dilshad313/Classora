// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

/**
 * Get token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get all classes with filters
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Classes data
 */
export const getAllClasses = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const url = `${API_BASE_URL}/classes${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    console.log(`🔗 Fetching classes from: ${url}`);
    
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
      throw new Error(result.message || 'Failed to fetch classes');
    }
  } catch (error) {
    console.error(`❌ Failed to fetch classes:`, error.message);
    
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
    }
    
    throw error;
  }
};

/**
 * Get class by ID
 * @param {string} id - Class ID
 * @returns {Promise<Object>} Class data
 */
export const getClassById = async (id) => {
  try {
    console.log(`🔗 Fetching class: ${id}`);
    
    const response = await fetch(`${API_BASE_URL}/classes/${id}`, {
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
      throw new Error(result.message || 'Failed to fetch class');
    }
  } catch (error) {
    console.error(`❌ Failed to fetch class:`, error.message);
    throw error;
  }
};

/**
 * Create new class
 * @param {Object} classData - Class data
 * @returns {Promise<Object>} Created class
 */
export const createClass = async (classData) => {
  try {
    console.log('📤 Creating class:', classData);
    
    const response = await fetch(`${API_BASE_URL}/classes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(classData),
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

    console.log('✅ Class created successfully');
    return result.data;
  } catch (error) {
    console.error('❌ Error creating class:', error);
    throw error;
  }
};

/**
 * Update class
 * @param {string} id - Class ID
 * @param {Object} classData - Updated class data
 * @returns {Promise<Object>} Updated class
 */
export const updateClass = async (id, classData) => {
  try {
    console.log(`📤 Updating class ${id}:`, classData);
    
    const response = await fetch(`${API_BASE_URL}/classes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(classData),
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

    console.log('✅ Class updated successfully');
    return result.data;
  } catch (error) {
    console.error('❌ Error updating class:', error);
    throw error;
  }
};

/**
 * Delete class
 * @param {string} id - Class ID
 * @returns {Promise<Object>} Success message
 */
export const deleteClass = async (id) => {
  try {
    console.log(`🗑️ Deleting class: ${id}`);
    
    const response = await fetch(`${API_BASE_URL}/classes/${id}`, {
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

    console.log('✅ Class deleted successfully');
    return result;
  } catch (error) {
    console.error('❌ Error deleting class:', error);
    throw error;
  }
};

/**
 * Bulk delete classes
 * @param {Array<string>} ids - Array of class IDs
 * @returns {Promise<Object>} Success message
 */
export const bulkDeleteClasses = async (ids) => {
  try {
    console.log(`🗑️ Bulk deleting ${ids.length} classes`);
    
    const response = await fetch(`${API_BASE_URL}/classes/bulk-delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({ ids }),
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
      throw new Error(result.message || 'Bulk delete failed');
    }

    console.log('✅ Classes deleted successfully');
    return result;
  } catch (error) {
    console.error('❌ Error bulk deleting classes:', error);
    throw error;
  }
};

/**
 * Update class status
 * @param {string} id - Class ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated class
 */
export const updateClassStatus = async (id, status) => {
  try {
    console.log(`📤 Updating class ${id} status to: ${status}`);
    
    const response = await fetch(`${API_BASE_URL}/classes/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({ status }),
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
      throw new Error(result.message || 'Status update failed');
    }

    console.log('✅ Class status updated successfully');
    return result.data;
  } catch (error) {
    console.error('❌ Error updating class status:', error);
    throw error;
  }
};

/**
 * Get class statistics
 * @returns {Promise<Object>} Class statistics
 */
export const getClassStats = async () => {
  try {
    console.log('🔗 Fetching class statistics');
    
    const response = await fetch(`${API_BASE_URL}/classes/stats`, {
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
      throw new Error(result.message || 'Failed to fetch statistics');
    }
  } catch (error) {
    console.error('❌ Failed to fetch class statistics:', error.message);
    
    // Return default stats on error
    return {
      totalClasses: 0,
      activeClasses: 0,
      totalStudents: 0,
      averageStudentsPerClass: 0
    };
  }
};

/**
 * Upload class material
 * @param {FormData} formData - Form data with file
 * @returns {Promise<Object>} Upload result
 */
export const uploadClassMaterial = async (formData) => {
  try {
    console.log('📤 Uploading class material');
    
    const response = await fetch(`${API_BASE_URL}/uploads/class-material`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
        // Don't set Content-Type for FormData, browser will set it with boundary
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
      throw new Error(result.message || 'Upload failed');
    }

    console.log('✅ Class material uploaded successfully');
    return result;
  } catch (error) {
    console.error('❌ Error uploading class material:', error);
    throw error;
  }
};

/**
 * Get all class names only
 * @returns {Promise<Array<string>>} Array of class names
 */
export const getAllClassNames = async () => {
  try {
    console.log('🔗 Fetching all class names');

    const response = await fetch(`${API_BASE_URL}/classes/names`, {
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
      return result.data; // Array of class names
    } else {
      throw new Error(result.message || 'Failed to fetch class names');
    }
  } catch (error) {
    console.error(`❌ Failed to fetch class names:`, error.message);
    throw error;
  }
};

// Export as API object
export const classApi = {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  bulkDeleteClasses,
  updateClassStatus,
  getClassStats,
  uploadClassMaterial,
  getAllClassNames
};

export default classApi;
