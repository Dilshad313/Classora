const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

/**
 * Get token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Get auth headers
 */
const getAuthHeaders = () => ({
  'Authorization': `Bearer ${getAuthToken()}`,
  'Content-Type': 'application/json'
});

// Classroom API
export const classroomApi = {
  // Get all classrooms
  getClassrooms: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.search) queryParams.append('search', params.search);
      if (params.type && params.type !== 'all') queryParams.append('type', params.type);
      if (params.building && params.building !== 'all') queryParams.append('building', params.building);
      if (params.isAvailable && params.isAvailable !== 'all') queryParams.append('isAvailable', params.isAvailable);
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/timetable/classrooms${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        return result;
      } else {
        throw new Error(result.message || 'Failed to fetch classrooms');
      }
    } catch (error) {
      console.error(`❌ Failed to fetch classrooms:`, error.message);
      throw error;
    }
  },

  // Get classroom by ID
  getClassroomById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/timetable/classrooms/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch classroom');
      }
    } catch (error) {
      console.error(`❌ Failed to fetch classroom:`, error.message);
      throw error;
    }
  },

  // Create classroom
  createClassroom: async (classroomData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/timetable/classrooms`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(classroomData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to create classroom');
      }

      return result.data;
    } catch (error) {
      console.error('❌ Error creating classroom:', error);
      throw error;
    }
  },

  // Update classroom
  updateClassroom: async (id, classroomData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/timetable/classrooms/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(classroomData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to update classroom');
      }

      return result.data;
    } catch (error) {
      console.error('❌ Error updating classroom:', error);
      throw error;
    }
  },

  // Delete classroom
  deleteClassroom: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/timetable/classrooms/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to delete classroom');
      }

      return result;
    } catch (error) {
      console.error('❌ Error deleting classroom:', error);
      throw error;
    }
  },

  // Toggle classroom availability
  toggleAvailability: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/timetable/classrooms/${id}/toggle-availability`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to toggle availability');
      }

      return result.data;
    } catch (error) {
      console.error('❌ Error toggling availability:', error);
      throw error;
    }
  },

  // Get classroom statistics
  getClassroomStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/timetable/classrooms/stats/summary`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
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
  }
};

// TimePeriod API
export const timePeriodApi = {
  // Get all time periods
  getTimePeriods: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/timetable/time-periods`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch time periods');
      }
    } catch (error) {
      console.error(`❌ Failed to fetch time periods:`, error.message);
      throw error;
    }
  },

  // Create time period
  createTimePeriod: async (periodData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/timetable/time-periods`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(periodData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to create time period');
      }

      return result.data;
    } catch (error) {
      console.error('❌ Error creating time period:', error);
      throw error;
    }
  },

  // Update time period
  updateTimePeriod: async (id, periodData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/timetable/time-periods/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(periodData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to update time period');
      }

      return result.data;
    } catch (error) {
      console.error('❌ Error updating time period:', error);
      throw error;
    }
  },

  // Delete time period
  deleteTimePeriod: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/timetable/time-periods/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to delete time period');
      }

      return result;
    } catch (error) {
      console.error('❌ Error deleting time period:', error);
      throw error;
    }
  },

  // Get time period statistics
  getTimePeriodStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/timetable/time-periods/stats/summary`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
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
  }
};

// WeekDay API
export const weekDayApi = {
  // Get all week days
  getWeekDays: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/timetable/week-days`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch week days');
      }
    } catch (error) {
      console.error(`❌ Failed to fetch week days:`, error.message);
      throw error;
    }
  },

  // Create week day
  createWeekDay: async (dayData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/timetable/week-days`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(dayData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to create week day');
      }

      return result.data;
    } catch (error) {
      console.error('❌ Error creating week day:', error);
      throw error;
    }
  },

  // Update week day
  updateWeekDay: async (id, dayData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/timetable/week-days/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(dayData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to update week day');
      }

      return result.data;
    } catch (error) {
      console.error('❌ Error updating week day:', error);
      throw error;
    }
  },

  // Delete week day
  deleteWeekDay: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/timetable/week-days/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to delete week day');
      }

      return result;
    } catch (error) {
      console.error('❌ Error deleting week day:', error);
      throw error;
    }
  },

  // Toggle week day active status
  toggleWeekDayActive: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/timetable/week-days/${id}/toggle-active`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to toggle active status');
      }

      return result.data;
    } catch (error) {
      console.error('❌ Error toggling active status:', error);
      throw error;
    }
  },

  // Get week day statistics
  getWeekDayStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/timetable/week-days/stats/summary`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
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
  }
};

// Timetable API
export const timetableApi = {
  // Create or update timetable
  createOrUpdateTimetable: async (timetableData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/timetable`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(timetableData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to save timetable');
      }

      return result.data;
    } catch (error) {
      console.error('❌ Error saving timetable:', error);
      throw error;
    }
  },

  // Get timetable by class
  getTimetableByClass: async (classId, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.academicYear) queryParams.append('academicYear', params.academicYear);
      if (params.term) queryParams.append('term', params.term);
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/timetable/class/${classId}${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch timetable');
      }
    } catch (error) {
      console.error(`❌ Failed to fetch timetable:`, error.message);
      throw error;
    }
  },

  // Get timetable by teacher
  getTimetableByTeacher: async (teacherId, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.academicYear) queryParams.append('academicYear', params.academicYear);
      if (params.term) queryParams.append('term', params.term);
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/timetable/teacher/${teacherId}${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch teacher timetable');
      }
    } catch (error) {
      console.error(`❌ Failed to fetch teacher timetable:`, error.message);
      throw error;
    }
  },

  // Get all timetables
  getAllTimetables: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.classId) queryParams.append('classId', params.classId);
      if (params.academicYear && params.academicYear !== 'all') queryParams.append('academicYear', params.academicYear);
      if (params.term && params.term !== 'all') queryParams.append('term', params.term);
      if (params.isActive && params.isActive !== 'all') queryParams.append('isActive', params.isActive);
      
      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/timetable${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        return result;
      } else {
        throw new Error(result.message || 'Failed to fetch timetables');
      }
    } catch (error) {
      console.error(`❌ Failed to fetch timetables:`, error.message);
      throw error;
    }
  },

  // Delete timetable
  deleteTimetable: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/timetable/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to delete timetable');
      }

      return result;
    } catch (error) {
      console.error('❌ Error deleting timetable:', error);
      throw error;
    }
  },

  // Get available resources
  getAvailableResources: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/timetable/resources/available`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch available resources');
      }
    } catch (error) {
      console.error(`❌ Failed to fetch available resources:`, error.message);
      throw error;
    }
  },

  // Get timetable statistics
  getTimetableStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/timetable/stats/summary`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
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
  }
};

export default {
  classroomApi,
  timePeriodApi,
  weekDayApi,
  timetableApi
};