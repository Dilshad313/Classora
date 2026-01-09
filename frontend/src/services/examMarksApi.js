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

// Get exam marks by class
export const getExamMarksByClass = async (examId, classId) => {
  return handleApiCall(`${API_BASE_URL}/exams/${examId}/marks/class/${classId}`, {
    method: 'GET'
  });
};

// Save bulk marks
export const saveBulkMarks = async (examId, classId, marksData) => {
  return handleApiCall(`${API_BASE_URL}/exams/${examId}/marks/bulk`, {
    method: 'POST',
    body: JSON.stringify({ className: classId, marksData }) // Send as className to match backend expectation
  });
};

// Get exam marks dropdown data (exams, classes, teachers)
export const getExamMarksDropdownData = async () => {
  return handleApiCall(`${API_BASE_URL}/exams/marks/dropdown-data`, {
    method: 'GET'
  });
};