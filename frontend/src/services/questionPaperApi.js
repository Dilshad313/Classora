const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

/**
 * Get token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get all questions with filters
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Questions data
 */
export const getAllQuestions = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    
    const url = `${API_BASE_URL}/question-paper/questions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch questions');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    throw error;
  }
};

/**
 * Get single question by ID
 * @param {string} id - Question ID
 * @returns {Promise<Object>} Question data
 */
export const getQuestionById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/question-paper/questions/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch question');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Failed to fetch question:', error);
    throw error;
  }
};

/**
 * Create new question
 * @param {Object} questionData - Question data
 * @returns {Promise<Object>} Created question
 */
export const createQuestion = async (questionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/question-paper/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(questionData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create question');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating question:', error);
    throw error;
  }
};

/**
 * Update question
 * @param {string} id - Question ID
 * @param {Object} questionData - Updated question data
 * @returns {Promise<Object>} Updated question
 */
export const updateQuestion = async (id, questionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/question-paper/questions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(questionData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update question');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error updating question:', error);
    throw error;
  }
};

/**
 * Delete question
 * @param {string} id - Question ID
 * @returns {Promise<Object>} Success message
 */
export const deleteQuestion = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/question-paper/questions/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete question');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
};

/**
 * Get dropdown data
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Dropdown data
 */
export const getDropdownData = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params);
    const url = `${API_BASE_URL}/question-paper/dropdown-data${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
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
    console.error('Failed to fetch dropdown data:', error);
    throw error;
  }
};

/**
 * Get question statistics
 * @returns {Promise<Object>} Statistics data
 */
export const getQuestionStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/question-paper/questions/stats/summary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch statistics');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Failed to fetch statistics:', error);
    throw error;
  }
};

/**
 * Get chapter statistics
 * @returns {Promise<Object>} Statistics data
 */
export const getChapterStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/question-paper/chapters/stats/summary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch chapter statistics');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Failed to fetch chapter statistics:', error);
    throw error;
  }
};

/**
 * Get all chapters
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Chapters data
 */
export const getAllChapters = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    
    const url = `${API_BASE_URL}/question-paper/chapters${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch chapters');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch chapters:', error);
    throw error;
  }
};

/**
 * Create new chapter
 * @param {Object} chapterData - Chapter data
 * @returns {Promise<Object>} Created chapter
 */
export const createChapter = async (chapterData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/question-paper/chapters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(chapterData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create chapter');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating chapter:', error);
    throw error;
  }
};

/**
 * Update chapter
 * @param {string} id - Chapter ID
 * @param {Object} chapterData - Updated chapter data
 * @returns {Promise<Object>} Updated chapter
 */
export const updateChapter = async (id, chapterData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/question-paper/chapters/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(chapterData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update chapter');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error updating chapter:', error);
    throw error;
  }
};

/**
 * Delete chapter
 * @param {string} id - Chapter ID
 * @returns {Promise<Object>} Success message
 */
export const deleteChapter = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/question-paper/chapters/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete chapter');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting chapter:', error);
    throw error;
  }
};

/**
 * Bulk delete questions
 * @param {Array<string>} ids - Array of question IDs
 * @returns {Promise<Object>} Success message
 */
export const bulkDeleteQuestions = async (ids) => {
  try {
    const response = await fetch(`${API_BASE_URL}/question-paper/questions/bulk-delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({ ids }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete questions');
    }

    return await response.json();
  } catch (error) {
    console.error('Error bulk deleting questions:', error);
    throw error;
  }
};