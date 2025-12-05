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
    
    throw error;
  }
};

/**
 * Collect fees for a student
 * @param {Object} feeData - Fee collection data
 * @returns {Promise<Object>} Created fee payment
 */
export const collectFees = async (feeData) => {
  return handleApiCall(`${API_BASE_URL}/fees/collect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(feeData)
  });
};

/**
 * Get all fee payments with filters
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} List of fee payments
 */
export const getFeePayments = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(filters).forEach(key => {
    if (filters[key] && filters[key] !== 'all') {
      queryParams.append(key, filters[key]);
    }
  });
  
  const url = `${API_BASE_URL}/fees/payments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return handleApiCall(url, { method: 'GET' });
};

/**
 * Get fees defaulters for a specific month
 * @param {Object} filters - Filter options (month, search)
 * @returns {Promise<Array>} List of defaulters
 */
export const getFeesDefaulters = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(filters).forEach(key => {
    if (filters[key] && filters[key] !== '') {
      queryParams.append(key, filters[key]);
    }
  });
  
  const url = `${API_BASE_URL}/fees/defaulters${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return handleApiCall(url, { method: 'GET' });
};

/**
 * Get fees paid slip for a student in a specific month
 * @param {string} studentId - Student ID
 * @param {string} month - Month in YYYY-MM format
 * @returns {Promise<Array>} Fee payment records
 */
export const getFeesPaidSlip = async (studentId, month) => {
  const queryParams = new URLSearchParams();
  if (studentId) queryParams.append('studentId', studentId);
  if (month) queryParams.append('month', month);
  
  const url = `${API_BASE_URL}/fees/paid-slip${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return handleApiCall(url, { method: 'GET' });
};

/**
 * Get fees report and analytics
 * @param {Object} filters - Report filters (period, month, year, startDate, endDate)
 * @returns {Promise<Object>} Fees report data
 */
export const getFeesReport = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(filters).forEach(key => {
    if (filters[key] && filters[key] !== '') {
      queryParams.append(key, filters[key]);
    }
  });
  
  const url = `${API_BASE_URL}/fees/report${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return handleApiCall(url, { method: 'GET' });
};

/**
 * Delete a single fee payment
 * @param {string} id - Fee payment ID
 * @returns {Promise<Object>} Success message
 */
export const deleteFeePayment = async (id) => {
  return handleApiCall(`${API_BASE_URL}/fees/payments/${id}`, { method: 'DELETE' });
};

/**
 * Bulk delete fee payments
 * @param {Array} ids - Array of fee payment IDs
 * @returns {Promise<Object>} Success message
 */
export const bulkDeleteFeePayments = async (ids) => {
  return handleApiCall(`${API_BASE_URL}/fees/payments`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids })
  });
};

/**
 * Get fee structures (if needed for invoice generation)
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} List of fee structures
 */
export const getFeeStructures = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  Object.keys(filters).forEach(key => {
    if (filters[key] && filters[key] !== 'all') {
      queryParams.append(key, filters[key]);
    }
  });
  
  const url = `${API_BASE_URL}/fee-structure${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return handleApiCall(url, { method: 'GET' });
};