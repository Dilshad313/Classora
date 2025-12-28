// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

// Helper function to handle API calls with authentication
const handleApiCall = async (url, options = {}) => {
  try {
    const token = localStorage.getItem('token');
    
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
        
        // Handle specific error cases
        if (errorData.errors && Array.isArray(errorData.errors)) {
          errorMessage = errorData.errors[0] || errorMessage;
        }
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
    
    // More specific error messages
    if (error.message.includes('Failed to fetch') || error.message.includes('Connection refused')) {
      throw new Error('Backend server is not running. Please start the backend server on port 5000.');
    }
    
    if (error.message.includes('already exists')) {
      throw new Error(`Student creation failed: ${error.message}`);
    }
    
    throw error;
  }
};

// Helper for form data API calls
const handleFormDataApiCall = async (url, formData, method = 'POST') => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(url, {
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      let errorData = null;
      
      try {
        errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      
      // Create error with additional context for 409 conflicts
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = errorData;
      
      // Check if it's a duplicate registration/admission number error
      const errorLower = errorMessage.toLowerCase();
      if (response.status === 409 && (
          errorLower.includes('registration') || 
          errorLower.includes('admission') ||
          errorLower.includes('already exists')
        )) {
        error.field = 'registrationNo';
        error.isDuplicate = true;
      }
      
      throw error;
    }

    const result = await response.json();

    if (!result.success) {
      const errorMessage = result.message || 'API call failed';
      const error = new Error(errorMessage);
      error.status = response.status || 400;
      error.data = result;
      
      // Check if it's a duplicate registration/admission number error
      const errorLower = errorMessage.toLowerCase();
      if ((response.status === 409 || error.status === 409) && (
          errorLower.includes('registration') || 
          errorLower.includes('admission') ||
          errorLower.includes('already exists')
        )) {
        error.field = 'registrationNo';
        error.isDuplicate = true;
      }
      
      throw error;
    }

    return result.data;
  } catch (error) {
    console.error(`❌ API call failed to ${url}:`, error.message);
    throw error;
  }
};

/**
 * Get all students with optional filtering
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} List of students
 */
export const getStudents = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(filters).forEach(key => {
    if (filters[key] && filters[key] !== 'all') {
      queryParams.append(key, filters[key]);
    }
  });
  
  const url = `${API_BASE_URL}/students${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return handleApiCall(url, { method: 'GET' });
};

/**
 * Get student by ID
 * @param {string} id - Student ID
 * @returns {Promise<Object>} Student data
 */
export const getStudentById = async (id) => {
  return handleApiCall(`${API_BASE_URL}/students/${id}`, { method: 'GET' });
};

/**
 * Create new student
 * @param {Object} studentData - Student data
 * @param {File} picture - Student photo
 * @param {Array} documents - Student documents
 * @returns {Promise<Object>} Created student
 */
export const createStudent = async (studentData, picture = null, documents = []) => {
  const formData = new FormData();
  
  // Append all student data fields
  Object.keys(studentData).forEach(key => {
    if (studentData[key] !== null && studentData[key] !== undefined && studentData[key] !== '') {
      formData.append(key, studentData[key]);
    }
  });
  
  // Append picture if provided
  if (picture && typeof picture !== 'string') {
    formData.append('picture', picture);
  }
  
  // Append documents if provided
  if (documents && documents.length > 0) {
    documents.forEach(doc => {
      if (doc && typeof doc !== 'string') {
        formData.append('documents', doc);
      }
    });
  }

  return handleFormDataApiCall(`${API_BASE_URL}/students`, formData, 'POST');
};

/**
 * Update student
 * @param {string} id - Student ID
 * @param {Object} studentData - Updated student data
 * @param {File} picture - New student photo
 * @param {Array} documents - Additional documents
 * @returns {Promise<Object>} Updated student
 */
export const updateStudent = async (id, studentData, picture = null, documents = []) => {
  const formData = new FormData();
  
  // Append all student data fields
  Object.keys(studentData).forEach(key => {
    if (studentData[key] !== null && studentData[key] !== undefined && studentData[key] !== '') {
      formData.append(key, studentData[key]);
    }
  });
  
  // Append picture if provided
  if (picture && typeof picture !== 'string') {
    formData.append('picture', picture);
  }
  
  // Append documents if provided
  if (documents && documents.length > 0) {
    documents.forEach(doc => {
      if (doc && typeof doc !== 'string') {
        formData.append('documents', doc);
      }
    });
  }

  return handleFormDataApiCall(`${API_BASE_URL}/students/${id}`, formData, 'PUT');
};

/**
 * Delete student
 * @param {string} id - Student ID
 * @returns {Promise<Object>} Success message
 */
export const deleteStudent = async (id) => {
  return handleApiCall(`${API_BASE_URL}/students/${id}`, { method: 'DELETE' });
};

/**
 * Update student status
 * @param {string} id - Student ID
 * @param {string} status - New status (active/inactive)
 * @returns {Promise<Object>} Updated student
 */
export const updateStudentStatus = async (id, status) => {
  return handleApiCall(`${API_BASE_URL}/students/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status })
  });
};

/**
 * Get student admission letter
 * @param {string} id - Student ID
 * @returns {Promise<Object>} Admission letter data
 */
export const getAdmissionLetter = async (id) => {
  return handleApiCall(`${API_BASE_URL}/students/${id}/admission-letter`, { method: 'GET' });
};

/**
 * Get student login credentials
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} Login credentials
 */
export const getLoginCredentials = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(filters).forEach(key => {
    if (filters[key] && filters[key] !== 'all') {
      queryParams.append(key, filters[key]);
    }
  });
  
  const url = `${API_BASE_URL}/students/login-credentials${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return handleApiCall(url, { method: 'GET' });
};

/**
 * Update student login credentials
 * @param {string} id - Student ID
 * @param {Object} credentials - New credentials
 * @returns {Promise<Object>} Updated student
 */
export const updateLoginCredentials = async (id, credentials) => {
  return handleApiCall(`${API_BASE_URL}/students/${id}/login-credentials`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials)
  });
};

/**
 * Promote students to next class
 * @param {Array} studentIds - Array of student IDs
 * @param {string} promoteToClass - Target class
 * @returns {Promise<Object>} Promotion result
 */
export const promoteStudents = async (studentIds, promoteToClass) => {
  return handleApiCall(`${API_BASE_URL}/students/promote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ studentIds, promoteToClass })
  });
};

/**
 * Get basic student list for printing
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Student list and summary
 */
export const getBasicList = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(filters).forEach(key => {
    if (filters[key] && filters[key] !== 'all') {
      queryParams.append(key, filters[key]);
    }
  });
  
  const url = `${API_BASE_URL}/students/print/basic-list${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return handleApiCall(url, { method: 'GET' });
};

/**
 * Get student statistics
 * @returns {Promise<Object>} Student statistics
 */
export const getStudentStats = async () => {
  return handleApiCall(`${API_BASE_URL}/students/stats`, { method: 'GET' });
};