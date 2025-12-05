const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No authentication token found');
    throw new Error('Authentication required. Please log in again.');
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Enhanced fetch wrapper with better error handling
const fetchWithAuth = async (url, options = {}) => {
  try {
    const headers = getAuthHeaders();
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      // Handle authentication errors
      if (response.status === 401) {
        // Clear invalid token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Session expired. Please log in again.');
      }

      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Account API operations
export const accountApi = {
  // Add expense
  addExpense: async (expenseData) => {
    try {
      console.log('Sending expense data:', expenseData);
      const result = await fetchWithAuth(`${API_BASE_URL}/transactions/expense`, {
        method: 'POST',
        body: JSON.stringify(expenseData)
      });
      
      return result;
    } catch (error) {
      console.error('Add expense error:', error);
      throw new Error(error.message || 'Failed to add expense. Please check your connection and try again.');
    }
  },

  // Add income
  addIncome: async (incomeData) => {
    try {
      console.log('Sending income data:', incomeData);
      const result = await fetchWithAuth(`${API_BASE_URL}/transactions/income`, {
        method: 'POST',
        body: JSON.stringify(incomeData)
      });
      
      return result;
    } catch (error) {
      console.error('Add income error:', error);
      throw new Error(error.message || 'Failed to add income. Please check your connection and try again.');
    }
  },

  // Get account statement with filters
  getAccountStatement: async (filters = {}) => {
    try {
      const { filterType, startDate, endDate, search, showReferences } = filters;
      const params = new URLSearchParams();
      
      if (filterType) params.append('filterType', filterType);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (search) params.append('search', search);
      if (showReferences !== undefined) params.append('showReferences', showReferences);

      return await fetchWithAuth(`${API_BASE_URL}/transactions/statement?${params}`);
    } catch (error) {
      console.error('Get account statement error:', error);
      throw error;
    }
  },

  // Delete transactions
  deleteTransactions: async (transactionIds) => {
    try {
      return await fetchWithAuth(`${API_BASE_URL}/transactions/bulk-delete`, {
        method: 'DELETE',
        body: JSON.stringify({ transactionIds })
      });
    } catch (error) {
      console.error('Delete transactions error:', error);
      throw error;
    }
  },

  // Get account statistics
  getAccountStats: async () => {
    try {
      return await fetchWithAuth(`${API_BASE_URL}/transactions/stats`);
    } catch (error) {
      console.error('Get account stats error:', error);
      throw error;
    }
  },

  // Get all transactions
  getTransactions: async (filters = {}) => {
    try {
      const { search, type, category, paymentMethod, status, startDate, endDate, page, limit } = filters;
      const params = new URLSearchParams();
      
      if (search) params.append('search', search);
      if (type && type !== 'all') params.append('type', type);
      if (category && category !== 'all') params.append('category', category);
      if (paymentMethod && paymentMethod !== 'all') params.append('paymentMethod', paymentMethod);
      if (status && status !== 'all') params.append('status', status);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (page) params.append('page', page);
      if (limit) params.append('limit', limit);

      return await fetchWithAuth(`${API_BASE_URL}/transactions?${params}`);
    } catch (error) {
      console.error('Get transactions error:', error);
      throw error;
    }
  },

  // Get transaction by ID
  getTransactionById: async (id) => {
    try {
      return await fetchWithAuth(`${API_BASE_URL}/transactions/${id}`);
    } catch (error) {
      console.error('Get transaction error:', error);
      throw error;
    }
  },

  // Update transaction
  updateTransaction: async (id, transactionData) => {
    try {
      return await fetchWithAuth(`${API_BASE_URL}/transactions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(transactionData)
      });
    } catch (error) {
      console.error('Update transaction error:', error);
      throw error;
    }
  }
};

export default accountApi;