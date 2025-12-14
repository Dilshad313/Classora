import mongoose from 'mongoose';

const certificateTemplateSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Template name is required'],
    trim: true,
    maxlength: [200, 'Template name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Student', 'Achievement', 'Event', 'Staff'],
    default: 'Student'
  },
  
  // Design Properties
  design: {
    borderStyle: {
      type: String,
      enum: ['solid', 'double'],
      default: 'double'
    },
    borderColor: {
      type: String,
      enum: ['blue', 'green', 'purple', 'indigo', 'orange', 'pink', 'red'],
      default: 'blue'
    },
    headerBg: {
      type: String,
      enum: ['gradient-blue', 'gradient-green', 'gradient-purple', 
             'gradient-indigo', 'gradient-orange', 'gradient-pink'],
      default: 'gradient-blue'
    },
    accentColor: {
      type: String,
      enum: ['blue', 'green', 'purple', 'indigo', 'orange', 'pink'],
      default: 'blue'
    }
  },
  
  // Content
  content: {
    previewText: {
      type: String,
      default: 'This certificate is awarded to [Student Name] for excellence...'
    },
    headerTitle: {
      type: String,
      default: 'Certificate of Achievement'
    },
    instituteName: {
      type: String,
      default: 'Classora Institute'
    },
    instituteTagline: {
      type: String,
      default: 'Excellence in Education'
    },
    footerText: {
      type: String,
      default: 'This is a computer-generated certificate and does not require a physical signature.'
    }
  },
  
  // Metadata
  isDefault: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  
  // Statistics
  usageCount: {
    type: Number,
    default: 0
  },
  lastUsed: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for template preview
certificateTemplateSchema.virtual('previewData').get(function() {
  return {
    id: this._id,
    name: this.name,
    category: this.category,
    design: this.design,
    previewText: this.content.previewText,
    isDefault: this.isDefault
  };
});

// Indexes for better query performance
certificateTemplateSchema.index({ createdBy: 1, category: 1 });
certificateTemplateSchema.index({ isDefault: 1 });
certificateTemplateSchema.index({ name: 'text', description: 'text' });
certificateTemplateSchema.index({ createdBy: 1, isActive: 1 });

// Pre-save middleware to ensure only one default template per category
certificateTemplateSchema.pre('save', async function(next) {
  if (this.isModified('isDefault') && this.isDefault === true) {
    try {
      // Find other templates in same category and unset their default status
      await this.constructor.updateMany(
        { 
          _id: { $ne: this._id },
          category: this.category,
          createdBy: this.createdBy,
          isDefault: true
        },
        { $set: { isDefault: false } }
      );
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Static method to get default templates
certificateTemplateSchema.statics.getDefaultTemplates = async function(adminId) {
  const templates = await this.find({ 
    createdBy: adminId,
    isActive: true 
  }).sort({ category: 1, name: 1 });
  
  // If no templates exist, create default ones
  if (templates.length === 0) {
    return await this.initializeDefaultTemplates(adminId);
  }
  
  return templates;
};

// Static method to initialize default templates
certificateTemplateSchema.statics.initializeDefaultTemplates = async function(adminId) {
  const defaultTemplates = [
    {
      name: 'Leave Certificate',
      description: 'Standard template for student leaving certificates',
      category: 'Student',
      isDefault: true,
      design: {
        borderStyle: 'double',
        borderColor: 'blue',
        headerBg: 'gradient-blue',
        accentColor: 'blue'
      },
      content: {
        previewText: 'This is to certify that [Student Name] was a bonafide student of this institute...',
        headerTitle: 'LEAVE CERTIFICATE',
        instituteName: 'Classora Institute',
        instituteTagline: 'Excellence in Education',
        footerText: 'This certificate is issued as per school records and bears full authenticity.'
      },
      createdBy: adminId
    },
    {
      name: 'Character Certificate',
      description: 'Certificate of good character and conduct',
      category: 'Student',
      design: {
        borderStyle: 'solid',
        borderColor: 'green',
        headerBg: 'gradient-green',
        accentColor: 'green'
      },
      content: {
        previewText: 'This is to certify that [Student Name] has been a student of good character...',
        headerTitle: 'CHARACTER CERTIFICATE',
        instituteName: 'Classora Institute',
        instituteTagline: 'Excellence in Education',
        footerText: 'This certificate validates the character and conduct of the student.'
      },
      createdBy: adminId
    },
    {
      name: 'Achievement Certificate',
      description: 'Recognition for outstanding performance',
      category: 'Achievement',
      design: {
        borderStyle: 'double',
        borderColor: 'purple',
        headerBg: 'gradient-purple',
        accentColor: 'purple'
      },
      content: {
        previewText: 'This certificate is awarded to [Student Name] for outstanding achievement...',
        headerTitle: 'CERTIFICATE OF ACHIEVEMENT',
        instituteName: 'Classora Institute',
        instituteTagline: 'Excellence in Education',
        footerText: 'Awarded in recognition of exceptional performance and dedication.'
      },
      createdBy: adminId
    },
    {
      name: 'Transfer Certificate',
      description: 'Official transfer certificate for students',
      category: 'Student',
      design: {
        borderStyle: 'solid',
        borderColor: 'indigo',
        headerBg: 'gradient-indigo',
        accentColor: 'indigo'
      },
      content: {
        previewText: 'This is to certify that [Student Name] has been granted transfer from this institution...',
        headerTitle: 'TRANSFER CERTIFICATE',
        instituteName: 'Classora Institute',
        instituteTagline: 'Excellence in Education',
        footerText: 'Issued for official transfer to another educational institution.'
      },
      createdBy: adminId
    },
    {
      name: 'Participation Certificate',
      description: 'Certificate for event or activity participation',
      category: 'Event',
      design: {
        borderStyle: 'double',
        borderColor: 'orange',
        headerBg: 'gradient-orange',
        accentColor: 'orange'
      },
      content: {
        previewText: 'This certificate is presented to [Student Name] for active participation...',
        headerTitle: 'CERTIFICATE OF PARTICIPATION',
        instituteName: 'Classora Institute',
        instituteTagline: 'Excellence in Education',
        footerText: 'Awarded for enthusiastic participation and contribution.'
      },
      createdBy: adminId
    },
    {
      name: 'Appreciation Certificate',
      description: 'Certificate of appreciation and recognition',
      category: 'Achievement',
      design: {
        borderStyle: 'solid',
        borderColor: 'pink',
        headerBg: 'gradient-pink',
        accentColor: 'pink'
      },
      content: {
        previewText: 'This certificate of appreciation is awarded to [Student Name] in recognition...',
        headerTitle: 'CERTIFICATE OF APPRECIATION',
        instituteName: 'Classora Institute',
        instituteTagline: 'Excellence in Education',
        footerText: 'Presented with heartfelt appreciation for valuable contribution.'
      },
      createdBy: adminId
    }
  ];

  await this.insertMany(defaultTemplates);
  return await this.find({ createdBy: adminId, isActive: true }).sort({ category: 1, name: 1 });
};

// Method to increment usage count
certificateTemplateSchema.methods.incrementUsage = async function() {
  this.usageCount += 1;
  this.lastUsed = new Date();
  await this.save();
};

export default mongoose.model('CertificateTemplate', certificateTemplateSchema);