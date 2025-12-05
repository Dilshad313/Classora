// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

/**
 * Get token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get all rules and regulations
 * @param {Object} params - Query parameters (status, isRequired)
 * @returns {Promise<Array>} Rules array
 */
export const getAllRules = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.isRequired !== undefined) queryParams.append('isRequired', params.isRequired);
    
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/rules-regulations${queryString ? `?${queryString}` : ''}`;
    
    console.log(`🔗 Fetching rules from: ${url}`);
    
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
      throw new Error(result.message || 'Failed to fetch rules');
    }
  } catch (error) {
    console.error(`❌ Failed to fetch rules:`, error.message);
    
    if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
    }
    
    throw error;
  }
};

/**
 * Get rule by ID
 * @param {string} id - Rule ID
 * @returns {Promise<Object>} Rule object
 */
export const getRuleById = async (id) => {
  try {
    console.log(`🔗 Fetching rule: ${id}`);
    
    const response = await fetch(`${API_BASE_URL}/rules-regulations/${id}`, {
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
      throw new Error(result.message || 'Failed to fetch rule');
    }
  } catch (error) {
    console.error(`❌ Failed to fetch rule:`, error.message);
    throw error;
  }
};

/**
 * Create new rule
 * @param {Object} ruleData - Rule data
 * @returns {Promise<Object>} Created rule
 */
export const createRule = async (ruleData) => {
  try {
    console.log('📤 Creating rule:', ruleData);
    
    const response = await fetch(`${API_BASE_URL}/rules-regulations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(ruleData),
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

    console.log('✅ Rule created successfully');
    return result.data;
  } catch (error) {
    console.error('❌ Error creating rule:', error);
    
    if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
    }
    
    throw error;
  }
};

/**
 * Update rule
 * @param {string} id - Rule ID
 * @param {Object} ruleData - Updated rule data
 * @returns {Promise<Object>} Updated rule
 */
export const updateRule = async (id, ruleData) => {
  try {
    console.log(`📤 Updating rule ${id}:`, ruleData);
    
    const response = await fetch(`${API_BASE_URL}/rules-regulations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(ruleData),
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

    console.log('✅ Rule updated successfully');
    return result.data;
  } catch (error) {
    console.error('❌ Error updating rule:', error);
    
    if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
    }
    
    throw error;
  }
};

/**
 * Delete rule
 * @param {string} id - Rule ID
 * @returns {Promise<Object>} Deleted rule
 */
export const deleteRule = async (id) => {
  try {
    console.log(`🗑️ Deleting rule: ${id}`);
    
    const response = await fetch(`${API_BASE_URL}/rules-regulations/${id}`, {
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

    console.log('✅ Rule deleted successfully');
    return result.data;
  } catch (error) {
    console.error('❌ Error deleting rule:', error);
    
    if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
    }
    
    throw error;
  }
};

/**
 * Reorder rules
 * @param {Array} rules - Array of rules with id and new priority
 * @returns {Promise<Array>} Updated rules
 */
export const reorderRules = async (rules) => {
  try {
    console.log('📤 Reordering rules:', rules);
    
    const response = await fetch(`${API_BASE_URL}/rules-regulations/reorder`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({ rules }),
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
      throw new Error(result.message || 'Reorder failed');
    }

    console.log('✅ Rules reordered successfully');
    return result.data;
  } catch (error) {
    console.error('❌ Error reordering rules:', error);
    throw error;
  }
};

/**
 * Get rules statistics
 * @returns {Promise<Object>} Statistics object
 */
export const getRulesStats = async () => {
  try {
    console.log('🔗 Fetching rules statistics');
    
    const response = await fetch(`${API_BASE_URL}/rules-regulations/stats/summary`, {
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

/**
 * Bulk delete rules
 * @param {Array} ids - Array of rule IDs
 * @returns {Promise<Object>} Delete result
 */
export const bulkDeleteRules = async (ids) => {
  try {
    console.log('📤 Bulk deleting rules:', ids);
    
    const response = await fetch(`${API_BASE_URL}/rules-regulations/bulk-delete`, {
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

    console.log('✅ Rules deleted successfully');
    return result.data;
  } catch (error) {
    console.error('❌ Error deleting rules:', error);
    throw error;
  }
};