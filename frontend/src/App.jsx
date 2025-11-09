import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './components/Layout/DashboardLayout';
import Home from './pages/Dashboard/Home';

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

import AddIncome from './pages/Dashboard/account/AddIncome';
import AddExpense from './pages/Dashboard/account/AddExpense';
import AccountStatement from './pages/Dashboard/account/AccountStatement';

import GenerateFeesInvoice from './pages/Dashboard/fees/GenerateFeesInvoice';
import CollectFees from './pages/Dashboard/fees/CollectFees';
import FeesPaidSlip from './pages/Dashboard/fees/FeesPaidSlip';
import FeesDefaulters from './pages/Dashboard/fees/FeesDefaulters';
import FeesReport from './pages/Dashboard/fees/FeesReport';
import DeleteFees from './pages/Dashboard/fees/DeleteFees';

import PaySalary from './pages/Dashboard/salary/PaySalary';
import SalaryPaidSlip from './pages/Dashboard/salary/SalaryPaidSlip';
import SalarySheet from './pages/Dashboard/salary/SalarySheet';
import SalaryReport from './pages/Dashboard/salary/SalaryReport';

import StudentAttendance from './pages/Dashboard/attendance/StudentAttendance';
import EmployeesAttendance from './pages/Dashboard/attendance/EmployeesAttendance';
import ClassWiseReport from './pages/Dashboard/attendance/ClassWiseReport';
import StudentsReport from './pages/Dashboard/attendance/StudentsReport';
import EmployeeReport from './pages/Dashboard/attendance/EmployeeReport';

import WeekDays from './pages/Dashboard/timetable/WeekDays';
import TimePeriods from './pages/Dashboard/timetable/TimePeriods';
import ClassRooms from './pages/Dashboard/timetable/ClassRooms';
import CreateTimetable from './pages/Dashboard/timetable/CreateTimetable';
import GenerateClass from './pages/Dashboard/timetable/GenerateClass';
import GenerateTeacher from './pages/Dashboard/timetable/GenerateTeacher';

import HomeWork from './pages/Dashboard/homework/HomeWork';

import Message from './pages/Dashboard/messaging/Message';

import FreeSMS from './pages/Dashboard/sms/FreeSMS';

import LiveClass from './pages/Dashboard/live-class/LiveClass';

import SubjectChapters from './pages/Dashboard/question-paper/SubjectChapters';
import QuestionBank from './pages/Dashboard/question-paper/QuestionBank';
import CreateQuestion from './pages/Dashboard/question-paper/CreateQuestion';

import CreateExam from './pages/Dashboard/exams/CreateExam';
import ExamMarks from './pages/Dashboard/exams/ExamMarks';
import ResultCard from './pages/Dashboard/exams/ResultCard';


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

          
        </Route>
        
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
