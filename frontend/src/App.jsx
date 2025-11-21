import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "react-hot-toast";

import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './pages/Admin/Layout/DashboardLayout';
import Home from './pages/Admin/Dashboard/Home';

import InstituteProfile from './pages/Admin/Dashboard/settings/InstituteProfile';
import FeesParticulars from './pages/Admin/Dashboard/settings/FeesParticulars';
import FeeStructure from './pages/Admin/Dashboard/settings/FeeStructure';
import AccountInvoice from './pages/Admin/Dashboard/settings/AccountInvoice';
import RulesRegulations from './pages/Admin/Dashboard/settings/RulesRegulations';
import MarksGrading from './pages/Admin/Dashboard/settings/MarksGrading';
import AccountSettings from './pages/Admin/Dashboard/settings/AccountSettings';

import AllClasses from './pages/Admin/Dashboard/classes/AllClasses';
import NewClasses from './pages/Admin/Dashboard/classes/NewClasses';

import ClassesWithSubject from './pages/Admin/Dashboard/subjects/ClassesWithSubject';
import AssignSubject from './pages/Admin/Dashboard/subjects/AssignSubject';

import AllStudents from './pages/Admin/Dashboard/students/AllStudents';
import AddStudents from './pages/Admin/Dashboard/students/AddStudents';
import ManageFamily from './pages/Admin/Dashboard/students/ManageFamily';
import ActiveInactive from './pages/Admin/Dashboard/students/ActiveInactive';
import AdmissionLetter from './pages/Admin/Dashboard/students/AdmissionLetter';
import StudentIDCard from './pages/Admin/Dashboard/students/StudentIDCard';
import PrintBasicList from './pages/Admin/Dashboard/students/PrintBasicList';
import ManageLogin from './pages/Admin/Dashboard/students/ManageLogin';
import PromoteStudents from './pages/Admin/Dashboard/students/PromoteStudents'

import AllEmployees from './pages/Admin/Dashboard/employees/AllEmployees';
import AddEmployees from './pages/Admin/Dashboard/employees/AddEmployees';
import EmployeesIDCard from './pages/Admin/Dashboard/employees/EmployeesIDCard';
import JobLetter from './pages/Admin/Dashboard/employees/JobLetter';
import EmployeeManageLogin from './pages/Admin/Dashboard/employees/EmployeeManageLogin';

import AddIncome from './pages/Admin/Dashboard/account/AddIncome';
import AddExpense from './pages/Admin/Dashboard/account/AddExpense';
import AccountStatement from './pages/Admin/Dashboard/account/AccountStatement';

import GenerateFeesInvoice from './pages/Admin/Dashboard/fees/GenerateFeesInvoice';
import CollectFees from './pages/Admin/Dashboard/fees/CollectFees';
import FeesPaidSlip from './pages/Admin/Dashboard/fees/FeesPaidSlip';
import FeesDefaulters from './pages/Admin/Dashboard/fees/FeesDefaulters';
import FeesReport from './pages/Admin/Dashboard/fees/FeesReport';
import DeleteFees from './pages/Admin/Dashboard/fees/DeleteFees';

import PaySalary from './pages/Admin/Dashboard/salary/PaySalary';
import SalaryPaidSlip from './pages/Admin/Dashboard/salary/SalaryPaidSlip';
import SalarySheet from './pages/Admin/Dashboard/salary/SalarySheet';
import SalaryReport from './pages/Admin/Dashboard/salary/SalaryReport';

import StudentAttendance from './pages/Admin/Dashboard/attendance/StudentAttendance';
import EmployeesAttendance from './pages/Admin/Dashboard/attendance/EmployeesAttendance';
import ClassWiseReport from './pages/Admin/Dashboard/attendance/ClassWiseReport';
import StudentsReport from './pages/Admin/Dashboard/attendance/StudentsReport';
import EmployeeReport from './pages/Admin/Dashboard/attendance/EmployeeReport';

import WeekDays from './pages/Admin/Dashboard/timetable/WeekDays';
import TimePeriods from './pages/Admin/Dashboard/timetable/TimePeriods';
import ClassRooms from './pages/Admin/Dashboard/timetable/ClassRooms';
import CreateTimetable from './pages/Admin/Dashboard/timetable/CreateTimetable';
import GenerateClass from './pages/Admin/Dashboard/timetable/GenerateClass';
import GenerateTeacher from './pages/Admin/Dashboard/timetable/GenerateTeacher';

import HomeWork from './pages/Admin/Dashboard/homework/HomeWork';

import Message from './pages/Admin/Dashboard/messaging/Message';

import FreeSMS from './pages/Admin/Dashboard/sms/FreeSMS';

import LiveClass from './pages/Admin/Dashboard/live-class/LiveClass';

import SubjectChapters from './pages/Admin/Dashboard/question-paper/SubjectChapters';
import QuestionBank from './pages/Admin/Dashboard/question-paper/QuestionBank';
import CreateQuestion from './pages/Admin/Dashboard/question-paper/CreateQuestion';

import CreateExam from './pages/Admin/Dashboard/exams/CreateExam';
import ExamMarks from './pages/Admin/Dashboard/exams/ExamMarks';
import ResultCard from './pages/Admin/Dashboard/exams/ResultCard';

import ManageTest from './pages/Admin/Dashboard/class-tests/ManageTest';
import TestResult from './pages/Admin/Dashboard/class-tests/TestResult';

import StudentCard from './pages/Admin/Dashboard/reports/StudentReport';
import StudentInfo from './pages/Admin/Dashboard/reports/StudentInfo';
import ParentInfo from './pages/Admin/Dashboard/reports/ParentInfo';

import GenerateCertificate from './pages/Admin/Dashboard/certificates/GenerateCertificate';
import CertificateTemplates from './pages/Admin/Dashboard/certificates/CertificateTemplates';

import Notifications from './pages/Admin/Dashboard/Notifications';

// Teacher Imports
import TeacherLayout from './pages/Teacher/Layout/TeacherLayout';
import TeacherHome from './pages/Teacher/Dashboard/Home';
import TeacherStudentsAttendance from './pages/Teacher/Dashboard/attendance/StudentsAttendance';
import TeacherClassWiseReport from './pages/Teacher/Dashboard/attendance/ClassWiseReport';
import StudentsReportT from './pages/Teacher/Dashboard/attendance/StudentsReportT';
import TeacherHomework from './pages/Teacher/Dashboard/homework/Homework';
import MyTimetable from './pages/Teacher/Dashboard/timetable/MyTimetable';
import RateBehaviours from './pages/Teacher/Dashboard/behaviour-skills/RateBehaviours';
import RateSkills from './pages/Teacher/Dashboard/behaviour-skills/RateSkills';
import TeacherMessaging from './pages/Teacher/Dashboard/messaging/Messaging';
import TeacherLiveClass from './pages/Teacher/Dashboard/live-class/LiveClass';
import TeacherSubjectChapters from './pages/Teacher/Dashboard/question-paper/SubjectChapters';
import TeacherQuestionBank from './pages/Teacher/Dashboard/question-paper/QuestionBank';
import TeacherCreateQuestion from './pages/Teacher/Dashboard/question-paper/CreateQuestion';
import TeacherExamMarks from './pages/Teacher/Dashboard/exams/ExamMarks';
import TeacherResultCard from './pages/Teacher/Dashboard/exams/ResultCard';
import TeacherResultSheet from './pages/Teacher/Dashboard/exams/ResultSheet';
import BlankAwardList from './pages/Teacher/Dashboard/exams/BlankAwardList';
import ManageTestMarks from './pages/Teacher/Dashboard/class-tests/ManageTestMarks';
import TeacherTestResult from './pages/Teacher/Dashboard/class-tests/TestResult';
import StudentReportCard from './pages/Teacher/Dashboard/reports/StudentReportCard';
import StudentMonthlyReport from './pages/Teacher/Dashboard/reports/StudentMonthlyReport';
import TeacherAccountSettings from './pages/Teacher/Dashboard/settings/AccountSettings';
import TeacherNotifications from './pages/Teacher/Dashboard/Notifications';

// Student Imports
import StudentLayout from './pages/Student/Layout/StudentLayout';
import StudentDashboard from './pages/Student/Dashboard/Dashboard';
import StudentAdmissionLetter from './pages/Student/Dashboard/AdmissionLetter';
import FeeReceipt from './pages/Student/Dashboard/FeeReceipt';
import StudentTimetable from './pages/Student/Dashboard/Timetable';
import StudentReportCardPage from './pages/Student/Dashboard/ReportCard';
import TestResults from './pages/Student/Dashboard/TestResults';
import ExamResult from './pages/Student/Dashboard/ExamResult';
import Assignments from './pages/Student/Dashboard/Assignments';
import OnlineStore from './pages/Student/Dashboard/OnlineStore';
import StudentMessaging from './pages/Student/Dashboard/Messaging';
import StudentLiveClass from './pages/Student/Dashboard/LiveClass';
import StudentAccountSettings from './pages/Student/Dashboard/AccountSettings';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const userStr = localStorage.getItem('user');
  
  if (!userStr) {
    return <Navigate to="/login" />;
  }
  
  const user = JSON.parse(userStr);
  
  // If allowedRoles is specified, check if user's role is allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user's role
    if (user.role === 'teacher') {
      return <Navigate to="/teacher/dashboard" />;
    } else if (user.role === 'admin') {
      return <Navigate to="/dashboard" />;
    } else if (user.role === 'student') {
      return <Navigate to="/student/dashboard" />;
    } else if (user.role === 'parent') {
      return <Navigate to="/parent/dashboard" />;
    }
  }
  
  return children;
};

// Smart Redirect Component - Redirects to appropriate dashboard based on user role
const SmartRedirect = () => {
  const userStr = localStorage.getItem('user');
  
  if (!userStr) {
    return <Navigate to="/login" />;
  }
  
  const user = JSON.parse(userStr);
  
  if (user.role === 'teacher') {
    return <Navigate to="/teacher/dashboard" />;
  } else if (user.role === 'admin') {
    return <Navigate to="/dashboard" />;
  } else if (user.role === 'student') {
    return <Navigate to="/student/dashboard" />;
  } else if (user.role === 'parent') {
    return <Navigate to="/parent/dashboard" />;
  }
  
  return <Navigate to="/login" />;
};

function App() {
  return (
    <>
     <Toaster position="top-right" reverseOrder={false} />
     
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Admin Routes - Only accessible by admin role */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
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

          {/* Account Routes */}
          <Route path="account/add-income" element={<AddIncome/>} />
          <Route path="account/add-expense" element={<AddExpense/>} />
          <Route path="account/statement" element={<AccountStatement/>} />

          {/* Fees Routes */}
          <Route path="fees/generate-invoice" element={<GenerateFeesInvoice/>} />
          <Route path="fees/collect-fees" element={<CollectFees/>} />
          <Route path="fees/paid-slip" element={<FeesPaidSlip/>} />
          <Route path="fees/defaulters" element={<FeesDefaulters/>} />
          <Route path="fees/report" element={<FeesReport/>} />
          <Route path="fees/delete" element={<DeleteFees/>} />

          {/* Salary Routes */}
          <Route path="salary/pay" element={<PaySalary/>} />
          <Route path="salary/paid-slip" element={<SalaryPaidSlip/>} />
          <Route path="salary/sheet" element={<SalarySheet/>} />
          <Route path="salary/report" element={<SalaryReport/>} />

          {/* Attendance Routes */}
          <Route path="attendance/student" element={<StudentAttendance/>} />
          <Route path="attendance/employee" element={<EmployeesAttendance/>} />
          <Route path="attendance/class-report" element={<ClassWiseReport/>} />
          <Route path="attendance/students-report" element={<StudentsReport/>} />
          <Route path="attendance/employees-report" element={<EmployeeReport/>} />

          {/* Timetable Routes */}
          <Route path="timetable/weekdays" element={<WeekDays/>} />
          <Route path="timetable/periods" element={<TimePeriods/>} />
          <Route path="timetable/classrooms" element={<ClassRooms/>} />
          <Route path="timetable/create" element={<CreateTimetable/>} />
          <Route path="timetable/class" element={<GenerateClass/>} />
          <Route path="timetable/teacher" element={<GenerateTeacher/>} />

          {/* Homework Routes */}
          <Route path="homework" element={<HomeWork/>} />

          {/* Messaging Routes */}
          <Route path="messaging" element={<Message/>} />

          {/* SMS Routes */}
          <Route path="sms/gateway" element={<FreeSMS/>} />

          {/* Live Class Routes */}
          <Route path="live-class" element={<LiveClass/>} />

          {/* Question Paper Routes */}
          <Route path="question-paper/chapters" element={<SubjectChapters/>} />
          <Route path="question-paper/bank" element={<QuestionBank/>} />
          <Route path="question-paper/create" element={<CreateQuestion/>} />

          {/* Exam Routes */}
          <Route path="exams/create" element={<CreateExam/>} />
          <Route path="exams/marks" element={<ExamMarks/>} />
          <Route path="exams/result-card" element={<ResultCard/>} />

          {/* Class Tests Routes */}
          <Route path="class-tests/marks" element={<ManageTest/>} />
          <Route path="class-tests/result" element={<TestResult/>} />

          {/* Reports Routes */}
          <Route path="reports/student-card" element={<StudentCard/>} />
          <Route path="reports/student-info" element={<StudentInfo/>} />
          <Route path="reports/parent-info" element={<ParentInfo/>} />

          {/* Certificates Routes */}
          <Route path="certificates/generate" element={<GenerateCertificate/>} />
          <Route path="certificates/templates" element={<CertificateTemplates/>} />

          {/* Notifications Route */}
          <Route path="notifications" element={<Notifications/>} />
        </Route>

        {/* Teacher Routes - Only accessible by teacher role */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<TeacherHome />} />
          
          {/* Attendance Routes */}
          <Route path="attendance/students" element={<TeacherStudentsAttendance />} />
          <Route path="attendance/class-report" element={<TeacherClassWiseReport />} />
          <Route path="attendance/student-report" element={<StudentsReportT />} />
          
          {/* Homework Route */}
          <Route path="homework" element={<TeacherHomework />} />
          
          {/* Timetable Route */}
          <Route path="timetable" element={<MyTimetable />} />
          
          {/* Behaviour & Skills Routes */}
          <Route path="behaviour-skills/rate-behaviours" element={<RateBehaviours />} />
          <Route path="behaviour-skills/rate-skills" element={<RateSkills />} />
          
          {/* Messaging Route */}
          <Route path="messaging" element={<TeacherMessaging />} />
          
          {/* Live Class Route */}
          <Route path="live-class" element={<TeacherLiveClass />} />
          
          {/* Question Paper Routes */}
          <Route path="question-paper/chapters" element={<TeacherSubjectChapters />} />
          <Route path="question-paper/bank" element={<TeacherQuestionBank />} />
          <Route path="question-paper/create" element={<TeacherCreateQuestion />} />
          
          {/* Exams Routes */}
          <Route path="exams/marks" element={<TeacherExamMarks />} />
          <Route path="exams/result-card" element={<TeacherResultCard />} />
          <Route path="exams/result-sheet" element={<TeacherResultSheet />} />
          <Route path="exams/award-list" element={<BlankAwardList />} />
          
          {/* Class Tests Routes */}
          <Route path="class-tests/marks" element={<ManageTestMarks />} />
          <Route path="class-tests/result" element={<TeacherTestResult />} />
          
          {/* Reports Routes */}
          <Route path="reports/student-card" element={<StudentReportCard />} />
          <Route path="reports/monthly-report" element={<StudentMonthlyReport />} />
          
          {/* Account Settings Route */}
          <Route path="settings/account" element={<TeacherAccountSettings />} />
          
          {/* Notifications Route */}
          <Route path="notifications" element={<TeacherNotifications />} />
        </Route>

        {/* Student Routes - Only accessible by student role */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="admission-letter" element={<StudentAdmissionLetter />} />
          <Route path="fee-receipt" element={<FeeReceipt />} />
          <Route path="timetable" element={<StudentTimetable />} />
          <Route path="report-card" element={<StudentReportCardPage />} />
          <Route path="test-results" element={<TestResults />} />
          <Route path="exam-result" element={<ExamResult />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="store" element={<OnlineStore />} />
          <Route path="messaging" element={<StudentMessaging />} />
          <Route path="live-class" element={<StudentLiveClass />} />
          <Route path="settings" element={<StudentAccountSettings />} />
        </Route>
        
        {/* Default Route - Smart redirect based on user role */}
        <Route path="/" element={<SmartRedirect />} />
        <Route path="*" element={<SmartRedirect />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
