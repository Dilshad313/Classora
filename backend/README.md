# Classora Backend API

Complete backend API for the Classora school management system.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Institute Management**: Profile management with logo upload
- **Fee Management**: Fee structures and particulars
- **Bank Accounts**: Bank account management with logo support
- **Classes**: Class management with materials and schedules
- **Subjects**: Subject assignment to classes
- **Marks & Grading**: Customizable grading systems
- **Rules & Regulations**: Manage school rules with formatting options
- **File Uploads**: Cloudinary integration for file storage
- **Billing**: Subscription and invoice management

## Tech Stack

- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **Cloudinary** for file storage
- **Bcrypt** for password hashing
- **Multer** for file uploads
- **Helmet** for security
- **Morgan** for logging
- **CORS** enabled

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for file uploads)

## Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure environment variables:
Create a `.env` file in the backend directory with:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/classora
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES=7d
ADMIN_KEY=CLASSORA2025
CLIENT_ORIGIN=http://localhost:3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. Start MongoDB:
```bash
# If using local MongoDB
mongod
```

4. Start the server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/admin/register` - Register new admin
- `POST /api/admin/login` - Login admin
- `GET /api/admin/me` - Get current user (protected)

### Institute Profile
- `GET /api/institute/profile` - Get institute profile
- `PUT /api/institute/profile` - Update institute profile (with logo upload)
- `DELETE /api/institute/profile/logo` - Delete institute logo
- `GET /api/institute/fees-particulars` - Get fees particulars
- `PUT /api/institute/fees-particulars` - Update fees particulars

### Fee Structure
- `GET /api/fee-structure` - Get all fee structures
- `GET /api/fee-structure/:id` - Get fee structure by ID
- `POST /api/fee-structure` - Create fee structure
- `PUT /api/fee-structure/:id` - Update fee structure
- `DELETE /api/fee-structure/:id` - Delete fee structure
- `GET /api/fee-structure/stats/summary` - Get statistics

### Bank Accounts
- `GET /api/bank-accounts` - Get all bank accounts
- `GET /api/bank-accounts/:id` - Get bank account by ID
- `POST /api/bank-accounts` - Create bank account (with logo upload)
- `PUT /api/bank-accounts/:id` - Update bank account
- `DELETE /api/bank-accounts/:id` - Delete bank account
- `DELETE /api/bank-accounts/:id/logo` - Delete bank account logo
- `GET /api/bank-accounts/stats/summary` - Get statistics

### Classes
- `GET /api/classes` - Get all classes (with pagination & filters)
- `GET /api/classes/:id` - Get class by ID
- `POST /api/classes` - Create class
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class
- `PATCH /api/classes/:id/status` - Update class status
- `POST /api/classes/bulk-delete` - Bulk delete classes
- `POST /api/classes/:id/materials` - Upload class material
- `DELETE /api/classes/:id/materials/:materialId` - Delete class material
- `GET /api/classes/stats/summary` - Get statistics

### Subjects
- `GET /api/subjects/list-classes` - Get available classes
- `GET /api/subjects/classes` - Get classes with subjects
- `POST /api/subjects/assign` - Assign subjects to class
- `DELETE /api/subjects/:id` - Delete subject assignment
- `GET /api/subjects/stats` - Get statistics

### Marks & Grading
- `GET /api/marks-grading` - Get all grading systems
- `GET /api/marks-grading/:id` - Get grading system by ID
- `POST /api/marks-grading` - Create grading system
- `PUT /api/marks-grading/:id` - Update grading system
- `DELETE /api/marks-grading/:id` - Delete grading system
- `GET /api/marks-grading/active` - Get active grading system
- `PUT /api/marks-grading/:id/activate` - Set active grading system

### Rules & Regulations
- `GET /api/rules-regulations` - Get all rules
- `GET /api/rules-regulations/:id` - Get rule by ID
- `POST /api/rules-regulations` - Create rule
- `PUT /api/rules-regulations/:id` - Update rule
- `DELETE /api/rules-regulations/:id` - Delete rule
- `PUT /api/rules-regulations/reorder` - Reorder rules
- `POST /api/rules-regulations/bulk-delete` - Bulk delete rules
- `GET /api/rules-regulations/stats/summary` - Get statistics

### Account Settings
- `GET /api/account-settings` - Get account settings
- `PUT /api/account-settings` - Update account settings
- `PUT /api/account-settings/change-password` - Change password
- `DELETE /api/account-settings` - Delete account

### Billing
- `GET /api/billing` - Get billing information
- `PUT /api/billing` - Update billing information
- `PUT /api/billing/subscription` - Update subscription
- `POST /api/billing/subscription/cancel` - Cancel subscription
- `GET /api/billing/invoices` - Get invoices
- `POST /api/billing/invoices` - Add invoice

### Uploads
- `GET /api/uploads` - Get all uploads
- `POST /api/uploads` - Upload file
- `DELETE /api/uploads/:id` - Delete upload
- `GET /api/uploads/stats/summary` - Get storage statistics

### Health Check
- `GET /api/health` - Server health check

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error message here"
}
```

## Success Responses

Successful responses follow this format:

```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

## File Uploads

File uploads are handled via multipart/form-data. Supported file types:
- Images: JPEG, PNG, GIF, WebP (max 2MB for logos)
- Documents: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
- Archives: ZIP, RAR
- Max file size for materials: 10MB

## Database Models

### Admin
- fullName, email, password, role

### InstituteProfile
- instituteName, tagline, phone, address, country, website, logo

### FeeStructure
- className, academicYear, tuitionFee, admissionFee, examFee, labFee, libraryFee, sportsFee

### BankAccount
- bankName, emailManager, bankAddress, accountNumber, instructions, logo, loginRequired

### Class
- className, section, subject, teacher, room, schedule, maxStudents, fees, materials

### SubjectAssignment
- classId, subjects (array), totalExamMarks

### MarksGrading
- grade, minMarks, maxMarks, status, order

### RulesRegulations
- title, content, isRequired, priority, fontSize, textAlign, formatting

### Billing
- subscription, currency, paymentMethod, billingAddress, invoices

### Upload
- fileName, fileType, fileSize, fileUrl, category

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- Helmet security headers
- CORS configuration
- Input validation
- File type validation
- File size limits

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## Testing

Test the API using:
- Postman
- Thunder Client (VS Code extension)
- cURL
- Frontend application

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify network connectivity

### Cloudinary Upload Issues
- Verify Cloudinary credentials in .env
- Check file size limits
- Ensure proper file types

### Authentication Issues
- Check JWT_SECRET is set
- Verify token is included in headers
- Check token expiration

## License

MIT

## Support

For issues and questions, please contact the development team.
