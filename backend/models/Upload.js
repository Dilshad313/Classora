// models/Upload.js

import mongoose from 'mongoose';

const uploadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: [true, 'User ID is required']
  },
  fileName: {
    type: String,
    required: [true, 'File name is required'],
    trim: true
  },
  originalName: {
    type: String,
    required: [true, 'Original file name is required']
  },
  fileType: {
    type: String,
    required: [true, 'File type is required'],
    enum: ['image', 'document', 'video', 'audio', 'other']
  },
  mimeType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required'],
    min: 0
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is required']
  },
  publicId: {
    type: String,
    default: null
  },
  category: {
    type: String,
    enum: ['profile', 'document', 'media', 'other'],
    default: 'other'
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for file size in MB
uploadSchema.virtual('fileSizeMB').get(function() {
  return (this.fileSize / (1024 * 1024)).toFixed(2);
});

// Index for better query performance
uploadSchema.index({ userId: 1, createdAt: -1 });
uploadSchema.index({ status: 1 });
uploadSchema.index({ fileType: 1 });
uploadSchema.index({ category: 1 });

// Static method to get user's total storage used
uploadSchema.statics.getUserStorageUsed = async function(userId) {
  try {
    // Convert string to ObjectId safely
    let userObjectId;
    if (typeof userId === 'string') {
      userObjectId = new mongoose.Types.ObjectId(userId);
    } else {
      userObjectId = userId;
    }

    const result = await this.aggregate([
      {
        $match: {
          userId: userObjectId,
          status: { $ne: 'deleted' }
        }
      },
      {
        $group: {
          _id: null,
          totalSize: { $sum: '$fileSize' },
          fileCount: { $sum: 1 }
        }
      }
    ]);
    
    return result.length > 0 ? result[0] : { totalSize: 0, fileCount: 0 };
  } catch (error) {
    console.error('Error in getUserStorageUsed:', error);
    return { totalSize: 0, fileCount: 0 };
  }
};

export default mongoose.model('Upload', uploadSchema);