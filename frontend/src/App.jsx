import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './components/Layout/DashboardLayout';
import Home from './pages/Dashboard/Home';
import GeneralSettings from './pages/Admin/GeneralSettings';

import InstituteProfile from './pages/Dashboard/settings/InstituteProfile';
import FeesParticulars from './pages/Dashboard/settings/FeesParticulars';
import FeeStructure from './pages/Dashboard/settings/FeeStructure';
import AccountInvoice from './pages/Dashboard/settings/AccountInvoice';
import RulesRegulations from './pages/Dashboard/settings/RulesRegulations';
import MarksGrading from './pages/Dashboard/settings/MarksGrading';
import AccountSettings from './pages/Dashboard/settings/AccountSettings';

import AllClasses from './pages/Dashboard/classes/AllClasses';
import NewClasses from './pages/Dashboard/classes/NewClasses';

import ClassesWithSubject from './pages/Dashboard/subjects/ClassesWithSubject';
import AssignSubject from './pages/Dashboard/subjects/AssignSubject';

import AllStudents from './pages/Dashboard/students/AllStudents';
import AddStudents from './pages/Dashboard/students/AddStudents';
import ManageFamily from './pages/Dashboard/students/ManageFamily';
import ActiveInactive from './pages/Dashboard/students/ActiveInactive';
import AdmissionLetter from './pages/Dashboard/students/AdmissionLetter';
import StudentIDCard from './pages/Dashboard/students/StudentIDCard';
import PrintBasicList from './pages/Dashboard/students/PrintBasicList';
import ManageLogin from './pages/Dashboard/students/ManageLogin';
import PromoteStudents from './pages/Dashboard/students/PromoteStudents'

import AllEmployees from './pages/Dashboard/employees/AllEmployees';
import AddEmployees from './pages/Dashboard/employees/AddEmployees';
import EmployeesIDCard from './pages/Dashboard/employees/EmployeesIDCard';
import JobLetter from './pages/Dashboard/employees/JobLetter';
import EmployeeManageLogin from './pages/Dashboard/employees/EmployeeManageLogin';

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
          <Route path="settings/institute" element={<InstituteProfile />} />
          <Route path="settings/fees-particulars" element={<FeesParticulars/>} />
          <Route path="settings/fees-structure" element={<FeeStructure />} />
          <Route path="settings/accounts" element={<AccountInvoice/>} />
          <Route path="settings/rules" element={<RulesRegulations/>} />
          <Route path="settings/grading" element={<MarksGrading/>} />
          <Route path="settings/account" element={<AccountSettings/>} />

          {/* Classes Routes */}
          <Route path="classes/all" element={<AllClasses/>} />
          <Route path="classes/new" element={<NewClasses/>} />

          {/* Subjects Routes */}
          <Route path="subjects/classes" element={<ClassesWithSubject/>} />
          <Route path="subjects/assign" element={<AssignSubject/>} />

          {/* Students Routes */}
          <Route path="students/all" element={<AllStudents/>} />
          <Route path="students/add-new" element={<AddStudents/>} />
          <Route path="students/families" element={<ManageFamily/>} />
          <Route path="students/status" element={<ActiveInactive/>} />
          <Route path="students/admission-letter" element={<AdmissionLetter/>} />
          <Route path="students/student-idcard" element={<StudentIDCard/>} />
          <Route path="students/print-list" element={<PrintBasicList/>} />
          <Route path="students/manage-login" element={<ManageLogin/>} />
          <Route path="students/promote" element={<PromoteStudents/>} />

          {/* Employee Routes */}
          <Route path="employee/all" element={<AllEmployees/>} />
          <Route path="employee/add-new" element={<AddEmployees/>} />
          <Route path="employee/id-cards" element={<EmployeesIDCard/>} />
          <Route path="employee/job-letter" element={<JobLetter/>} />
          <Route path="employee/manage-login" element={<EmployeeManageLogin/>} />


          {/* Admin Routes */}
          <Route path="admin/settings" element={<GeneralSettings />} />
          <Route path="admin/roles" element={<div className="card">Roles & Permissions - Coming Soon</div>} />
          <Route path="admin/backup" element={<div className="card">Backup & Restore - Coming Soon</div>} />
          
          {/* Staff Routes */}
          <Route path="staff/all" element={<div className="card">All Staff - Coming Soon</div>} />
          <Route path="staff/add" element={<div className="card">Add Staff - Coming Soon</div>} />
          <Route path="staff/departments" element={<div className="card">Departments - Coming Soon</div>} />
          <Route path="staff/attendance" element={<div className="card">Staff Attendance - Coming Soon</div>} />
          
          {/* Attendance Routes */}
          <Route path="attendance/mark" element={<div className="card">Mark Attendance - Coming Soon</div>} />
          <Route path="attendance/reports" element={<div className="card">Attendance Reports - Coming Soon</div>} />
          <Route path="attendance/settings" element={<div className="card">Attendance Settings - Coming Soon</div>} />
          
          {/* Homework Routes */}
          <Route path="homework/all" element={<div className="card">All Assignments - Coming Soon</div>} />
          <Route path="homework/create" element={<div className="card">Create Assignment - Coming Soon</div>} />
          <Route path="homework/submissions" element={<div className="card">Submissions - Coming Soon</div>} />
          
          {/* Exam Routes */}
          <Route path="exams/all" element={<div className="card">All Exams - Coming Soon</div>} />
          <Route path="exams/schedule" element={<div className="card">Exam Schedule - Coming Soon</div>} />
          <Route path="exams/marks" element={<div className="card">Mark Entry - Coming Soon</div>} />
          <Route path="exams/reports" element={<div className="card">Report Cards - Coming Soon</div>} />
          
          {/* Fee Routes */}
          <Route path="fees/structure" element={<FeeStructure />} />
          <Route path="fees/collect" element={<div className="card">Collect Fees - Coming Soon</div>} />
          <Route path="fees/reports" element={<div className="card">Fee Reports - Coming Soon</div>} />
          <Route path="fees/invoices" element={<div className="card">Invoices - Coming Soon</div>} />
          
          {/* Communication Routes */}
          <Route path="communication/notices" element={<div className="card">Notice Board - Coming Soon</div>} />
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
