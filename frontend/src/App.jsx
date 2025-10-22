import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './components/Layout/DashboardLayout';
import Home from './pages/Dashboard/Home';
import GeneralSettings from './pages/Admin/GeneralSettings';
import Classes from './pages/Academic/Classes';
import AllStudents from './pages/Students/AllStudents';
import MarkAttendance from './pages/Attendance/MarkAttendance';
import AllExams from './pages/Exams/AllExams';
import FeeStructure from './pages/Fees/FeeStructure';
import NoticeBoard from './pages/Communication/NoticeBoard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          
          {/* General Settings Routes */}
          <Route path="settings/institute" element={<GeneralSettings />} />
          <Route path="settings/fees-particulars" element={<div className="card">Fees Particulars - Coming Soon</div>} />
          <Route path="settings/fees-structure" element={<FeeStructure />} />
          <Route path="settings/accounts" element={<div className="card">Accounts For Fees Invoice - Coming Soon</div>} />
          <Route path="settings/rules" element={<div className="card">Rules & Regulations - Coming Soon</div>} />
          <Route path="settings/grading" element={<div className="card">Marks Grading - Coming Soon</div>} />
          <Route path="settings/theme" element={<div className="card">Theme & Language - Coming Soon</div>} />
          <Route path="settings/account" element={<div className="card">Account Settings - Coming Soon</div>} />
          
          {/* Admin Routes */}
          <Route path="admin/settings" element={<GeneralSettings />} />
          <Route path="admin/roles" element={<div className="card">Roles & Permissions - Coming Soon</div>} />
          <Route path="admin/backup" element={<div className="card">Backup & Restore - Coming Soon</div>} />
          
          {/* Academic Routes */}
          <Route path="academic/classes" element={<Classes />} />
          <Route path="academic/subjects" element={<div className="card">Subjects - Coming Soon</div>} />
          <Route path="academic/routine" element={<div className="card">Class Routine - Coming Soon</div>} />
          <Route path="academic/syllabus" element={<div className="card">Syllabus - Coming Soon</div>} />
          
          {/* Student Routes */}
          <Route path="students/all" element={<AllStudents />} />
          <Route path="students/add" element={<div className="card">Add Student - Coming Soon</div>} />
          <Route path="students/promotion" element={<div className="card">Student Promotion - Coming Soon</div>} />
          <Route path="students/id-card" element={<div className="card">ID Card Generator - Coming Soon</div>} />
          
          {/* Staff Routes */}
          <Route path="staff/all" element={<div className="card">All Staff - Coming Soon</div>} />
          <Route path="staff/add" element={<div className="card">Add Staff - Coming Soon</div>} />
          <Route path="staff/departments" element={<div className="card">Departments - Coming Soon</div>} />
          <Route path="staff/attendance" element={<div className="card">Staff Attendance - Coming Soon</div>} />
          
          {/* Attendance Routes */}
          <Route path="attendance/mark" element={<MarkAttendance />} />
          <Route path="attendance/reports" element={<div className="card">Attendance Reports - Coming Soon</div>} />
          <Route path="attendance/settings" element={<div className="card">Attendance Settings - Coming Soon</div>} />
          
          {/* Homework Routes */}
          <Route path="homework/all" element={<div className="card">All Assignments - Coming Soon</div>} />
          <Route path="homework/create" element={<div className="card">Create Assignment - Coming Soon</div>} />
          <Route path="homework/submissions" element={<div className="card">Submissions - Coming Soon</div>} />
          
          {/* Exam Routes */}
          <Route path="exams/all" element={<AllExams />} />
          <Route path="exams/schedule" element={<div className="card">Exam Schedule - Coming Soon</div>} />
          <Route path="exams/marks" element={<div className="card">Mark Entry - Coming Soon</div>} />
          <Route path="exams/reports" element={<div className="card">Report Cards - Coming Soon</div>} />
          
          {/* Fee Routes */}
          <Route path="fees/structure" element={<FeeStructure />} />
          <Route path="fees/collect" element={<div className="card">Collect Fees - Coming Soon</div>} />
          <Route path="fees/reports" element={<div className="card">Fee Reports - Coming Soon</div>} />
          <Route path="fees/invoices" element={<div className="card">Invoices - Coming Soon</div>} />
          
          {/* Communication Routes */}
          <Route path="communication/notices" element={<NoticeBoard />} />
          <Route path="communication/messages" element={<div className="card">Messages - Coming Soon</div>} />
          <Route path="communication/events" element={<div className="card">Events - Coming Soon</div>} />
          
          {/* Library Routes */}
          <Route path="library/books" element={<div className="card">Books - Coming Soon</div>} />
          <Route path="library/issue" element={<div className="card">Issue/Return - Coming Soon</div>} />
          <Route path="library/members" element={<div className="card">Library Members - Coming Soon</div>} />
          
          {/* Transport Routes */}
          <Route path="transport/routes" element={<div className="card">Routes - Coming Soon</div>} />
          <Route path="transport/vehicles" element={<div className="card">Vehicles - Coming Soon</div>} />
          <Route path="transport/assign" element={<div className="card">Assign Students - Coming Soon</div>} />
          
          {/* Online Classes Routes */}
          <Route path="online/schedule" element={<div className="card">Schedule Class - Coming Soon</div>} />
          <Route path="online/join" element={<div className="card">Join Class - Coming Soon</div>} />
          <Route path="online/recordings" element={<div className="card">Recordings - Coming Soon</div>} />
          
          {/* Reports Routes */}
          <Route path="reports/students" element={<div className="card">Student Reports - Coming Soon</div>} />
          <Route path="reports/academic" element={<div className="card">Academic Reports - Coming Soon</div>} />
          <Route path="reports/financial" element={<div className="card">Financial Reports - Coming Soon</div>} />
          <Route path="reports/custom" element={<div className="card">Custom Reports - Coming Soon</div>} />
        </Route>
        
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
