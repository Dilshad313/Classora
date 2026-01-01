# Classora - AI Agents Guide

## Commands
- **Frontend dev**: `cd frontend && npm run dev` (Vite, port 5173)
- **Frontend build**: `cd frontend && npm run build`
- **Frontend lint**: `cd frontend && npm run lint`
- **Backend dev**: `cd backend && npm run dev` (Express, port 5000)
- **Backend test**: `cd backend && npm test` (not implemented)

## Architecture
**Full-stack educational management system:**
- **Frontend** (React 19, Vite, Tailwind CSS, Recharts)
- **Backend** (Express.js, MongoDB, JWT auth, Cloudinary)
- **Key modules**: Auth, Classes, Students, Employees, Fees, Attendance, Exams, Homework, Notifications, SMS, Reports, Certificates

## Database
MongoDB with Mongoose. Use models in `backend/models/`. Pagination via mongoose-paginate-v2.

## Code Style
- **Imports**: ES6 modules (`import`/`export`)
- **Frontend paths**: Use `@` alias for `src/` (e.g., `@/components/Button`)
- **Naming**: camelCase for variables/functions, PascalCase for components/classes
- **Error handling**: Global Express error handler catches ValidationError, CastError, duplicate keys (code 11000)
- **API responses**: Always include `success` and `message` fields
- **Security**: Helmet, CORS, rate limiting (100 req/15min), bcryptjs for passwords
