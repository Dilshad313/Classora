// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

/**
 * Get token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get all bank accounts
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} Bank accounts array
 */
export const getAllBankAccounts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/bank-accounts${queryString ? `?${queryString}` : ''}`;
    
    console.log(`🔗 Fetching bank accounts from: ${url}`);
    
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
      throw new Error(result.message || 'Failed to fetch bank accounts');
    }
  } catch (error) {
    console.error(`❌ Failed to fetch bank accounts:`, error.message);
    
    if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
    }
    
    throw error;
  }
};

/**
 * Get bank account by ID
 * @param {string} id - Bank account ID
 * @returns {Promise<Object>} Bank account object
 */
export const getBankAccountById = async (id) => {
  try {
    console.log(`🔗 Fetching bank account: ${id}`);
    
    const response = await fetch(`${API_BASE_URL}/bank-accounts/${id}`, {
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
      throw new Error(result.message || 'Failed to fetch bank account');
    }
  } catch (error) {
    console.error(`❌ Failed to fetch bank account:`, error.message);
    throw error;
  }
};

/**
 * Create new bank account
 * @param {Object} bankAccountData - Bank account data (including logo file)
 * @returns {Promise<Object>} Created bank account
 */
export const createBankAccount = async (bankAccountData) => {
  try {
    console.log('📤 Creating bank account:', bankAccountData);
    
    const formData = new FormData();
    
    // Append all text fields
    formData.append('bankName', bankAccountData.bankName);
    if (bankAccountData.emailManager) formData.append('emailManager', bankAccountData.emailManager);
    if (bankAccountData.bankAddress) formData.append('bankAddress', bankAccountData.bankAddress);
    formData.append('accountNumber', bankAccountData.accountNumber);
    if (bankAccountData.instructions) formData.append('instructions', bankAccountData.instructions);
    formData.append('loginRequired', bankAccountData.loginRequired);
    formData.append('status', bankAccountData.status || 'active');
    
    // Append logo file if it's a File object
    if (bankAccountData.logo && bankAccountData.logo instanceof File) {
      formData.append('logo', bankAccountData.logo);
      console.log('📎 Logo file attached:', bankAccountData.logo.name);
    }

    const response = await fetch(`${API_BASE_URL}/bank-accounts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: formData,
      // Don't set Content-Type header for FormData
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

    console.log('✅ Bank account created successfully');
    return result.data;
  } catch (error) {
    console.error('❌ Error creating bank account:', error);
    
    if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
    }
    
    throw error;
  }
};

/**
 * Update bank account
 * @param {string} id - Bank account ID
 * @param {Object} bankAccountData - Updated bank account data
 * @returns {Promise<Object>} Updated bank account
 */
export const updateBankAccount = async (id, bankAccountData) => {
  try {
    console.log(`📤 Updating bank account ${id}:`, bankAccountData);
    
    const formData = new FormData();
    
    // Append all text fields
    formData.append('bankName', bankAccountData.bankName);
    if (bankAccountData.emailManager) formData.append('emailManager', bankAccountData.emailManager);
    if (bankAccountData.bankAddress) formData.append('bankAddress', bankAccountData.bankAddress);
    formData.append('accountNumber', bankAccountData.accountNumber);
    if (bankAccountData.instructions) formData.append('instructions', bankAccountData.instructions);
    formData.append('loginRequired', bankAccountData.loginRequired);
    formData.append('status', bankAccountData.status || 'active');
    
    // Append logo file if it's a File object (new upload)
    if (bankAccountData.logo && bankAccountData.logo instanceof File) {
      formData.append('logo', bankAccountData.logo);
      console.log('📎 Logo file attached:', bankAccountData.logo.name);
    }

    const response = await fetch(`${API_BASE_URL}/bank-accounts/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: formData,
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

    console.log('✅ Bank account updated successfully');
    return result.data;
  } catch (error) {
    console.error('❌ Error updating bank account:', error);
    
    if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
    }
    
    throw error;
  }
};

/**
 * Delete bank account
 * @param {string} id - Bank account ID
 * @returns {Promise<Object>} Deleted bank account
 */
export const deleteBankAccount = async (id) => {
  try {
    console.log(`🗑️ Deleting bank account: ${id}`);
    
    const response = await fetch(`${API_BASE_URL}/bank-accounts/${id}`, {
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

    console.log('✅ Bank account deleted successfully');
    return result.data;
  } catch (error) {
    console.error('❌ Error deleting bank account:', error);
    
    if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
    }
    
    throw error;
  }
};

/**
 * Delete bank account logo
 * @param {string} id - Bank account ID
 * @returns {Promise<Object>} Updated bank account
 */
export const deleteBankAccountLogo = async (id) => {
  try {
    console.log(`🗑️ Deleting bank account logo: ${id}`);
    
    const response = await fetch(`${API_BASE_URL}/bank-accounts/${id}/logo`, {
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

    console.log('✅ Logo deleted successfully');
    return result.data;
  } catch (error) {
    console.error('❌ Error deleting logo:', error);
    throw error;
  }
};

/**
 * Get bank account statistics
 * @returns {Promise<Object>} Statistics object
 */
export const getBankAccountStats = async () => {
  try {
    console.log('🔗 Fetching bank account statistics');
    
    const response = await fetch(`${API_BASE_URL}/bank-accounts/stats/summary`, {
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