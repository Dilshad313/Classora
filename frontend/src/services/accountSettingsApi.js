// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

/**
 * Get token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get account settings
 * @returns {Promise<Object>} Account settings data
 */
export const getAccountSettings = async () => {
  try {
    console.log('🔗 Fetching account settings');
    
    const response = await fetch(`${API_BASE_URL}/account-settings`, {
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
      throw new Error(result.message || 'Failed to fetch account settings');
    }
  } catch (error) {
    console.error(`❌ Failed to fetch account settings:`, error.message);
    throw error;
  }
};

/**
 * Update account settings
 * @param {Object} settingsData - Settings data to update
 * @returns {Promise<Object>} Updated settings
 */
export const updateAccountSettings = async (settingsData) => {
  try {
    console.log('📤 Updating account settings:', settingsData);
    
    const response = await fetch(`${API_BASE_URL}/account-settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(settingsData),
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
      throw new Error(result.message || 'Update failed');
    }

    console.log('✅ Account settings updated successfully');
    return result.data;
  } catch (error) {
    console.error('❌ Error updating account settings:', error);
    throw error;
  }
};

/**
 * Change password
 * @param {Object} passwordData - Password change data
 * @returns {Promise<Object>} Success response
 */
export const changePassword = async (passwordData) => {
  try {
    console.log('📤 Changing password');
    
    const response = await fetch(`${API_BASE_URL}/account-settings/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(passwordData),
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
      throw new Error(result.message || 'Password change failed');
    }

    console.log('✅ Password changed successfully');
    return result;
  } catch (error) {
    console.error('❌ Error changing password:', error);
    throw error;
  }
};

/**
 * Delete account
 * @param {string} password - User password for confirmation
 * @returns {Promise<Object>} Success response
 */
export const deleteAccount = async (password) => {
  try {
    console.log('📤 Deleting account');
    
    const response = await fetch(`${API_BASE_URL}/account-settings`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({ password }),
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
      throw new Error(result.message || 'Account deletion failed');
    }

    console.log('✅ Account deleted successfully');
    return result;
  } catch (error) {
    console.error('❌ Error deleting account:', error);
    throw error;
  }
};