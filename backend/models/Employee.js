import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const employeeSchema = new mongoose.Schema({
  // Basic Information (Required)
  employeeName: {
    type: String,
    required: [true, 'Employee name is required'],
    trim: true
  },
  picture: {
    url: String,
    publicId: String
  },
  mobileNo: {
    type: String,
    required: [true, 'Mobile number is required']
  },
  dateOfJoining: {
    type: Date,
    required: [true, 'Date of joining is required']
  },
  employeeRole: {
    type: String,
    required: [true, 'Employee role is required']
  },
  monthlySalary: {
    type: Number,
    required: [true, 'Monthly salary is required'],
    min: 0
  },

  // Other Information (Optional)
  fatherHusbandName: String,
  nationalId: String,
  education: String,
  gender: String,
  religion: String,
  bloodGroup: String,
  experience: String,
  emailAddress: {
    type: String,
    required: [true, 'Email address is required'],
    trim: true,
    unique: false
  },
  dateOfBirth: Date,
  homeAddress: String,

  // System Fields
  employeeId: {
    type: String,
    unique: false
  },
  username: {
    type: String,
    unique: false,
    sparse: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false
  },
  originalPassword: {
    type: String,
    select: false
  },
  department: String,
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },

  // Ownership (Admin who created the employee)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }

}, {
  timestamps: true
});

// Add indexes for better query performance
employeeSchema.index({ emailAddress: 1 });
employeeSchema.index({ employeeId: 1 });
employeeSchema.index({ status: 1 });
employeeSchema.index({ employeeRole: 1 });
employeeSchema.index({ createdBy: 1 });
employeeSchema.index({ emailAddress: 1, createdBy: 1 }, { unique: true });
employeeSchema.index({ employeeId: 1, createdBy: 1 }, { unique: true });
employeeSchema.index({ username: 1, createdBy: 1 }, { unique: true, sparse: true });

// Generate employee ID and username before saving
employeeSchema.pre('save', async function(next) {
  try {
    // Generate employee ID if not present
    if (!this.employeeId) {
      const year = new Date().getFullYear();
      const random = Math.floor(1000 + Math.random() * 9000);
      this.employeeId = `EMP${year}${random}`;
    }

    // Generate username if not present
    if (!this.username && this.employeeName) {
      const nameParts = this.employeeName.toLowerCase().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1].charAt(0) : '';
      this.username = `${firstName}${lastName}${this.employeeId}`.toLowerCase().replace(/\s+/g, '');
    }

    // Auto-generate department based on role
    if (!this.department && this.employeeRole) {
      const roleToDept = {
        'Teacher': 'Academics',
        'Principal': 'Administration',
        'Vice Principal': 'Administration',
        'Librarian': 'Library',
        'Lab Assistant': 'Laboratory',
        'Sports Coach': 'Physical Education',
        'Administrative Staff': 'Administration',
        'Accountant': 'Finance',
        'Receptionist': 'Administration',
        'Security Guard': 'Security',
        'Maintenance Staff': 'Maintenance',
        'IT Support': 'IT'
      };
      this.department = roleToDept[this.employeeRole] || 'General';
    }

    // Hash password if it's modified or new
    if (this.isModified('password') && this.password) {
      // Store original password before hashing
      this.originalPassword = this.password;
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
employeeSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Add this to your existing Employee model
employeeSchema.methods.getMonthlySalary = function() {
  return this.monthlySalary || 0;
};

export default mongoose.model('Employee', employeeSchema);