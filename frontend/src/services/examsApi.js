const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

/**
 * Get authentication token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get headers for API requests
 */
const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`
  };
};

/**
 * Handle API errors
 */
const handleApiError = (error) => {
  console.error('❌ API Error:', error.message);
  
  if (error.message.includes('Failed to fetch') || error.message.includes('Connection refused')) {
    throw new Error('Backend server is not running. Please start the backend server on port 5000.');
  }
  
  throw error;
};

/**
 * Helper function to handle API calls
 */
const handleApiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: getHeaders(),
      ...options
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
    return result;
  } catch (error) {
    return handleApiError(error);
  }
};

// Get all exams with filters
export const getExams = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  return handleApiCall(`${API_BASE_URL}/exams?${queryParams}`, {
    method: 'GET'
  });
};

// Get single exam by ID
export const getExamById = async (id) => {
  return handleApiCall(`${API_BASE_URL}/exams/${id}`, {
    method: 'GET'
  });
};

// Create new exam
export const createExam = async (examData) => {
  return handleApiCall(`${API_BASE_URL}/exams`, {
    method: 'POST',
    body: JSON.stringify(examData)
  });
};

// Update exam
export const updateExam = async (id, examData) => {
  return handleApiCall(`${API_BASE_URL}/exams/${id}`, {
    method: 'PUT',
    body: JSON.stringify(examData)
  });
};

// Delete exam
export const deleteExam = async (id) => {
  return handleApiCall(`${API_BASE_URL}/exams/${id}`, {
    method: 'DELETE'
  });
};

// Toggle publish status
export const togglePublishStatus = async (id) => {
  return handleApiCall(`${API_BASE_URL}/exams/${id}/toggle-publish`, {
    method: 'PATCH'
  });
};

// Bulk delete exams
export const bulkDeleteExams = async (ids) => {
  return handleApiCall(`${API_BASE_URL}/exams/bulk-delete`, {
    method: 'POST',
    body: JSON.stringify({ ids })
  });
};

// Get exam statistics
export const getExamStats = async () => {
  return handleApiCall(`${API_BASE_URL}/exams/stats/summary`, {
    method: 'GET'
  });
};

// Get exam dropdown data
export const getExamDropdown = async (activeOnly = true) => {
  return handleApiCall(`${API_BASE_URL}/exams/dropdown?activeOnly=${activeOnly}`, {
    method: 'GET'
  });
};