import cloudinary from '../config/cloudinary.js';

/**
 * Upload image to Cloudinary
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} folder - Cloudinary folder
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadToCloudinary = (fileBuffer, folder = 'institute-profiles') => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer || fileBuffer.length === 0) {
      return reject(new Error('File buffer is empty'));
    }

    console.log('Uploading to Cloudinary...', {
      folder,
      bufferSize: fileBuffer.length,
      hasCloudinaryConfig: !!cloudinary.config().cloud_name
    });

    // Convert buffer to base64 for more reliable upload
    const fileBase64 = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;

    cloudinary.uploader.upload(
      fileBase64,
      {
        folder: folder,
        resource_type: 'image',
        transformation: [
          { width: 300, height: 300, crop: 'limit', quality: 'auto' },
          { format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error details:', error);
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else {
          console.log('Cloudinary upload successful:', {
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
      console.log('No publicId provided for deletion');
      return;
    }
    
    console.log('Deleting from Cloudinary:', publicId);
    
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result !== 'ok') {
      console.warn(`Failed to delete image from Cloudinary: ${publicId}`, result);
    } else {
      console.log('Successfully deleted from Cloudinary:', publicId);
    }
    
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    // Don't throw error as this shouldn't prevent the main operation
  }
};