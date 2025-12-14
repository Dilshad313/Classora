const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const globalSearch = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
    });

    if (!response.ok) {
        throw new Error('Search failed');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Search API Error:', error);
    throw error;
  }
};
