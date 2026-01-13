const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

const getAuthToken = () => localStorage.getItem('token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`
});

export const getTeacherClasses = async () => {
  const response = await fetch(`${API_BASE_URL}/behaviours/classes`, {
    method: 'GET',
    headers: authHeaders()
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to load classes');
  }

  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to load classes');
  return result.data || [];
};

export const getClassStudentsWithRatings = async (classId) => {
  const response = await fetch(`${API_BASE_URL}/behaviours/class/${classId}/students`, {
    method: 'GET',
    headers: authHeaders()
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to load students');
  }

  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to load students');
  return result.data || [];
};

export const saveBehaviourRatings = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/behaviours/save`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to save ratings');
  }

  const result = await response.json();
  if (!result.success) throw new Error(result.message || 'Failed to save ratings');
  return result;
};

export const behaviourApi = {
  getTeacherClasses,
  getClassStudentsWithRatings,
  saveBehaviourRatings
};

export default behaviourApi;
