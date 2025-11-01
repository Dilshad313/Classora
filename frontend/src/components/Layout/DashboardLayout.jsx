import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { InstituteProfileModal } from '../modals/InstituteProfileModal';
import {
  GraduationCap, LayoutDashboard, Users, BookOpen, Calendar, DollarSign,
  MessageSquare, Settings, LogOut, Menu, X, Bell, Search, ChevronDown,
  User, Shield, Book, ClipboardList, FileText, BarChart3, Library,
  Bus, Video, Award, Home, UserCircle, Building2, CreditCard, Wallet,
  FileCheck, Scale, TrendingUp, Palette, UserCog, School, BookMarked,
  UserPlus, Briefcase, Receipt, Banknote, Clock, BookOpenCheck, Mail,
  Smartphone, MonitorPlay, HelpCircle, FileQuestion, GraduationCapIcon,
  ClipboardCheck, FileSpreadsheet, FileBadge, Plus, List, Users2, 
  UserCheck, IdCard, Printer, UserCog2, TrendingUpIcon, DollarSignIcon,
  PiggyBank, FileBarChart, Trash2, Coins, FileOutput, CalendarDays,
  DoorClosed, Table, Send, Wifi, MessageCircle, FileEdit, Maximize,
  Minimize, Sun, Moon
} from 'lucide-react';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showInstituteProfile, setShowInstituteProfile] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  console.log('Current user role:', user.role); // Debug line

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';
    setIsDarkMode(isDark);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, []);

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Handle dark mode toggle
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      console.log('✅ Dark mode enabled - HTML class:', document.documentElement.className);
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      console.log('✅ Light mode enabled - HTML class:', document.documentElement.className);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    setShowInstituteProfile(location.pathname === '/dashboard/settings/institute');
  }, [location.pathname]);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      roles: ['admin', 'teacher', 'student', 'parent']
    },
    {
      title: 'General Settings',
      icon: Settings,
      roles: ['admin'],
      submenu: [
        { title: 'Institute Profile', path: '/dashboard/settings/institute', icon: Building2 },
        { title: 'Fees Particulars', path: '/dashboard/settings/fees-particulars', icon: CreditCard },
        { title: 'Fees Structure', path: '/dashboard/settings/fees-structure', icon: Wallet },
        { title: 'Accounts For Fees Invoice', path: '/dashboard/settings/accounts', icon: FileCheck },
        { title: 'Rules & Regulations', path: '/dashboard/settings/rules', icon: Scale },
        { title: 'Marks Grading', path: '/dashboard/settings/grading', icon: TrendingUp },
        { title: 'Theme & Language', path: '/dashboard/settings/theme', icon: Palette },
        { title: 'Account Settings', path: '/dashboard/settings/account', icon: UserCog },
        { title: 'Log out', path: '/logout', icon: LogOut },
      ]
    },
    {
      title: 'Classes',
      icon: School,
      roles: ['admin'],
      submenu: [
        { title: 'All Classes', path: '/dashboard/classes/all', icon: List },
        { title: 'New Classes', path: '/dashboard/classes/new', icon: Plus },
      ]
    },
    {
      title: 'Subjects',
      icon: BookMarked,
      roles: ['admin'],
      submenu: [
        { title: 'Classes With Subjects', path: '/dashboard/subjects/classes', icon: BookOpen },
        { title: 'Assign Subjects', path: '/dashboard/subjects/assign', icon: FileCheck },
      ]
    },
    {
      title: 'Students',
      icon: Users,
      roles: ['admin'],
      submenu: [
        { title: 'All Students', path: '/dashboard/students/all', icon: Users2 },
        { title: 'Add New', path: '/dashboard/students/add-new', icon: UserPlus },
        { title: 'Manage Families', path: '/dashboard/students/families', icon: Home },
        { title: 'Active / Inactive', path: '/dashboard/students/status', icon: UserCheck },
        { title: 'Admission Letter', path: '/dashboard/students/admission-letter', icon: FileText },
        { title: 'Student ID Cards', path: '/dashboard/students/id-cards', icon: IdCard },
        { title: 'Print Basic List', path: '/dashboard/students/print-list', icon: Printer },
        { title: 'Manage Login', path: '/dashboard/students/login', icon: UserCog },
        { title: 'Promote Students', path: '/dashboard/students/promote', icon: TrendingUp },
      ]
    },
    {
      title: 'Employees',
      icon: Briefcase,
      roles: ['admin'],
      submenu: [
        { title: 'All Employees', path: '/dashboard/employees/all', icon: Users2 },
        { title: 'Add New', path: '/dashboard/employees/add-new', icon: UserPlus },
        { title: 'Staff ID Cards', path: '/dashboard/employees/id-cards', icon: IdCard },
        { title: 'Job Letter', path: '/dashboard/employees/job-letter', icon: FileText },
        { title: 'Manage Login', path: '/dashboard/employees/login', icon: UserCog },
      ]
    },
    {
      title: 'Account',
      icon: Wallet,
      roles: ['admin'],
      submenu: [
        { title: 'Add Income', path: '/dashboard/account/add-income', icon: Plus },
        { title: 'Add Expense', path: '/dashboard/account/add-expense', icon: Receipt },
        { title: 'Account Statement', path: '/dashboard/account/statement', icon: FileBarChart },
      ]
    },
    {
      title: 'Fees',
      icon: DollarSign,
      roles: ['admin'],
      submenu: [
        { title: 'Generate Fees Invoice', path: '/dashboard/fees/generate-invoice', icon: FileText },
        { title: 'Collect Fees', path: '/dashboard/fees/collect', icon: Banknote },
        { title: 'Fees Paid Slip', path: '/dashboard/fees/paid-slip', icon: Receipt },
        { title: 'Fees Defaulters', path: '/dashboard/fees/defaulters', icon: UserCheck },
        { title: 'Fees Report', path: '/dashboard/fees/report', icon: BarChart3 },
        { title: 'Delete Fees', path: '/dashboard/fees/delete', icon: Trash2 },
      ]
    },
    {
      title: 'Salary',
      icon: Coins,
      roles: ['admin'],
      submenu: [
        { title: 'Pay Salary', path: '/dashboard/salary/pay', icon: Banknote },
        { title: 'Salary Paid Slip', path: '/dashboard/salary/paid-slip', icon: Receipt },
        { title: 'Salary Sheet', path: '/dashboard/salary/sheet', icon: FileSpreadsheet },
        { title: 'Salary Report', path: '/dashboard/salary/report', icon: BarChart3 },
      ]
    },
    {
      title: 'Attendance',
      icon: ClipboardList,
      roles: ['admin'],
      submenu: [
        { title: 'Students Attendance', path: '/dashboard/attendance/students', icon: Users },
        { title: 'Employees Attendance', path: '/dashboard/attendance/employees', icon: Briefcase },
        { title: 'Class wise Report', path: '/dashboard/attendance/class-report', icon: School },
        { title: 'Students Attendance Report', path: '/dashboard/attendance/students-report', icon: FileBarChart },
        { title: 'Employees Attendance Report', path: '/dashboard/attendance/employees-report', icon: FileBarChart },
      ]
    },
    {
      title: 'Timetable',
      icon: Calendar,
      roles: ['admin'],
      submenu: [
        { title: 'Weekdays', path: '/dashboard/timetable/weekdays', icon: CalendarDays },
        { title: 'Time Periods', path: '/dashboard/timetable/periods', icon: Clock },
        { title: 'Class Rooms', path: '/dashboard/timetable/classrooms', icon: DoorClosed },
        { title: 'Create Timetable', path: '/dashboard/timetable/create', icon: Plus },
        { title: 'Generate For Class', path: '/dashboard/timetable/generate-class', icon: School },
        { title: 'Generate For Teacher', path: '/dashboard/timetable/generate-teacher', icon: User },
      ]
    },
    {
      title: 'Homework',
      icon: BookOpenCheck,
      path: '/dashboard/homework',
      roles: ['admin']
    },
    {
      title: 'Messaging',
      icon: MessageCircle,
      path: '/dashboard/messaging',
      roles: ['admin']
    },
    {
      title: 'SMS Services',
      icon: Smartphone,
      roles: ['admin'],
      submenu: [
        { title: 'Free SMS Gateway', path: '/dashboard/sms/gateway', icon: Wifi },
      ]
    },
    {
      title: 'Live Class',
      icon: MonitorPlay,
      path: '/dashboard/live-class',
      roles: ['admin']
    },
    {
      title: 'Question Paper',
      icon: FileQuestion,
      roles: ['admin'],
      submenu: [
        { title: 'Subject Chapters', path: '/dashboard/question-paper/chapters', icon: Book },
        { title: 'Question Bank', path: '/dashboard/question-paper/bank', icon: HelpCircle },
        { title: 'Create Question Paper', path: '/dashboard/question-paper/create', icon: FileEdit },
      ]
    },
    {
      title: 'Exams',
      icon: Award,
      roles: ['admin'],
      submenu: [
        { title: 'Create New Exam', path: '/dashboard/exams/create', icon: Plus },
        { title: 'Add / update Exam Marks', path: '/dashboard/exams/marks', icon: FileEdit },
        { title: 'Result Card', path: '/dashboard/exams/result-card', icon: IdCard },
        { title: 'Result Sheet', path: '/dashboard/exams/result-sheet', icon: FileSpreadsheet },
        { title: 'Exam Schedule', path: '/dashboard/exams/schedule', icon: Calendar },
        { title: 'Date Sheet', path: '/dashboard/exams/date-sheet', icon: CalendarDays },
        { title: 'Blank Award List', path: '/dashboard/exams/award-list', icon: Award },
      ]
    },
    {
      title: 'Class Tests',
      icon: ClipboardCheck,
      roles: ['admin'],
      submenu: [
        { title: 'Manage Test Marks', path: '/dashboard/class-tests/marks', icon: FileEdit },
        { title: 'Test Result', path: '/dashboard/class-tests/result', icon: BarChart3 },
      ]
    },
    {
      title: 'Reports',
      icon: BarChart3,
      roles: ['admin'],
      submenu: [
        { title: 'Students report Card', path: '/dashboard/reports/student-card', icon: IdCard },
        { title: 'Students info report', path: '/dashboard/reports/student-info', icon: Users },
        { title: 'Parents info report', path: '/dashboard/reports/parent-info', icon: Home },
        { title: 'Students Monthly Attendance Report', path: '/dashboard/reports/student-attendance', icon: Calendar },
        { title: 'Staff Monthly Attendance Report', path: '/dashboard/reports/staff-attendance', icon: Calendar },
        { title: 'Fee Collection Report', path: '/dashboard/reports/fee-collection', icon: DollarSign },
        { title: 'Student Progress Report', path: '/dashboard/reports/student-progress', icon: TrendingUp },
        { title: 'Accounts Report', path: '/dashboard/reports/accounts', icon: Wallet },
        { title: 'Customised Reports', path: '/dashboard/reports/customised', icon: FileBarChart },
      ]
    },
    {
      title: 'Certificates',
      icon: FileBadge,
      roles: ['admin'],
      submenu: [
        { title: 'Generate Certificate', path: '/dashboard/certificates/generate', icon: Plus },
        { title: 'Certificate Templates', path: '/dashboard/certificates/templates', icon: FileText },
      ]
    },
    {
      title: 'Academic Management',
      icon: BookOpen,
      roles: ['teacher'],
      submenu: [
        { title: 'Classes & Sections', path: '/dashboard/academic/classes', icon: Home },
        { title: 'Subjects', path: '/dashboard/academic/subjects', icon: Book },
        { title: 'Class Routine', path: '/dashboard/academic/routine', icon: Calendar },
        { title: 'Syllabus', path: '/dashboard/academic/syllabus', icon: FileText },
      ]
    },
    {
      title: 'Student Management',
      icon: Users,
      roles: ['teacher'],
      submenu: [
        { title: 'All Students', path: '/dashboard/students/all', icon: Users },
        { title: 'Add Student', path: '/dashboard/students/add', icon: UserCircle },
        { title: 'Student Promotion', path: '/dashboard/students/promotion', icon: Award },
        { title: 'ID Card Generator', path: '/dashboard/students/id-card', icon: FileText },
      ]
    },
    {
      title: 'Attendance',
      icon: ClipboardList,
      roles: ['teacher', 'student', 'parent'],
      submenu: [
        { title: 'Mark Attendance', path: '/dashboard/attendance/mark', icon: ClipboardList },
        { title: 'View Reports', path: '/dashboard/attendance/reports', icon: BarChart3 },
        { title: 'Attendance Settings', path: '/dashboard/attendance/settings', icon: Settings },
      ]
    },
    {
      title: 'Homework & Assignments',
      icon: FileText,
      roles: ['teacher', 'student'],
      submenu: [
        { title: 'All Assignments', path: '/dashboard/homework/all', icon: FileText },
        { title: 'Create Assignment', path: '/dashboard/homework/create', icon: FileText },
        { title: 'Submissions', path: '/dashboard/homework/submissions', icon: ClipboardList },
      ]
    },
    {
      title: 'Exam Management',
      icon: Award,
      roles: ['teacher', 'student', 'parent'],
      submenu: [
        { title: 'Exams', path: '/dashboard/exams/all', icon: Award },
        { title: 'Exam Schedule', path: '/dashboard/exams/schedule', icon: Calendar },
        { title: 'Mark Entry', path: '/dashboard/exams/marks', icon: FileText },
        { title: 'Report Cards', path: '/dashboard/exams/reports', icon: BarChart3 },
      ]
    },
    {
      title: 'Fee Management',
      icon: DollarSign,
      roles: ['parent'],
      submenu: [
        { title: 'Fee Structure', path: '/dashboard/fees/structure', icon: FileText },
        { title: 'Collect Fees', path: '/dashboard/fees/collect', icon: DollarSign },
        { title: 'Fee Reports', path: '/dashboard/fees/reports', icon: BarChart3 },
        { title: 'Invoices', path: '/dashboard/fees/invoices', icon: FileText },
      ]
    },
    {
      title: 'Communication',
      icon: MessageSquare,
      roles: ['teacher', 'student', 'parent'],
      submenu: [
        { title: 'Notice Board', path: '/dashboard/communication/notices', icon: MessageSquare },
        { title: 'Messages', path: '/dashboard/communication/messages', icon: MessageSquare },
        { title: 'Events', path: '/dashboard/communication/events', icon: Calendar },
      ]
    },
    {
      title: 'Library',
      icon: Library,
      roles: ['teacher', 'student'],
      submenu: [
        { title: 'Books', path: '/dashboard/library/books', icon: Book },
        { title: 'Issue/Return', path: '/dashboard/library/issue', icon: ClipboardList },
        { title: 'Library Members', path: '/dashboard/library/members', icon: Users },
      ]
    },
    {
      title: 'Transport',
      icon: Bus,
      roles: ['student', 'parent'],
      submenu: [
        { title: 'Routes', path: '/dashboard/transport/routes', icon: Bus },
        { title: 'Vehicles', path: '/dashboard/transport/vehicles', icon: Bus },
        { title: 'Assign Students', path: '/dashboard/transport/assign', icon: Users },
      ]
    },
    {
      title: 'Online Classes',
      icon: Video,
      roles: ['teacher', 'student'],
      submenu: [
        { title: 'Schedule Class', path: '/dashboard/online/schedule', icon: Calendar },
        { title: 'Join Class', path: '/dashboard/online/join', icon: Video },
        { title: 'Recordings', path: '/dashboard/online/recordings', icon: Video },
      ]
    },
    {
      title: 'Reports & Analytics',
      icon: BarChart3,
      roles: ['teacher'],
      submenu: [
        { title: 'Student Reports', path: '/dashboard/reports/students', icon: Users },
        { title: 'Academic Reports', path: '/dashboard/reports/academic', icon: BookOpen },
        { title: 'Financial Reports', path: '/dashboard/reports/financial', icon: DollarSign },
        { title: 'Custom Reports', path: '/dashboard/reports/custom', icon: BarChart3 },
      ]
    },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user.role)
  );
  console.log('Filtered menu items:', filteredMenuItems); // Debug line

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isParentActive = (submenu) => {
    return submenu?.some(item => location.pathname === item.path);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Top Navigation Bar */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed w-full z-30 top-0 transition-colors duration-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-primary-600 to-secondary-600 p-2 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    Classora
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Future Leaders Academy</p>
                </div>
              </div>
            </div>

            {/* Center Section - Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search students, classes, staff..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Fullscreen Toggle */}
              <button 
                onClick={toggleFullscreen}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                      <User className="w-4 h-4" />
                      My Profile
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600 dark:text-red-400"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-20 overflow-y-auto ${
          sidebarOpen ? 'w-80' : 'lg:w-20'
        } ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}
      >
        <nav className="p-4 space-y-2">
          {filteredMenuItems.map((item, index) => (
            <div key={index}>
              {item.submenu ? (
                <details className="group" open={isParentActive(item.submenu)}>
                  <summary className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                    isParentActive(item.submenu)
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}>
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <>
                        <span className="flex-1 font-medium text-sm">{item.title}</span>
                        <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
                      </>
                    )}
                  </summary>
                  {sidebarOpen && (
                    <div className="ml-4 mt-2 space-y-1 border-l-2 border-gray-200 dark:border-gray-600 pl-4">
                      {item.submenu.map((subItem, subIndex) => (
                        <button
                          key={subIndex}
                          onClick={() => {
                            if (subItem.path === '/logout') {
                              handleLogout();
                            } else {
                              navigate(subItem.path);
                              setMobileMenuOpen(false);
                            }
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm ${
                            subItem.path === '/logout'
                              ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                              : isActive(subItem.path)
                              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <subItem.icon className="w-4 h-4" />
                          <span>{subItem.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </details>
              ) : (
                <button
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm">{item.title}</span>}
                </button>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-300 min-h-screen ${
          sidebarOpen ? 'lg:ml-80' : 'lg:ml-20'
        }`}
      >
        <div className="p-4 sm:p-6 lg:p-8 text-gray-900 dark:text-gray-100">
          <Outlet />
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default DashboardLayout;
