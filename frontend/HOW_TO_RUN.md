# 🚀 How to Run Classora

## Step-by-Step Instructions

### Step 1: Open Terminal
Navigate to the frontend directory:
```bash
cd c:\Users\Acer\Desktop\projects\Classora\frontend
```

### Step 2: Install Dependencies
Run the following command to install all required packages:
```bash
npm install
```

**What gets installed:**
- React 19.1.1
- React Router DOM 6.22.0
- Lucide React 0.344.0
- TailwindCSS 4.1.15
- Vite 7.1.7
- And other dependencies

**Installation time:** ~2-3 minutes (depending on internet speed)

### Step 3: Start Development Server
```bash
npm run dev
```

**Expected output:**
```
  VITE v7.1.7  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 4: Open in Browser
Click on the link or manually navigate to:
```
http://localhost:5173
```

---

## 🔐 Login to the System

### Option 1: Admin Login (Recommended for first-time)
1. You'll see the login page
2. Select **Admin** role
3. Enter credentials:
   - **Email:** admin@futureleaders.edu
   - **Password:** admin123
4. Click **Sign In**

### Option 2: Other Roles
- **Teacher:** teacher@futureleaders.edu / teacher123
- **Student:** student@futureleaders.edu / student123
- **Parent:** parent@futureleaders.edu / parent123

---

## 🎯 What to Explore

### After Login, Try These Features:

#### 1. Dashboard Home
- View statistics
- Check recent activities
- See upcoming events

#### 2. System Administration (Admin only)
- Go to **System Administration** → **General Settings**
- Update school information
- Upload school logo

#### 3. Academic Management
- Go to **Academic Management** → **Classes & Sections**
- Click **Add New Class**
- Create a new class with sections

#### 4. Student Management
- Go to **Student Management** → **All Students**
- Browse student list
- Use search and filters
- Try pagination

#### 5. Mark Attendance
- Go to **Attendance** → **Mark Attendance**
- Select date, class, and section
- Mark students present/absent
- See real-time statistics

#### 6. Exam Management
- Go to **Exam Management** → **All Exams**
- Click **Create New Exam**
- Fill in exam details

#### 7. Fee Management
- Go to **Fee Management** → **Fee Structure**
- View fee structures
- Click **Add Fee Structure**

#### 8. Communication
- Go to **Communication** → **Notice Board**
- Click **Create Notice**
- Publish a notice

---

## 🛠️ Troubleshooting

### Problem: npm install fails
**Solution:**
```bash
npm cache clean --force
npm install
```

### Problem: Port 5173 already in use
**Solution:**
```bash
# Use a different port
npm run dev -- --port 3000
```

### Problem: Blank page after login
**Solution:**
- Check browser console (F12)
- Clear browser cache
- Try different browser

### Problem: Styles not loading
**Solution:**
- Make sure TailwindCSS is installed
- Check if `tailwind.config.js` exists
- Restart dev server

### Problem: Routes not working
**Solution:**
- Verify react-router-dom is installed
- Check browser console for errors
- Clear localStorage: `localStorage.clear()`

---

## 📂 Project Structure Overview

```
frontend/
├── src/
│   ├── components/        # Reusable components
│   ├── pages/            # All page components
│   ├── App.jsx           # Main app with routes
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── package.json          # Dependencies
└── vite.config.js        # Vite configuration
```

---

## 🎨 Key Features to Test

### ✅ Fully Functional Pages:
1. **Login** - Try all 4 roles
2. **Register** - Create new account
3. **Dashboard** - View statistics
4. **Settings** - Update school info
5. **Classes** - Create/manage classes
6. **Students** - Browse student list
7. **Attendance** - Mark attendance
8. **Exams** - Create exams
9. **Fees** - Configure fee structure
10. **Notices** - Post notices

### 🔄 Placeholder Pages:
- 30+ other routes configured
- Display "Coming Soon" message
- Ready for implementation

---

## 💡 Tips for Best Experience

1. **Use Chrome or Firefox** for best compatibility
2. **Try different roles** to see different menus
3. **Explore the sidebar** - all modules are there
4. **Use search** in student list
5. **Try responsive design** - resize browser window
6. **Check mobile view** - use browser dev tools
7. **Test forms** - validation works on all forms
8. **Hover over elements** - see interactive effects

---

## 🔄 Making Changes

### To modify a page:
1. Find the page in `src/pages/`
2. Edit the JSX code
3. Save the file
4. Browser auto-refreshes (Hot Module Replacement)

### To add a new page:
1. Create new file in appropriate folder
2. Import in `App.jsx`
3. Add route in the Routes section

### To change colors:
1. Edit `tailwind.config.js`
2. Modify color palette
3. Restart dev server

---

## 📱 Testing Responsive Design

### Method 1: Browser Resize
- Simply resize your browser window
- Watch layout adapt

### Method 2: Dev Tools
1. Press F12
2. Click device toolbar icon
3. Select device (iPhone, iPad, etc.)
4. Test all pages

---

## 🎓 Learning Resources

### Understanding the Code:
- **React Docs:** https://react.dev
- **TailwindCSS:** https://tailwindcss.com
- **React Router:** https://reactrouter.com
- **Lucide Icons:** https://lucide.dev

### Project Files to Study:
1. `App.jsx` - Routing structure
2. `DashboardLayout.jsx` - Layout component
3. `Login.jsx` - Form handling
4. `AllStudents.jsx` - Data display
5. `MarkAttendance.jsx` - Interactive UI

---

## 🚀 Next Steps

### For Development:
1. Complete remaining pages
2. Add backend API integration
3. Implement real authentication
4. Add database connection
5. Deploy to production

### For Learning:
1. Study the code structure
2. Modify existing pages
3. Create new features
4. Experiment with styling
5. Add new components

---

## 📞 Need Help?

### Check These Files:
- `README.md` - Full documentation
- `QUICKSTART.md` - Quick start guide
- `FEATURES.md` - Complete feature list
- `IMPLEMENTATION_SUMMARY.md` - Technical details

### Common Commands:
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Check code quality
```

---

## ✨ Enjoy Exploring Classora!

**Remember:**
- All data is stored in browser localStorage
- No backend required for demo
- Safe to experiment - just refresh to reset
- Logout and login with different roles to see different views

---

**Happy Coding! 🎓**

**Future Leaders Academy | Academic Year 2024-2025**
