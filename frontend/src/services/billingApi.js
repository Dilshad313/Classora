// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

/**
 * Get token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get billing information
 * @returns {Promise<Object>} Billing data
 */
export const getBilling = async () => {
  try {
    console.log('🔗 Fetching billing information');
    
    const response = await fetch(`${API_BASE_URL}/billing`, {
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
      throw new Error(result.message || 'Failed to fetch billing information');
    }
  } catch (error) {
    console.error(`❌ Failed to fetch billing:`, error.message);
    throw error;
  }
};

/**
 * Update billing information
 * @param {Object} billingData - Billing data to update
 * @returns {Promise<Object>} Updated billing
 */
export const updateBilling = async (billingData) => {
  try {
    console.log('📤 Updating billing information:', billingData);
    
    const response = await fetch(`${API_BASE_URL}/billing`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(billingData),
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

    console.log('✅ Billing updated successfully');
    return result.data;
  } catch (error) {
    console.error('❌ Error updating billing:', error);
    throw error;
  }
};

/**
 * Update subscription
 * @param {Object} subscriptionData - Subscription data
 * @returns {Promise<Object>} Updated billing
 */
export const updateSubscription = async (subscriptionData) => {
  try {
    console.log('📤 Updating subscription:', subscriptionData);
    
    const response = await fetch(`${API_BASE_URL}/billing/subscription`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(subscriptionData),
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

    console.log('✅ Subscription updated successfully');
    return result.data;
  } catch (error) {
    console.error('❌ Error updating subscription:', error);
    throw error;
  }
};

/**
 * Cancel subscription
 * @returns {Promise<Object>} Updated billing
 */
export const cancelSubscription = async () => {
  try {
    console.log('📤 Cancelling subscription');
    
    const response = await fetch(`${API_BASE_URL}/billing/subscription/cancel`, {
      method: 'POST',
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
      throw new Error(result.message || 'Cancel failed');
    }

    console.log('✅ Subscription cancelled successfully');
    return result.data;
  } catch (error) {
    console.error('❌ Error cancelling subscription:', error);
    throw error;
  }
};

/**
 * Get invoices
 * @returns {Promise<Array>} Invoices array
 */
export const getInvoices = async () => {
  try {
    console.log('🔗 Fetching invoices');
    
    const response = await fetch(`${API_BASE_URL}/billing/invoices`, {
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
      throw new Error(result.message || 'Failed to fetch invoices');
    }
  } catch (error) {
    console.error(`❌ Failed to fetch invoices:`, error.message);
    throw error;
  }
};