import mongoose from 'mongoose';

const generatedCertificateSchema = new mongoose.Schema({
  // Certificate Details
  certificateNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  title: {
    type: String,
    required: [true, 'Certificate title is required'],
    trim: true
  },
  
  // Template Reference
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CertificateTemplate',
    required: [true, 'Template ID is required']
  },
  
  // Recipient Information
  recipientType: {
    type: String,
    required: [true, 'Recipient type is required'],
    enum: ['Student', 'Staff', 'Employee']
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Recipient ID is required']
  },
  recipientName: {
    type: String,
    required: [true, 'Recipient name is required']
  },
  
  // Content Data
  content: {
    type: Map,
    of: String,
    default: {}
  },
  customText: {
    type: String,
    default: ''
  },
  
  // Dates
  issueDate: {
    type: Date,
    required: [true, 'Issue date is required'],
    default: Date.now
  },
  validUntil: {
    type: Date
  },
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'issued', 'revoked', 'expired'],
    default: 'issued'
  },
  isPrinted: {
    type: Boolean,
    default: false
  },
  isDownloaded: {
    type: Boolean,
    default: false
  },
  
  // Files
  pdfUrl: {
    type: String
  },
  pdfPublicId: {
    type: String
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  issuedBy: {
    type: String,
    default: 'Principal'
  },
  
  // Access Tracking
  accessLog: [{
    accessedAt: {
      type: Date,
      default: Date.now
    },
    accessedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    action: {
      type: String,
      enum: ['viewed', 'printed', 'downloaded', 'revoked']
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals for recipient population
generatedCertificateSchema.virtual('recipient', {
  ref: function() {
    return this.recipientType;
  },
  localField: 'recipientId',
  foreignField: '_id',
  justOne: true
});

generatedCertificateSchema.virtual('template', {
  ref: 'CertificateTemplate',
  localField: 'templateId',
  foreignField: '_id',
  justOne: true
});

// Indexes
generatedCertificateSchema.index({ certificateNumber: 1 }, { unique: true, sparse: true });
generatedCertificateSchema.index({ recipientType: 1, recipientId: 1 });
generatedCertificateSchema.index({ createdBy: 1, status: 1 });
generatedCertificateSchema.index({ issueDate: -1 });
generatedCertificateSchema.index({ status: 1 });

// Pre-save middleware to generate certificate number
generatedCertificateSchema.pre('save', async function(next) {
  if (!this.certificateNumber) {
    const year = new Date().getFullYear();
    const prefix = this.recipientType === 'Student' ? 'STU' : 'EMP';
    const count = await this.constructor.countDocuments({
      issueDate: {
        $gte: new Date(`${year}-01-01`),
        $lt: new Date(`${year + 1}-01-01`)
      }
    });
    
    this.certificateNumber = `${prefix}${year}${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Static method to get certificate statistics
generatedCertificateSchema.statics.getStats = async function(adminId) {
  const stats = await this.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(adminId) } },
    {
      $group: {
        _id: null,
        totalCertificates: { $sum: 1 },
        issuedCertificates: { 
          $sum: { $cond: [{ $eq: ['$status', 'issued'] }, 1, 0] }
        },
        printedCertificates: {
          $sum: { $cond: [{ $eq: ['$isPrinted', true] }, 1, 0] }
        },
        downloadedCertificates: {
          $sum: { $cond: [{ $eq: ['$isDownloaded', true] }, 1, 0] }
        },
        byRecipientType: {
          $push: {
            type: '$recipientType',
            count: 1
          }
        }
      }
    },
    {
      $project: {
        totalCertificates: 1,
        issuedCertificates: 1,
        printedCertificates: 1,
        downloadedCertificates: 1,
        recipientTypeStats: {
          $reduce: {
            input: '$byRecipientType',
            initialValue: [],
            in: {
              $concatArrays: [
                '$$value',
                [{
                  $cond: [
                    { $in: ['$$this.type', '$$value.type'] },
                    {},
                    {
                      type: '$$this.type',
                      count: {
                        $size: {
                          $filter: {
                            input: '$byRecipientType',
                            as: 'item',
                            cond: { $eq: ['$$item.type', '$$this.type'] }
                          }
                        }
                      }
                    }
                  ]
                }]
              ]
            }
          }
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalCertificates: 0,
    issuedCertificates: 0,
    printedCertificates: 0,
    downloadedCertificates: 0,
    recipientTypeStats: []
  };
};

export default mongoose.model('GeneratedCertificate', generatedCertificateSchema);