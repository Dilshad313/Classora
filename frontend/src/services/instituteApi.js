// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

/**
 * Get token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get institute profile from backend
 * @returns {Promise<Object>} Institute profile data
 */
export const getInstituteProfile = async () => {
  try {
    console.log(`🔗 Fetching institute profile from: ${API_BASE_URL}/institute/profile`);
    
    const response = await fetch(`${API_BASE_URL}/institute/profile`, {
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
      throw new Error(result.message || 'Failed to fetch profile');
    }
  } catch (error) {
    console.error(`❌ Failed to fetch profile:`, error.message);
    
    if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
    }
    
    throw error;
  }
};

/**
 * Update institute profile
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<Object>} Updated profile data
 */
export const updateInstituteProfile = async (profileData) => {
  try {
    console.log('📤 Updating institute profile...');
    
    const formData = new FormData();
    
    // Append all text fields
    formData.append('instituteName', profileData.instituteName);
    formData.append('tagline', profileData.tagline);
    formData.append('phone', profileData.phone);
    formData.append('address', profileData.address);
    formData.append('country', profileData.country);
    formData.append('website', profileData.website || '');
    
    // Append logo file if it's a File object (not a URL string)
    if (profileData.logo && profileData.logo instanceof File) {
      formData.append('logo', profileData.logo);
      console.log('📎 Logo file attached:', profileData.logo.name, profileData.logo.size, 'bytes');
    }

    console.log('📤 Sending request to:', `${API_BASE_URL}/institute/profile`);

    const response = await fetch(`${API_BASE_URL}/institute/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary for FormData
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

    console.log('✅ Profile updated successfully');
    return result.data;
  } catch (error) {
    console.error('❌ Error updating institute profile:', error);
    
    if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('fetch'))) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
    }
    
    throw error;
  }
};

/**
 * Delete institute logo
 * @returns {Promise<Object>} Updated profile data
 */
export const deleteInstituteLogo = async () => {
  try {
    console.log('🗑️ Deleting institute logo...');
    
    const response = await fetch(`${API_BASE_URL}/institute/profile/logo`, {
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
    
    if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
    }
    
    throw error;
  }
};

/**
 * Get fees particulars from backend
 * @returns {Promise<Object>} Fees particulars data
 */
export const getFeesParticulars = async () => {
  try {
    console.log(`🔗 Fetching fees particulars from: ${API_BASE_URL}/institute/fees-particulars`);
    
    const response = await fetch(`${API_BASE_URL}/institute/fees-particulars`, {
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
      throw new Error(result.message || 'Failed to fetch fees particulars');
    }
  } catch (error) {
    console.error(`❌ Failed to fetch fees particulars:`, error.message);
    
    if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
    }
    
    throw error;
  }
};

/**
 * Update fees particulars
 * @param {Object} feesData - Fees data to update
 * @returns {Promise<Object>} Updated fees data
 */
export const updateFeesParticulars = async (feesData) => {
  try {
    console.log('📤 Updating fees particulars:', feesData);
    
    const response = await fetch(`${API_BASE_URL}/institute/fees-particulars`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(feesData),
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

    console.log('✅ Fees particulars updated successfully');
    return result.data;
  } catch (error) {
    console.error('❌ Error updating fees particulars:', error);
    
    if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
    }
    
    throw error;
  }
};