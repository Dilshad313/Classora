// controllers/uploadController.js

import mongoose from 'mongoose'; // ADD THIS IMPORT
import Upload from '../models/Upload.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Get all uploads for current user
 * @route GET /api/uploads
 */
export const getAllUploads = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, fileType, status } = req.query;
    
    console.log(`📥 GET /api/uploads for user: ${userId}`);
    
    // Build query
    const query = { userId, status: status || 'active' };
    if (category) query.category = category;
    if (fileType) query.fileType = fileType;
    
    const uploads = await Upload.find(query)
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${uploads.length} uploads`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Uploads retrieved successfully',
      count: uploads.length,
      data: uploads
    });
  } catch (error) {
    console.error('❌ Get uploads error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch uploads'
    });
  }
};

/**
 * Upload file
 * @route POST /api/uploads
 */
export const uploadFile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, description } = req.body;
    
    console.log('📥 POST /api/uploads');
    console.log('File uploaded:', req.file ? 'Yes' : 'No');
    
    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Determine file type
    let fileType = 'other';
    if (req.file.mimetype.startsWith('image/')) fileType = 'image';
    else if (req.file.mimetype.startsWith('video/')) fileType = 'video';
    else if (req.file.mimetype.startsWith('audio/')) fileType = 'audio';
    else if (req.file.mimetype.includes('pdf') || req.file.mimetype.includes('document')) fileType = 'document';

    // Upload to Cloudinary
    const folder = category || 'uploads';
    const uploadResult = await uploadToCloudinary(req.file.buffer, folder);

    // Create upload record
    const upload = await Upload.create({
      userId,
      fileName: req.file.originalname,
      originalName: req.file.originalname,
      fileType,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      fileUrl: uploadResult.url,
      publicId: uploadResult.publicId,
      category: category || 'other',
      description: description || null
    });

    console.log('✅ File uploaded:', upload._id);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'File uploaded successfully',
      data: upload
    });
  } catch (error) {
    console.error('❌ Upload file error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to upload file'
    });
  }
};

/**
 * Delete upload
 * @route DELETE /api/uploads/:id
 */
export const deleteUpload = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    console.log(`📥 DELETE /api/uploads/${id}`);
    
    const upload = await Upload.findOne({ _id: id, userId });
    
    if (!upload) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Upload not found'
      });
    }

    // Delete from Cloudinary
    if (upload.publicId) {
      await deleteFromCloudinary(upload.publicId);
    }

    // Delete from database
    await Upload.findByIdAndDelete(id);

    console.log('✅ Upload deleted');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Upload deleted successfully',
      data: upload
    });
  } catch (error) {
    console.error('❌ Delete upload error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete upload'
    });
  }
};

/**
 * Get storage statistics
 * @route GET /api/uploads/stats/summary
 */
export const getStorageStats = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`📥 GET /api/uploads/stats/summary for user: ${userId}`);
    
    // Validate userId
    if (!userId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Convert string to ObjectId safely
    let userObjectId;
    try {
      userObjectId = new mongoose.Types.ObjectId(userId);
    } catch (err) {
      console.error('Invalid userId format:', userId);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    // Get total storage stats
    const stats = await Upload.aggregate([
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
    
    // Get count by type
    const byType = await Upload.aggregate([
      {
        $match: {
          userId: userObjectId,
          status: 'active'
        }
      },
      {
        $group: {
          _id: '$fileType',
          count: { $sum: 1 },
          size: { $sum: '$fileSize' }
        }
      }
    ]);

    const totalSize = stats.length > 0 ? stats[0].totalSize : 0;
    const fileCount = stats.length > 0 ? stats[0].fileCount : 0;

    console.log('✅ Storage stats retrieved');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Storage stats retrieved successfully',
      data: {
        totalSize: totalSize,
        totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
        fileCount: fileCount,
        byType: byType
      }
    });
  } catch (error) {
    console.error('❌ Get storage stats error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch storage stats',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};