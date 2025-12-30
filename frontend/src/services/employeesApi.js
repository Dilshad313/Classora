// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

/**
 * Get token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Convert object to FormData (for file uploads)
 * @param {Object} data - Data object
 * @returns {FormData} FormData object
 */
export const convertToFormData = (data) => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    const value = data[key];
    
    // Handle file objects
    if (value instanceof File) {
      formData.append(key, value);
    }
    // Handle arrays
    else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === 'object' && !(item instanceof File)) {
          formData.append(`${key}[${index}]`, JSON.stringify(item));
        } else {
          formData.append(`${key}[${index}]`, item);
        }
      });
    }
    // Handle objects (but not File or null)
    else if (typeof value === 'object' && value !== null && !(value instanceof File)) {
      formData.append(key, JSON.stringify(value));
    }
    // Handle primitives
    else if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });
  
  return formData;
};

/**
 * Get all employees with filters
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Employees data
 */
export const getEmployees = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const url = `${API_BASE_URL}/employees${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    console.log(`🔗 Fetching employees from: ${url}`);
    
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
      return result;
    } else {
      throw new Error(result.message || 'Failed to fetch employees');
    }
  } catch (error) {
    console.error(`❌ Failed to fetch employees:`, error.message);
    
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 5000.');
    }
    
    throw error;
  }
};

/**
 * Get employee by ID
 * @param {string} id - Employee ID
 * @returns {Promise<Object>} Employee data
 */
export const getEmployeeById = async (id) => {
  try {
    console.log(`🔗 Fetching employee: ${id}`);
    
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
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
      throw new Error(result.message || 'Failed to fetch employee');
    }
  } catch (error) {
    console.error(`❌ Failed to fetch employee:`, error.message);
    throw error;
  }
};

/**
 * Create new employee
 * @param {Object} employeeData - Employee data
 * @returns {Promise<Object>} Created employee
 */
export const createEmployee = async (employeeData) => {
  try {
    console.log('📤 Creating employee:', employeeData);
    
    const isFormData = employeeData instanceof FormData;
    const headers = {
      'Authorization': `Bearer ${getAuthToken()}`
    };
    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: headers,
      body: isFormData ? employeeData : JSON.stringify(employeeData),
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
      throw new Error(result.message || 'Create failed');
    }

    console.log('✅ Employee created successfully');
    return result.data; // Return the employee data directly
  } catch (error) {
    console.error('❌ Error creating employee:', error);
    throw error;
  }
};

/**
 * Update employee
 * @param {string} id - Employee ID
 * @param {Object} employeeData - Updated employee data
 * @returns {Promise<Object>} Updated employee
 */
export const updateEmployee = async (id, employeeData) => {
  try {
    console.log(`📤 Updating employee ${id}:`, employeeData);
    
    const isFormData = employeeData instanceof FormData;
    const headers = {
      'Authorization': `Bearer ${getAuthToken()}`
    };
    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'PUT',
      headers: headers,
      body: isFormData ? employeeData : JSON.stringify(employeeData),
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

    console.log('✅ Employee updated successfully');
    return result.data; // Return the employee data directly
  } catch (error) {
    console.error('❌ Error updating employee:', error);
    throw error;
  }
};

/**
 * Get employees for ID cards (active employees only)
 * @returns {Promise<Object>} Employees data
 */
export const getEmployeesForIDCards = async () => {
  try {
    console.log('🔗 Fetching employees for ID cards');
    
    const response = await fetch(`${API_BASE_URL}/employees?status=active`, {
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
      return result;
    } else {
      throw new Error(result.message || 'Failed to fetch employees');
    }
  } catch (error) {
    console.error('❌ Failed to fetch employees for ID cards:', error.message);
    throw error;
  }
};

/**
 * Delete employee
 * @param {string} id - Employee ID
 * @returns {Promise<Object>} Success message
 */
export const deleteEmployee = async (id) => {
  try {
    console.log(`🗑️ Deleting employee: ${id}`);
    
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
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

    console.log('✅ Employee deleted successfully');
    return result;
  } catch (error) {
    console.error('❌ Error deleting employee:', error);
    throw error;
  }
};

// Export as API object
export const employeesApi = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesForIDCards
};

// Alias for consistency (singular form)
export const employeeApi = employeesApi;

export default employeesApi;
