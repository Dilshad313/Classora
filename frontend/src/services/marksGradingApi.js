// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

/**
 * Get token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get all grades
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} Grades array
 */
export const getAllGrades = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/marks-grading${queryString ? `?${queryString}` : ''}`;
    
    console.log(`🔗 Fetching grades from: ${url}`);
    
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
      throw new Error(result.message || 'Failed to fetch grades');
    }
  } catch (error) {
    console.error(`❌ Failed to fetch grades:`, error.message);
    
    if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
    }
    
    throw error;
  }
};

/**
 * Get grade by ID
 * @param {string} id - Grade ID
 * @returns {Promise<Object>} Grade object
 */
export const getGradeById = async (id) => {
  try {
    console.log(`🔗 Fetching grade: ${id}`);
    
    const response = await fetch(`${API_BASE_URL}/marks-grading/${id}`, {
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
      throw new Error(result.message || 'Failed to fetch grade');
    }
  } catch (error) {
    console.error(`❌ Failed to fetch grade:`, error.message);
    throw error;
  }
};

/**
 * Create new grade
 * @param {Object} gradeData - Grade data
 * @returns {Promise<Object>} Created grade
 */
export const createGrade = async (gradeData) => {
  try {
    console.log('📤 Creating new grade:', gradeData);
    const response = await fetch(`${API_BASE_URL}/marks-grading`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(gradeData)
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
    if (result.success) {
      console.log('✅ Grade created:', result.data);
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to create grade');
    }
  } catch (error) {
    console.error('❌ Error creating grade:', error);
    if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
    }
    throw error;
  }
};

/**
 * Update grade
 * @param {string} id - Grade ID
 * @param {Object} gradeData - Grade data
 * @returns {Promise<Object>} Updated grade
 */
export const updateGrade = async (id, gradeData) => {
  try {
    console.log(`📤 Updating grade ${id}:`, gradeData);
    
    const response = await fetch(`${API_BASE_URL}/marks-grading/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(gradeData)
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
    if (result.success) {
      console.log('✅ Grade updated successfully');
      return result.data;
    } else {
      throw new Error(result.message || 'Update failed');
    }
  } catch (error) {
    console.error('❌ Error updating grade:', error);
    if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
    }
    throw error;
  }
};

/**
 * Delete grade
 * @param {string} id - Grade ID
 * @returns {Promise<Object>} Deleted grade
 */
export const deleteGrade = async (id) => {
  try {
    console.log(`🗑️ Deleting grade ${id}`);
    
    const response = await fetch(`${API_BASE_URL}/marks-grading/${id}`, {
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
        console.error('❌ Server error:', errorData);
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    if (result.success) {
      console.log('✅ Grade deleted successfully');
      return result.data;
    } else {
      throw new Error(result.message || 'Delete failed');
    }
  } catch (error) {
    console.error('❌ Error deleting grade:', error);
    if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
    }
    throw error;
  }
};

/**
 * Bulk update grades (Save entire grading system)
 * @param {Array} grades - Grades array
 * @returns {Promise<Array>} Updated grades
 */
export const bulkUpdateGrades = async (grades) => {
  try {
    console.log('📤 Bulk updating grades:', grades);
    
    const response = await fetch(`${API_BASE_URL}/marks-grading`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(grades)
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        
        // If there are validation errors, include them
        if (errorData.errors && Array.isArray(errorData.errors)) {
          errorMessage = errorData.errors.join('\n');
        }
        console.error('❌ Server error:', errorData);
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    if (result.success) {
      console.log('✅ Grades updated successfully');
      return result.data;
    } else {
      throw new Error(result.message || 'Bulk update failed');
    }
  } catch (error) {
    console.error('❌ Error bulk updating grades:', error);
    throw error;
  }
};

/**
 * Reset to default grading system
 * @returns {Promise<Object>} Reset result
 */
export const resetToDefaultGradingSystem = async () => {
  try {
    console.log('📤 Resetting to default grading system');
    
    const response = await fetch(`${API_BASE_URL}/marks-grading/reset`, {
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
        console.error('❌ Server error:', errorData);
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (result.success) {
      console.log('✅ Grading system reset successfully');
      return result.data;
    } else {
      throw new Error(result.message || 'Reset failed');
    }
  } catch (error) {
    console.error('❌ Error resetting grading system:', error);
    throw error;
  }
};

export { resetToDefaultGradingSystem as resetToDefault };

/**
 * Validate grading system
 * @returns {Promise<Object>} Validation result
 */
export const validateGradingSystem = async () => {
  try {
    console.log('🔍 Validating grading system');
    
    const response = await fetch(`${API_BASE_URL}/marks-grading/validate`, {
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
        console.error('❌ Server error:', errorData);
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Grading system validated successfully');
      return result.data;
    } else {
      throw new Error(result.message || 'Validation failed');
    }
  } catch (error) {
    console.error('❌ Validation error:', error);
    throw error;
  }
};

/**
 * Get grade for specific marks
 * @param {number} marks - Marks value
 * @returns {Promise<Object>} Grade object
 */
export const getGradeForMarks = async (marks) => {
  try {
    console.log(`🔍 Getting grade for marks: ${marks}`);
    
    const response = await fetch(`${API_BASE_URL}/marks-grading/grade-for-marks/${marks}`, {
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
        console.error('❌ Server error:', errorData);
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Grade fetched successfully');
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to fetch grade for marks');
    }
  } catch (error) {
    console.error('❌ Error fetching grade for marks:', error);
    throw error;
  }
};

/**
 * Get grading statistics
 * @returns {Promise<Object>} Grading statistics
 */
export const getGradingStatistics = async () => {
  try {
    console.log('📊 Fetching grading statistics');
    
    const response = await fetch(`${API_BASE_URL}/marks-grading/summary`, {
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
        console.error('❌ Server error:', errorData);
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Grading statistics fetched successfully');
      return result.data;
    } else {
      throw new Error(result.message || 'Failed to fetch grading statistics');
    }
  } catch (error) {
    console.error('❌ Failed to fetch grading statistics:', error);
    throw error;
  }
};