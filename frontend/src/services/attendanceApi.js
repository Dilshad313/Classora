const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Student Attendance API
export const attendanceApi = {
  // Get students for attendance marking
  getStudentsForAttendance: async (classData, section, date) => {
    try {
      const params = new URLSearchParams();
      params.append('class', classData);
      params.append('section', section);
      if (date) params.append('date', date);

      const response = await fetch(`${API_BASE_URL}/attendance/students/class?${params}`, {
        headers: getAuthHeaders()
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch students');
      }
      
      return result.data;
    } catch (error) {
      console.error('Get students for attendance error:', error);
      throw error;
    }
  },

  // Mark student attendance
  markStudentAttendance: async (attendanceData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/students`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(attendanceData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to mark attendance');
      }
      
      return result;
    } catch (error) {
      console.error('Mark student attendance error:', error);
      throw error;
    }
  },

  // Get employees for attendance marking
  getEmployeesForAttendance: async (date) => {
    try {
      const params = new URLSearchParams();
      if (date) params.append('date', date);

      const response = await fetch(`${API_BASE_URL}/attendance/employees?${params}`, {
        headers: getAuthHeaders()
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch employees');
      }
      
      return result.data;
    } catch (error) {
      console.error('Get employees for attendance error:', error);
      throw error;
    }
  },

  // Mark employee attendance
  markEmployeeAttendance: async (attendanceData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/employees`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(attendanceData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to mark attendance');
      }
      
      return result;
    } catch (error) {
      console.error('Mark employee attendance error:', error);
      throw error;
    }
  },

  // Get class-wise report
  getClassWiseReport: async (date) => {
    try {
      const params = new URLSearchParams();
      params.append('date', date);

      const response = await fetch(`${API_BASE_URL}/attendance/reports/class-wise?${params}`, {
        headers: getAuthHeaders()
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch class-wise report');
      }
      
      return result.data;
    } catch (error) {
      console.error('Get class-wise report error:', error);
      throw error;
    }
  },

  // Get student attendance report
  getStudentAttendanceReport: async (filters) => {
    try {
      const { startDate, endDate, search, class: classFilter, status, page, limit } = filters;
      const params = new URLSearchParams();
      
      params.append('startDate', startDate);
      params.append('endDate', endDate);
      if (search) params.append('search', search);
      if (classFilter && classFilter !== 'all') params.append('class', classFilter);
      if (status && status !== 'all') params.append('status', status);
      if (page) params.append('page', page);
      if (limit) params.append('limit', limit);

      const response = await fetch(`${API_BASE_URL}/attendance/reports/students?${params}`, {
        headers: getAuthHeaders()
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch student report');
      }
      
      return result;
    } catch (error) {
      console.error('Get student report error:', error);
      throw error;
    }
  },

  // Get employee attendance report
  getEmployeeAttendanceReport: async (filters) => {
    try {
      const { startDate, endDate, search, department, role, status, page, limit } = filters;
      const params = new URLSearchParams();
      
      params.append('startDate', startDate);
      params.append('endDate', endDate);
      if (search) params.append('search', search);
      if (department && department !== 'all') params.append('department', department);
      if (role && role !== 'all') params.append('role', role);
      if (status && status !== 'all') params.append('status', status);
      if (page) params.append('page', page);
      if (limit) params.append('limit', limit);

      const response = await fetch(`${API_BASE_URL}/attendance/reports/employees?${params}`, {
        headers: getAuthHeaders()
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch employee report');
      }
      
      return result;
    } catch (error) {
      console.error('Get employee report error:', error);
      throw error;
    }
  },

  // Export student report
  exportStudentReport: async (exportData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/reports/students/export`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(exportData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to export report');
      }
      
      return result.data;
    } catch (error) {
      console.error('Export student report error:', error);
      throw error;
    }
  },

  // Export employee report
  exportEmployeeReport: async (exportData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/reports/employees/export`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(exportData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to export report');
      }
      
      return result.data;
    } catch (error) {
      console.error('Export employee report error:', error);
      throw error;
    }
  }
};

export default attendanceApi;