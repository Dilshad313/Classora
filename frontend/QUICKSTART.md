# 🚀 Classora Quick Start Guide

## Installation & Setup

### Step 1: Install Dependencies
Open your terminal in the project directory and run:
```bash
npm install
```

This will install:
- React 19.1.1
- React DOM 19.1.1
- React Router DOM 6.22.0
- Lucide React 0.344.0
- TailwindCSS 4.1.15
- Vite 7.1.7
- And other development dependencies

### Step 2: Start Development Server
```bash
npm run dev
```

The application will start at: **http://localhost:5173**

## 🔐 Login Credentials

### Admin Access (Full System Access)
- **Email:** admin@futureleaders.edu
- **Password:** admin123
- **Access:** All modules and features

### Teacher Access
- **Email:** teacher@futureleaders.edu
- **Password:** teacher123
- **Access:** Academic, Students, Attendance, Homework, Exams

### Student Access
- **Email:** student@futureleaders.edu
- **Password:** student123
- **Access:** View classes, homework, grades, attendance

### Parent Access
- **Email:** parent@futureleaders.edu
- **Password:** parent123
- **Access:** View child's progress, fees, communication

## 📱 Navigation Guide

### After Login:

1. **Dashboard** - Overview with statistics and recent activities
2. **System Administration** (Admin only)
   - General Settings
   - Roles & Permissions
   - Backup & Restore

3. **Academic Management**
   - Classes & Sections
   - Subjects
   - Class Routine
   - Syllabus

4. **Student Management**
   - All Students (View, Edit, Delete)
   - Add New Student
   - Student Promotion
   - ID Card Generator

5. **Attendance**
   - Mark Attendance (Interactive UI)
   - View Reports
   - Settings

6. **Exam Management**
   - All Exams
   - Exam Schedule
   - Mark Entry
   - Report Cards

7. **Fee Management**
   - Fee Structure
   - Collect Fees
   - Fee Reports
   - Invoices

8. **Communication**
   - Notice Board
   - Messages
   - Events

9. **Library, Transport, Online Classes** - Coming Soon

## 🎨 Features Showcase

### ✅ Fully Functional Pages:

1. **Login Page**
   - Role selection (Admin/Teacher/Student/Parent)
   - Form validation
   - Responsive design

2. **Register Page**
   - Multi-step form
   - School code verification
   - Terms acceptance

3. **Dashboard Home**
   - Real-time statistics
   - Recent activities
   - Upcoming events
   - Quick actions

4. **General Settings**
   - School information
   - System configuration
   - Logo upload
   - Academic session

5. **Classes Management**
   - Create classes with sections
   - Assign teachers
   - View statistics

6. **All Students**
   - Search and filter
   - Pagination
   - Quick actions (View/Edit/Delete)

7. **Mark Attendance**
   - Interactive attendance marking
   - Real-time statistics
   - Bulk actions

8. **All Exams**
   - Create exams
   - Schedule management
   - Status tracking

9. **Fee Structure**
   - Configure fees by class
   - Multiple fee types
   - Frequency settings

10. **Notice Board**
    - Create notices
    - Target specific audiences
    - Email/SMS notifications

## 🎯 Testing the Application

### Test Workflow:

1. **Login as Admin**
   - Navigate to http://localhost:5173
   - Use admin credentials
   - Explore all modules

2. **Create a Class**
   - Go to Academic Management → Classes
   - Click "Add New Class"
   - Fill in details

3. **Add Students**
   - Go to Student Management → All Students
   - Browse existing students
   - Use search and filters

4. **Mark Attendance**
   - Go to Attendance → Mark Attendance
   - Select class and date
   - Mark students present/absent

5. **Create Exam**
   - Go to Exam Management → All Exams
   - Click "Create New Exam"
   - Set dates and classes

6. **Configure Fees**
   - Go to Fee Management → Fee Structure
   - View existing structures
   - Add new fee structure

7. **Post Notice**
   - Go to Communication → Notice Board
   - Click "Create Notice"
   - Select target audience

## 🔧 Troubleshooting

### Issue: Dependencies not installing
**Solution:** 
```bash
npm cache clean --force
npm install
```

### Issue: Port 5173 already in use
**Solution:**
```bash
# Kill the process or use different port
npm run dev -- --port 3000
```

### Issue: TailwindCSS not working
**Solution:** Make sure postcss.config.js and tailwind.config.js exist

### Issue: Routes not working
**Solution:** Check that react-router-dom is installed

## 📂 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── Layout/
│   │       └── DashboardLayout.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard/Home.jsx
│   │   ├── Admin/GeneralSettings.jsx
│   │   ├── Academic/Classes.jsx
│   │   ├── Students/AllStudents.jsx
│   │   ├── Attendance/MarkAttendance.jsx
│   │   ├── Exams/AllExams.jsx
│   │   ├── Fees/FeeStructure.jsx
│   │   └── Communication/NoticeBoard.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 🌟 Next Steps

### To Extend the Application:

1. **Add Backend Integration**
   - Replace localStorage with API calls
   - Implement real authentication
   - Connect to database

2. **Add More Pages**
   - Complete remaining modules
   - Add detailed views
   - Implement CRUD operations

3. **Enhance UI/UX**
   - Add animations
   - Implement dark mode
   - Add more interactive elements

4. **Add Features**
   - Real-time notifications
   - File uploads
   - PDF generation
   - Email integration

## 📞 Support

For issues or questions:
- Check the main README.md
- Review the code comments
- Test with demo credentials

---

**Happy Coding! 🎓**

Built for Future Leaders Academy | Academic Year 2024-2025
