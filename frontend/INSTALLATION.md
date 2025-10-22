# 📦 Classora - Complete Installation Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A code editor (VS Code recommended)

---

## Installation Steps

### Step 1: Verify Node.js Installation

Open your terminal and check Node.js version:

```bash
node --version
# Should show v16.x.x or higher

npm --version
# Should show 8.x.x or higher
```

### Step 2: Navigate to Project Directory

```bash
cd c:\Users\Acer\Desktop\projects\Classora\frontend
```

### Step 3: Install Dependencies

Run the installation command:

```bash
npm install
```

**This will install:**

#### Production Dependencies
- `react@19.1.1` - UI framework
- `react-dom@19.1.1` - React DOM renderer
- `react-router-dom@6.22.0` - Routing library
- `lucide-react@0.344.0` - Icon library

#### Development Dependencies
- `vite@7.1.7` - Build tool and dev server
- `tailwindcss@4.1.15` - CSS framework
- `postcss@8.5.6` - CSS processor
- `autoprefixer@10.4.21` - CSS vendor prefixes
- `@vitejs/plugin-react@5.0.4` - React plugin for Vite
- `eslint@9.36.0` - Code linting
- And other development tools

**Installation time:** Approximately 2-3 minutes

### Step 4: Verify Installation

Check if `node_modules` folder was created:

```bash
dir node_modules
# or
ls node_modules
```

You should see all installed packages.

---

## Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

**Expected Output:**
```
  VITE v7.1.7  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

You should see the **Classora Login Page**.

---

## First-Time Setup

### 1. Login as Admin

Use these credentials:
- **Email:** admin@futureleaders.edu
- **Password:** admin123
- **Role:** Admin

### 2. Explore the Dashboard

After login, you'll see:
- Welcome message
- Statistics cards
- Recent activities
- Upcoming events

### 3. Configure School Settings

Navigate to: **System Administration** → **General Settings**

Update:
- School name
- Address
- Contact information
- Logo (optional)
- Academic year

### 4. Create Classes

Navigate to: **Academic Management** → **Classes & Sections**

Click **Add New Class** and create:
- Grade 6 with sections A, B
- Grade 7 with sections A, B
- Grade 8 with sections A, B

### 5. Explore Other Modules

Try these features:
- View all students
- Mark attendance
- Create exams
- Configure fees
- Post notices

---

## Building for Production

### Create Production Build

```bash
npm run build
```

This creates an optimized build in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

Access at: `http://localhost:4173`

---

## Troubleshooting

### Issue 1: npm install fails

**Error:** `npm ERR! code ENOENT`

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue 2: Port 5173 already in use

**Error:** `Port 5173 is in use`

**Solution:**
```bash
# Option 1: Use different port
npm run dev -- --port 3000

# Option 2: Kill the process using port 5173
# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:5173 | xargs kill -9
```

### Issue 3: TailwindCSS not working

**Error:** Styles not applying

**Solution:**
1. Verify `tailwind.config.js` exists
2. Verify `postcss.config.js` exists
3. Check `index.css` has Tailwind directives
4. Restart dev server

### Issue 4: Module not found errors

**Error:** `Cannot find module 'react-router-dom'`

**Solution:**
```bash
# Reinstall specific package
npm install react-router-dom

# Or reinstall all
npm install
```

### Issue 5: Blank page after build

**Error:** White screen in production

**Solution:**
1. Check browser console for errors
2. Verify all imports are correct
3. Check base URL in `vite.config.js`
4. Rebuild: `npm run build`

---

## Environment Setup

### Optional: Create .env file

Create `.env` in the frontend folder:

```env
# Application
VITE_APP_NAME=Classora
VITE_APP_VERSION=1.0.0

# School Information
VITE_SCHOOL_NAME=Future Leaders Academy
VITE_ACADEMIC_YEAR=2024-2025

# API Configuration (for future backend)
VITE_API_URL=http://localhost:3000/api
```

---

## IDE Setup (VS Code)

### Recommended Extensions

Install these VS Code extensions:

1. **ES7+ React/Redux/React-Native snippets**
2. **Tailwind CSS IntelliSense**
3. **ESLint**
4. **Prettier - Code formatter**
5. **Auto Rename Tag**
6. **Path Intellisense**

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    ["class:\\s*?[\"'`]([^\"'`]*).*?[\"'`]", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

---

## Git Setup (Optional)

### Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit - Classora School Management System"
```

### Create .gitignore

Already included in the project:

```
node_modules/
dist/
.env
.DS_Store
*.log
```

---

## Testing the Installation

### Checklist

- [ ] Node.js installed (v16+)
- [ ] npm install completed successfully
- [ ] Dev server starts without errors
- [ ] Login page loads at localhost:5173
- [ ] Can login with demo credentials
- [ ] Dashboard displays correctly
- [ ] Navigation works
- [ ] All 10 implemented pages load
- [ ] Responsive design works
- [ ] No console errors

### Test Each Module

1. **Authentication**
   - [ ] Login works
   - [ ] Register page loads
   - [ ] Logout works

2. **Dashboard**
   - [ ] Statistics display
   - [ ] Activities show
   - [ ] Events visible

3. **Settings**
   - [ ] Form loads
   - [ ] Can input data
   - [ ] Save button works

4. **Classes**
   - [ ] List displays
   - [ ] Modal opens
   - [ ] Can create class

5. **Students**
   - [ ] Table loads
   - [ ] Search works
   - [ ] Filter works
   - [ ] Pagination works

6. **Attendance**
   - [ ] Date picker works
   - [ ] Student list loads
   - [ ] Can mark present/absent
   - [ ] Statistics update

7. **Exams**
   - [ ] Exam list shows
   - [ ] Can create exam
   - [ ] Status displays

8. **Fees**
   - [ ] Fee structures show
   - [ ] Table displays correctly
   - [ ] Modal works

9. **Notices**
   - [ ] Notice list loads
   - [ ] Can create notice
   - [ ] Form validation works

10. **Navigation**
    - [ ] Sidebar works
    - [ ] Mobile menu works
    - [ ] User dropdown works
    - [ ] All routes accessible

---

## Performance Optimization

### Development

For faster development:

```bash
# Use --host to access from other devices
npm run dev -- --host

# Use --open to auto-open browser
npm run dev -- --open
```

### Production

For optimal production build:

```bash
# Build with source maps
npm run build -- --sourcemap

# Analyze bundle size
npm run build -- --mode production
```

---

## Updating Dependencies

### Check for Updates

```bash
npm outdated
```

### Update All Dependencies

```bash
npm update
```

### Update Specific Package

```bash
npm update react react-dom
```

---

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Deploy to GitHub Pages

```bash
# Install gh-pages
npm install -g gh-pages

# Build
npm run build

# Deploy
gh-pages -d dist
```

---

## Support

### Getting Help

1. Check documentation files:
   - README.md
   - QUICKSTART.md
   - FEATURES.md
   - HOW_TO_RUN.md

2. Review code comments

3. Check browser console for errors

4. Verify all dependencies installed

---

## Next Steps

After successful installation:

1. ✅ Explore all 10 implemented modules
2. ✅ Test with different user roles
3. ✅ Try responsive design on mobile
4. ✅ Customize school information
5. ✅ Review the code structure
6. ✅ Plan additional features
7. ✅ Consider backend integration

---

## Maintenance

### Regular Tasks

- Update dependencies monthly
- Clear browser cache if issues occur
- Backup your customizations
- Test after major updates

### Backup

Important files to backup:
- `src/` folder (all your code)
- `package.json` (dependencies)
- `.env` (if created)
- Any custom configurations

---

## Success!

If you've completed all steps and the application is running, congratulations! 🎉

You now have a fully functional school management system ready to use.

---

**Need Help?** Check the documentation files or review the code comments.

**Ready to Develop?** Start by exploring the existing pages and components.

**Want to Deploy?** Follow the deployment section above.

---

**Built for Future Leaders Academy | Academic Year 2024-2025**
