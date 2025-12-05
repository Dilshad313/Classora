const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

/**
 * Get token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Fetch available classes for dropdown
 * @returns {Promise<Array>} Classes array
 */
export const fetchClassesForDropdown = async () => {
  try {
    console.log('🔗 Fetching classes for dropdown');
    
    const response = await fetch(`${API_BASE_URL}/subjects/list-classes`, {
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
      console.log(`✅ Retrieved ${result.data.length} classes`);
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to fetch classes');
    }
  } catch (error) {
    console.error('❌ Failed to fetch classes:', error.message);
    
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
    }
    
    // Return empty array instead of throwing error to prevent UI crash
    console.warn('⚠️ Returning empty classes array due to error:', error.message);
    return [];
  }
};

/**
 * Submit subject assignment
 * @param {Object} data - Assignment data { classId, subjects }
 * @returns {Promise<Object>} Created assignment
 */
export const submitSubjectAssignment = async (data) => {
  try {
    console.log('📤 Submitting subject assignment:', data);
    
    const response = await fetch(`${API_BASE_URL}/subjects/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        console.error('❌ Server error:', errorData);
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Submit failed');
    }

    console.log('✅ Subject assignment submitted successfully');
    return result.data;
  } catch (error) {
    console.error('❌ Error submitting assignment:', error);
    
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
    }
    
    throw error;
  }
};

/**
 * Fetch classes with assigned subjects
 * @param {string} search - Search term
 * @returns {Promise<Array>} Classes array
 */
export const fetchClassesWithSubjects = async (search = '') => {
  try {
    const url = `${API_BASE_URL}/subjects/classes${search ? `?search=${encodeURIComponent(search)}` : ''}`;
    console.log('🔗 Fetching classes with subjects from:', url);
    
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
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to fetch classes');
    }
  } catch (error) {
    console.error('❌ Failed to fetch classes:', error.message);
    
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
    }
    
    // Return empty array on error
    console.warn('⚠️ Returning empty array due to error:', error.message);
    return [];
  }
};

/**
 * Fetch subject statistics
 * @returns {Promise<Object>} Statistics object
 */
export const fetchSubjectStats = async () => {
  try {
    console.log('🔗 Fetching subject statistics');
    
    const response = await fetch(`${API_BASE_URL}/subjects/stats`, {
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
    console.error('❌ Failed to fetch statistics:', error.message);
    
    // Return default stats on error
    return {
      totalSubjects: 0,
      totalExamMarks: 0,
      avgMarks: 0,
      requiredSubjects: 0,
      optionalSubjects: 0
    };
  }
};

/**
 * Delete subject assignment
 * @param {string} id - Assignment ID
 * @returns {Promise<Object>} Deleted assignment
 */
export const deleteSubjectAssignment = async (id) => {
  try {
    console.log(`🗑️ Deleting subject assignment: ${id}`);
    
    const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
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

    console.log('✅ Subject assignment deleted successfully');
    return result.data;
  } catch (error) {
    console.error('❌ Error deleting assignment:', error);
    
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
    }
    
    throw error;
  }
};

/**
 * Get all subjects
 * @returns {Promise<Array>} Subjects array
 */
export const getAllSubjects = async () => {
  try {
    console.log('🔗 Fetching all subjects');
    
    const response = await fetch(`${API_BASE_URL}/subjects/all`, {
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
      throw new Error(result.message || 'Failed to fetch subjects');
    }
  } catch (error) {
    console.error('❌ Failed to fetch subjects:', error.message);
    
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
    }
    
    throw error;
  }
};

/**
 * Create a new subject
 * @param {Object} subjectData - Subject data
 * @returns {Promise<Object>} Created subject
 */
export const createSubject = async (subjectData) => {
  try {
    console.log('📤 Creating subject:', subjectData);
    
    const response = await fetch(`${API_BASE_URL}/subjects/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(subjectData),
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

    console.log('✅ Subject created successfully');
    return result;
  } catch (error) {
    console.error('❌ Error creating subject:', error);
    throw error;
  }
};

/**
 * Update a subject
 * @param {string} id - Subject ID
 * @param {Object} subjectData - Updated subject data
 * @returns {Promise<Object>} Updated subject
 */
export const updateSubject = async (id, subjectData) => {
  try {
    console.log(`📤 Updating subject ${id}:`, subjectData);
    
    const response = await fetch(`${API_BASE_URL}/subjects/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(subjectData),
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

    console.log('✅ Subject updated successfully');
    return result;
  } catch (error) {
    console.error('❌ Error updating subject:', error);
    throw error;
  }
};

/**
 * Delete a subject
 * @param {string} id - Subject ID
 * @returns {Promise<Object>} Deleted subject
 */
export const deleteSubject = async (id) => {
  try {
    console.log(`🗑️ Deleting subject: ${id}`);
    
    const response = await fetch(`${API_BASE_URL}/subjects/delete/${id}`, {
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

    console.log('✅ Subject deleted successfully');
    return result;
  } catch (error) {
    console.error('❌ Error deleting subject:', error);
    throw error;
  }
};

/**
 * Get subjects for a specific class
 * @param {string} classId - Class ID
 * @returns {Promise<Object>} Subjects for the class
 */
export const getSubjectsByClass = async (classId) => {
  try {
    console.log(`🔗 Fetching subjects for class: ${classId}`);
    
    const response = await fetch(`${API_BASE_URL}/subjects/by-class/${classId}`, {
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
      throw new Error(result.message || 'Failed to fetch subjects');
    }
  } catch (error) {
    console.error('❌ Failed to fetch subjects for class:', error.message);
    throw error;
  }
};

// Export as subjectApi object for consistency
export const subjectApi = {
  fetchClassesForDropdown,
  submitSubjectAssignment,
  fetchClassesWithSubjects,
  fetchSubjectStats,
  deleteSubjectAssignment,
  getAllSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  getSubjectsByClass
};

export default subjectApi;
