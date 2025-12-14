// Certificate API Functions

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

/**
 * Get auth token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// ========== TEMPLATE API FUNCTIONS ==========

/**
 * Get all certificate templates
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Templates data
 */
export const getAllCertificateTemplates = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const url = `${API_BASE_URL}/certificates/templates${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch templates');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('❌ Failed to fetch certificate templates:', error.message);
    throw error;
  }
};

/**
 * Get single certificate template by ID
 * @param {string} id - Template ID
 * @returns {Promise<Object>} Template data
 */
export const getCertificateTemplateById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/certificates/templates/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch template');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('❌ Failed to fetch certificate template:', error.message);
    throw error;
  }
};

/**
 * Create new certificate template
 * @param {Object} templateData - Template data
 * @returns {Promise<Object>} Created template
 */
export const createCertificateTemplate = async (templateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/certificates/templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(templateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create template');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('❌ Failed to create certificate template:', error.message);
    throw error;
  }
};

/**
 * Update certificate template
 * @param {string} id - Template ID
 * @param {Object} templateData - Updated template data
 * @returns {Promise<Object>} Updated template
 */
export const updateCertificateTemplate = async (id, templateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/certificates/templates/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(templateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update template');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('❌ Failed to update certificate template:', error.message);
    throw error;
  }
};

/**
 * Delete certificate template
 * @param {string} id - Template ID
 * @returns {Promise<Object>} Success message
 */
export const deleteCertificateTemplate = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/certificates/templates/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete template');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('❌ Failed to delete certificate template:', error.message);
    throw error;
  }
};

// ========== CERTIFICATE GENERATION API FUNCTIONS ==========

/**
 * Get dropdown data for certificate generation
 * @param {string} recipientType - Recipient type (Student/Staff)
 * @returns {Promise<Object>} Dropdown data
 */
export const getCertificateDropdownData = async (recipientType = '') => {
  try {
    const url = `${API_BASE_URL}/certificates/dropdown-data${recipientType ? `?recipientType=${recipientType}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch dropdown data');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('❌ Failed to fetch certificate dropdown data:', error.message);
    throw error;
  }
};

/**
 * Generate new certificate
 * @param {Object} certificateData - Certificate data
 * @returns {Promise<Object>} Generated certificate
 */
export const generateCertificate = async (certificateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/certificates/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(certificateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to generate certificate');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('❌ Failed to generate certificate:', error.message);
    throw error;
  }
};

/**
 * Get generated certificate by ID
 * @param {string} id - Certificate ID
 * @returns {Promise<Object>} Certificate data
 */
export const getGeneratedCertificate = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/certificates/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch certificate');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('❌ Failed to fetch generated certificate:', error.message);
    throw error;
  }
};

/**
 * Get all generated certificates
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Certificates data
 */
export const getGeneratedCertificates = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const url = `${API_BASE_URL}/certificates${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch certificates');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('❌ Failed to fetch generated certificates:', error.message);
    throw error;
  }
};

/**
 * Update certificate status (print/download)
 * @param {string} id - Certificate ID
 * @param {string} action - Action to track (printed/downloaded)
 * @returns {Promise<Object>} Updated certificate
 */
export const updateCertificateStatus = async (id, action) => {
  try {
    const response = await fetch(`${API_BASE_URL}/certificates/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({ action }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update certificate status');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('❌ Failed to update certificate status:', error.message);
    throw error;
  }
};

/**
 * Export certificate to PDF
 * @param {string} id - Certificate ID
 * @returns {Promise<Object>} PDF data
 */
export const exportCertificateToPDF = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/certificates/${id}/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to export certificate');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('❌ Failed to export certificate:', error.message);
    throw error;
  }
};

/**
 * Get certificate statistics
 * @returns {Promise<Object>} Statistics data
 */
export const getCertificateStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/certificates/stats/summary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch certificate statistics');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('❌ Failed to fetch certificate statistics:', error.message);
    throw error;
  }
};

/**
 * Initialize default templates
 * @returns {Promise<Object>} Initialized templates
 */
export const initializeDefaultTemplates = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/certificates/templates/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to initialize templates');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('❌ Failed to initialize default templates:', error.message);
    throw error;
  }
};