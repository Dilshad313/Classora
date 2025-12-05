// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

/**
 * Get token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get all uploads
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} Uploads array
 */
export const getAllUploads = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.category) queryParams.append('category', params.category);
    if (params.fileType) queryParams.append('fileType', params.fileType);
    if (params.status) queryParams.append('status', params.status);
    
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/uploads${queryString ? `?${queryString}` : ''}`;
    
    console.log(`🔗 Fetching uploads from: ${url}`);
    
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
      throw new Error(result.message || 'Failed to fetch uploads');
    }
  } catch (error) {
    console.error(`❌ Failed to fetch uploads:`, error.message);
    throw error;
  }
};

/**
 * Upload file
 * @param {File} file - File to upload
 * @param {Object} metadata - Additional metadata
 * @returns {Promise<Object>} Upload response
 */
export const uploadFile = async (file, metadata = {}) => {
  try {
    console.log('📤 Uploading file:', file.name);
    
    const formData = new FormData();
    formData.append('logo', file);
    if (metadata.category) formData.append('category', metadata.category);
    if (metadata.description) formData.append('description', metadata.description);

    const response = await fetch(`${API_BASE_URL}/uploads`, {
      method: 'POST',
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
      } catch (e) {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Upload failed');
    }

    console.log('✅ File uploaded successfully');
    return result.data;
  } catch (error) {
    console.error('❌ Error uploading file:', error);
    throw error;
  }
};

/**
 * Delete upload
 * @param {string} id - Upload ID
 * @returns {Promise<Object>} Deleted upload
 */
export const deleteUpload = async (id) => {
  try {
    console.log(`🗑️ Deleting upload: ${id}`);
    
    const response = await fetch(`${API_BASE_URL}/uploads/${id}`, {
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

    console.log('✅ Upload deleted successfully');
    return result.data;
  } catch (error) {
    console.error('❌ Error deleting upload:', error);
    throw error;
  }
};

/**
 * Get storage statistics
 * @returns {Promise<Object>} Statistics object
 */
export const getStorageStats = async () => {
  try {
    console.log('🔗 Fetching storage statistics');
    
    const response = await fetch(`${API_BASE_URL}/uploads/stats/summary`, {
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