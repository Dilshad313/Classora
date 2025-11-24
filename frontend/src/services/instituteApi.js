// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

// Helper function to handle API calls
const handleApiCall = async (url, options = {}) => {
  try {
    console.log(`🔗 Making API call to: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
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
 * Get institute profile from backend
 * @returns {Promise<Object>} Institute profile data
 */
export const getInstituteProfile = async () => {
  return handleApiCall(`${API_BASE_URL}/institute/profile`, {
    method: 'GET',
  });
};

/**
 * Update institute profile
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<Object>} Updated profile data
 */
export const updateInstituteProfile = async (profileData) => {
  try {
    console.log('📤 Updating institute profile:', profileData);
    
    const formData = new FormData();
    
    // Append all text fields
    formData.append('instituteName', profileData.instituteName);
    formData.append('tagline', profileData.tagline);
    formData.append('phone', profileData.phone);
    formData.append('address', profileData.address);
    formData.append('country', profileData.country);
    formData.append('website', profileData.website || '');
    
    // Append logo file if it's a File object (not a URL string)
    if (profileData.logo && typeof profileData.logo !== 'string') {
      formData.append('logo', profileData.logo);
      console.log('📎 Logo file attached');
    }

    const response = await fetch(`${API_BASE_URL}/institute/profile`, {
      method: 'PUT',
      body: formData,
      // Don't set Content-Type header for FormData
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

    console.log('✅ Profile updated successfully');
    return result.data;
  } catch (error) {
    console.error('❌ Error updating institute profile:', error);
    
    if (error.message.includes('Failed to fetch') || error.message.includes('Connection refused')) {
      throw new Error('Backend server is not running. Please start the backend server on port 5000.');
    }
    
    throw error;
  }
};

/**
 * Delete institute logo
 * @returns {Promise<Object>} Updated profile data
 */
export const deleteInstituteLogo = async () => {
  return handleApiCall(`${API_BASE_URL}/institute/profile/logo`, {
    method: 'DELETE',
  });
};