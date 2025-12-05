// frontend/src/api/salaryApi.js
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Salary API functions
export const salaryApi = {
  // Pay salary to employee
  paySalary: async (salaryData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/salary/pay`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(salaryData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to pay salary');
      }
      
      return result;
    } catch (error) {
      console.error('Pay salary error:', error);
      throw error;
    }
  },

  // Get salary slip by ID
  getSalarySlip: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/salary/slip/${id}`, {
        headers: getAuthHeaders()
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch salary slip');
      }
      
      return result;
    } catch (error) {
      console.error('Get salary slip error:', error);
      throw error;
    }
  },

  // Get salary report
  getSalaryReport: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params);
      const response = await fetch(`${API_BASE_URL}/salary/report?${queryParams}`, {
        headers: getAuthHeaders()
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch salary report');
      }
      
      return result;
    } catch (error) {
      console.error('Get salary report error:', error);
      throw error;
    }
  },

  // Get salary sheet with filters
  getSalarySheet: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params);
      const response = await fetch(`${API_BASE_URL}/salary/sheet?${queryParams}`, {
        headers: getAuthHeaders()
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch salary sheet');
      }
      
      return result;
    } catch (error) {
      console.error('Get salary sheet error:', error);
      throw error;
    }
  },

  // Search employees for salary payment
  searchEmployees: async (searchQuery) => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      const response = await fetch(`${API_BASE_URL}/salary/employees?${params}`, {
        headers: getAuthHeaders()
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to search employees');
      }
      
      return result;
    } catch (error) {
      console.error('Search employees error:', error);
      throw error;
    }
  },

  // Update salary status
  updateSalaryStatus: async (id, statusData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/salary/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(statusData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to update salary status');
      }
      
      return result;
    } catch (error) {
      console.error('Update salary status error:', error);
      throw error;
    }
  },

  // Delete salary record
  deleteSalary: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/salary/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete salary record');
      }
      
      return result;
    } catch (error) {
      console.error('Delete salary error:', error);
      throw error;
    }
  }
};

export default salaryApi;