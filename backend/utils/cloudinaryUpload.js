import cloudinary from '../config/cloudinary.js';

/**
 * Upload image to Cloudinary
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} folder - Cloudinary folder
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadToCloudinary = (fileBuffer, folder = 'institute-profiles') => {
  return new Promise((resolve, reject) => {
    // Check if Cloudinary is configured
    const config = cloudinary.config();
    
    if (!config.cloud_name || !config.api_key || !config.api_secret) {
      console.error('❌ Cloudinary is not configured properly');
      return reject(new Error('Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.'));
    }

    if (!fileBuffer || fileBuffer.length === 0) {
      return reject(new Error('File buffer is empty'));
    }

    console.log('☁️ Uploading to Cloudinary...', {
      folder,
      bufferSize: fileBuffer.length,
      cloudName: config.cloud_name
    });

    // Use upload_stream for better reliability with buffers
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'image',
        transformation: [
          { width: 500, height: 500, crop: 'limit', quality: 'auto' },
        ],
        format: 'jpg'
      },
      (error, result) => {
        if (error) {
          console.error('❌ Cloudinary upload error:', error);
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else {
          console.log('✅ Cloudinary upload successful:', {
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            size: result.bytes
          });
          resolve({
            url: result.secure_url,
            publicId: result.public_id
          });
        }
      }
    );

    // Write buffer to stream
    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise}
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      console.log('⚠️ No publicId provided for deletion');
      return;
    }
    
    console.log('🗑️ Deleting from Cloudinary:', publicId);
    
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      console.log('✅ Successfully deleted from Cloudinary:', publicId);
    } else if (result.result === 'not found') {
      console.log('⚠️ Image not found in Cloudinary:', publicId);
    } else {
      console.warn(`⚠️ Unexpected result from Cloudinary: ${publicId}`, result);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error deleting from Cloudinary:', error);
    // Don't throw error as this shouldn't prevent the main operation
  }
};