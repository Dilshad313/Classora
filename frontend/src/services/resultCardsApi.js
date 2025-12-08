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

// Generate result card
export const generateResultCard = async (studentId, examId) => {
  return handleApiCall(`${API_BASE_URL}/exams/result-cards/generate`, {
    method: 'POST',
    body: JSON.stringify({ studentId, examId })
  });
};

// Get all result cards
export const getResultCards = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  return handleApiCall(`${API_BASE_URL}/exams/result-cards/all?${queryParams}`, {
    method: 'GET'
  });
};

// Get single result card by ID
export const getResultCardById = async (id) => {
  return handleApiCall(`${API_BASE_URL}/exams/result-cards/${id}`, {
    method: 'GET'
  });
};