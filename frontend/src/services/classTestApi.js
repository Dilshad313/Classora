// src/services/classTestApi.js

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

/**
 * Get token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get all tests with filters
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Tests data
 */
export const getClassTests = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    
    const url = `${API_BASE_URL}/class-tests${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch tests:', error);
    throw error;
  }
};

/**
 * Get test by ID
 * @param {string} id - Test ID
 * @returns {Promise<Object>} Test data
 */
export const getClassTestById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/class-tests/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Failed to fetch test:', error);
    throw error;
  }
};

/**
 * Create new test
 * @param {Object} testData - Test data
 * @returns {Promise<Object>} Created test
 */
export const createClassTest = async (testData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/class-tests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(testData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create test');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating test:', error);
    throw error;
  }
};

/**
 * Update test
 * @param {string} id - Test ID
 * @param {Object} testData - Updated test data
 * @returns {Promise<Object>} Updated test
 */
export const updateClassTest = async (id, testData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/class-tests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(testData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update test');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error updating test:', error);
    throw error;
  }
};

/**
 * Delete test
 * @param {string} id - Test ID
 * @returns {Promise<Object>} Success message
 */
export const deleteClassTest = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/class-tests/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete test');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error deleting test:', error);
    throw error;
  }
};

/**
 * Publish test
 * @param {string} id - Test ID
 * @returns {Promise<Object>} Published test
 */
export const publishTest = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/class-tests/${id}/publish`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to publish test');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error publishing test:', error);
    throw error;
  }
};

/**
 * Get dropdown data for test creation
 * @param {string} classId - Class ID (optional)
 * @returns {Promise<Object>} Dropdown data
 */
export const getDropdownData = async (classId = null) => {
  try {
    const url = `${API_BASE_URL}/class-tests/dropdown-data${classId ? `?classId=${classId}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Failed to fetch dropdown data:', error);
    throw error;
  }
};

/**
 * Get class-wise results
 * @param {string} classId - Class ID
 * @returns {Promise<Object>} Class-wise results
 */
export const getClassWiseResults = async (classId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/class-tests/results/class-wise?classId=${classId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Failed to fetch class-wise results:', error);
    throw error;
  }
};

/**
 * Get class and subject results
 * @param {string} classId - Class ID
 * @param {string} subjectName - Subject name
 * @returns {Promise<Object>} Class-subject results
 */
export const getClassSubjectResults = async (classId, subjectName) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/class-tests/results/class-subject?classId=${classId}&subjectName=${encodeURIComponent(subjectName)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Failed to fetch class-subject results:', error);
    throw error;
  }
};

/**
 * Get student and subject results
 * @param {string} studentId - Student ID
 * @returns {Promise<Object>} Student-subject results
 */
export const getStudentSubjectResults = async (studentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/class-tests/results/student-subject?studentId=${studentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Failed to fetch student-subject results:', error);
    throw error;
  }
};

/**
 * Get date range results
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @param {string} classId - Class ID (optional, default: 'all')
 * @param {string} subjectName - Subject name (optional, default: 'all')
 * @returns {Promise<Object>} Date range results
 */
export const getDateRangeResults = async (startDate, endDate, classId = 'all', subjectName = 'all') => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/class-tests/results/date-range?startDate=${startDate}&endDate=${endDate}&classId=${classId}&subjectName=${encodeURIComponent(subjectName)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Failed to fetch date range results:', error);
    throw error;
  }
};

/**
 * Get performance report
 * @param {string} classId - Class ID
 * @returns {Promise<Object>} Performance report
 */
export const getPerformanceReport = async (classId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/class-tests/results/performance-report?classId=${classId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Failed to fetch performance report:', error);
    throw error;
  }
};

/**
 * Get test statistics
 * @returns {Promise<Object>} Test statistics
 */
export const getTestStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/class-tests/stats/summary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Failed to fetch test statistics:', error);
    throw error;
  }
};