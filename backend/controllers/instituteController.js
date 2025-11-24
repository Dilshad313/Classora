import InstituteProfile from '../models/InstituteProfile.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Get institute profile - gets the first profile
 * @route GET /api/institute/profile
 */
export const getInstituteProfile = async (req, res) => {
  try {
    const profile = await InstituteProfile.getProfile();
    
    res.status(StatusCodes.OK).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch institute profile'
    });
  }
};

/**
 * Get all institute profiles (for debugging)
 * @route GET /api/institute/profiles
 */
export const getAllProfiles = async (req, res) => {
  try {
    const profiles = await InstituteProfile.find();
    
    res.status(StatusCodes.OK).json({
      success: true,
      count: profiles.length,
      data: profiles
    });
  } catch (error) {
    console.error('Get all profiles error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch profiles'
    });
  }
};

/**
 * Update institute profile - updates the first profile found
 * @route PUT /api/institute/profile
 */
export const updateInstituteProfile = async (req, res) => {
  try {
    console.log('Update request received');

    const {
      instituteName,
      tagline,
      phone,
      address,
      country,
      website
    } = req.body;

    // Validate required fields
    if (!instituteName || !tagline || !phone || !address || !country) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'All required fields must be filled'
      });
    }

    // Get current profile (first one)
    let profile = await InstituteProfile.getProfile();
    
    let logoUrl = profile.logoUrl;
    let logoPublicId = profile.logoPublicId;

    // Handle logo upload if new logo provided
    if (req.file) {
      try {
        console.log('Processing logo upload...');

        // Delete old logo from Cloudinary if exists
        if (logoPublicId) {
          await deleteFromCloudinary(logoPublicId);
        }

        // Upload new logo
        const uploadResult = await uploadToCloudinary(req.file.buffer);
        logoUrl = uploadResult.url;
        logoPublicId = uploadResult.publicId;
        console.log('Logo upload successful');
        
      } catch (uploadError) {
        console.error('Logo upload failed:', uploadError.message);
        
        // If Cloudinary is not configured, continue without logo
        if (uploadError.message.includes('Cloudinary is not configured')) {
          console.log('Continuing without logo upload due to Cloudinary configuration issues');
          // Keep existing logo or set to null
          logoUrl = profile.logoUrl;
          logoPublicId = profile.logoPublicId;
        } else {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: `Failed to upload logo image: ${uploadError.message}`
          });
        }
      }
    }

    // Update the specific profile by ID
    console.log('Updating profile with ID:', profile._id);
    profile = await InstituteProfile.findByIdAndUpdate(
      profile._id, // Use the specific ID
      {
        instituteName: instituteName.trim(),
        tagline: tagline.trim(),
        phone: phone.trim(),
        address: address.trim(),
        country: country.trim(),
        website: (website || '').trim(),
        logoUrl,
        logoPublicId
      },
      { 
        new: true, 
        runValidators: true
      }
    );

    console.log('Profile updated successfully:', profile._id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Institute profile updated successfully',
      data: profile
    });

  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: errors[0] || 'Validation failed',
        errors: errors
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to update institute profile'
    });
  }
};

/**
 * Delete institute logo
 * @route DELETE /api/institute/profile/logo
 */
export const deleteInstituteLogo = async (req, res) => {
  try {
    const profile = await InstituteProfile.getProfile();
    
    if (!profile.logoPublicId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'No logo exists to delete'
      });
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(profile.logoPublicId);

    // Update profile to remove logo
    profile.logoUrl = null;
    profile.logoPublicId = null;
    await profile.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Logo deleted successfully',
      data: profile
    });

  } catch (error) {
    console.error('Delete logo error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete logo'
    });
  }
};