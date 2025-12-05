// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

/**
 * Get token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get all fee structures
 * @param {Object} params - Query parameters (status, academicYear)
 * @returns {Promise<Array>} Fee structures array
 */
export const getAllFeeStructures = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.academicYear) queryParams.append('academicYear', params.academicYear);
    
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/fee-structure${queryString ? `?${queryString}` : ''}`;
    
    console.log(`🔗 Fetching fee structures from: ${url}`);
    
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
      throw new Error(result.message || 'Failed to fetch fee structures');
    }
  } catch (error) {
    console.error(`❌ Failed to fetch fee structures:`, error.message);
    
    if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
    }
    
    throw error;
  }
};

/**
 * Get fee structure by ID
 * @param {string} id - Fee structure ID
 * @returns {Promise<Object>} Fee structure object
 */
export const getFeeStructureById = async (id) => {
  try {
    console.log(`🔗 Fetching fee structure: ${id}`);
    
    const response = await fetch(`${API_BASE_URL}/fee-structure/${id}`, {
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
      throw new Error(result.message || 'Failed to fetch fee structure');
    }
  } catch (error) {
    console.error(`❌ Failed to fetch fee structure:`, error.message);
    throw error;
  }
};

/**
 * Create new fee structure
 * @param {Object} feeStructureData - Fee structure data
 * @returns {Promise<Object>} Created fee structure
 */
export const createFeeStructure = async (feeStructureData) => {
  try {
    console.log('📤 Creating fee structure:', feeStructureData);
    
    const response = await fetch(`${API_BASE_URL}/fee-structure`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(feeStructureData),
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
      throw new Error(result.message || 'Create failed');
    }

    console.log('✅ Fee structure created successfully');
    return result.data;
  } catch (error) {
    console.error('❌ Error creating fee structure:', error);
    
    if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
    }
    
    throw error;
  }
};

/**
 * Update fee structure
 * @param {string} id - Fee structure ID
 * @param {Object} feeStructureData - Updated fee structure data
 * @returns {Promise<Object>} Updated fee structure
 */
export const updateFeeStructure = async (id, feeStructureData) => {
  try {
    console.log(`📤 Updating fee structure ${id}:`, feeStructureData);
    
    const response = await fetch(`${API_BASE_URL}/fee-structure/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(feeStructureData),
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
      throw new Error(result.message || 'Update failed');
    }

    console.log('✅ Fee structure updated successfully');
    return result.data;
  } catch (error) {
    console.error('❌ Error updating fee structure:', error);
    
    if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
    }
    
    throw error;
  }
};

/**
 * Delete fee structure
 * @param {string} id - Fee structure ID
 * @returns {Promise<Object>} Deleted fee structure
 */
export const deleteFeeStructure = async (id) => {
  try {
    console.log(`🗑️ Deleting fee structure: ${id}`);
    
    const response = await fetch(`${API_BASE_URL}/fee-structure/${id}`, {
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

    console.log('✅ Fee structure deleted successfully');
    return result.data;
  } catch (error) {
    console.error('❌ Error deleting fee structure:', error);
    
    if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
    }
    
    throw error;
  }
};

/**
 * Get fee structure statistics
 * @returns {Promise<Object>} Statistics object
 */
export const getFeeStructureStats = async () => {
  try {
    console.log('🔗 Fetching fee structure statistics');
    
    const response = await fetch(`${API_BASE_URL}/fee-structure/stats/summary`, {
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
    console.error(`❌ Failed to fetch statistics:`, error.message);
    throw error;
  }
};