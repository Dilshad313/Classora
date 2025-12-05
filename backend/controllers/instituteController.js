import InstituteProfile from '../models/InstituteProfile.js';
import FeesParticulars from '../models/FeesParticulars.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Get institute profile
 * @route GET /api/institute/profile
 */
export const getInstituteProfile = async (req, res) => {
  try {
    console.log('📥 GET /api/institute/profile');
    const userId = req.user.id;
    
    const profile = await InstituteProfile.getProfile(userId);
    
    console.log('✅ Institute profile retrieved');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Institute profile retrieved successfully',
      data: profile
    });
  } catch (error) {
    console.error('❌ Get institute profile error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch institute profile'
    });
  }
};

/**
 * Update institute profile
 * @route PUT /api/institute/profile
 */
export const updateInstituteProfile = async (req, res) => {
  try {
    console.log('📥 PUT /api/institute/profile');
    
    const userId = req.user.id;
    const {
      instituteName,
      tagline,
      phone,
      address,
      country,
      website
    } = req.body;

    // Validate required fields
    if (!instituteName?.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Institute name is required'
      });
    }

    // Get current profile to check for existing logo
    let profile = await InstituteProfile.getProfile(userId);
    let logoUrl = profile.logoUrl;
    let logoPublicId = profile.logoPublicId;

    // Handle logo upload if new logo provided
    if (req.file) {
      try {
        console.log('🖼️ Processing logo upload...');
        
        // Delete old logo from Cloudinary if exists
        if (logoPublicId) {
          await deleteFromCloudinary(logoPublicId);
        }

        // Upload new logo to Cloudinary
        const uploadResult = await uploadToCloudinary(req.file.buffer, 'institute-profiles');
        
        logoUrl = uploadResult.url;
        logoPublicId = uploadResult.publicId;
        
      } catch (uploadError) {
        console.error('❌ Logo upload error:', uploadError);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: `Failed to upload logo: ${uploadError.message}`
        });
      }
    }

    // Prepare update data
    const updateData = {
      instituteName: instituteName.trim(),
      tagline: tagline?.trim() || '',
      phone: phone?.trim() || '',
      address: address?.trim() || '',
      country: country?.trim() || '',
      website: website?.trim() || '',
      logoUrl,
      logoPublicId
    };

    // Update the profile using the static method that handles creation if needed
    profile = await InstituteProfile.updateProfileByAdmin(userId, updateData);

    console.log('✅ Institute profile updated');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Institute profile updated successfully',
      data: profile
    });
  } catch (error) {
    console.error('❌ Update institute profile error:', error);
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
    console.log('🗑️ DELETE /api/institute/profile/logo');
    const userId = req.user.id;
    
    const profile = await InstituteProfile.getProfile(userId);

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

    console.log('✅ Logo deleted successfully');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Logo deleted successfully',
      data: profile
    });
  } catch (error) {
    console.error('❌ Delete logo error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete logo'
    });
  }
};

/**
 * Get all institute profiles (admin only)
 * @route GET /api/institute/profiles
 */
export const getAllProfiles = async (req, res) => {
  try {
    console.log('📥 GET /api/institute/profiles');
    const userId = req.user.id;
    
    const profile = await InstituteProfile.findOne({ createdBy: userId });
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Institute profiles retrieved successfully',
      data: profile ? [profile] : []
    });
  } catch (error) {
    console.error('❌ Get all profiles error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch institute profiles'
    });
  }
};

/**
 * Get fees particulars
 * @route GET /api/institute/fees-particulars
 */
export const getFeesParticulars = async (req, res) => {
  try {
    const feesParticulars = await FeesParticulars.findOne(); 

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Fees particulars retrieved successfully',
      data: feesParticulars
    });
  } catch (error) {
    console.error('Get fees particulars error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch fees particulars'
    });
  }
};

/**
 * Update fees particulars
 * @route PUT /api/institute/fees-particulars
 */
export const updateFeesParticulars = async (req, res) => {
  try {
    console.log('📥 Received fees update request:', req.body);

    const {
      monthlyTutorFee,
      admissionFee,
      registrationFee,
      artMaterial,
      transport,
      books,
      uniform,
      free,
      others,
      previousBalance,
      becomingFee
    } = req.body;

    const feeFields = {
      monthlyTutorFee: parseFloat(monthlyTutorFee) || 0,
      admissionFee: parseFloat(admissionFee) || 0,
      registrationFee: parseFloat(registrationFee) || 0,
      artMaterial: parseFloat(artMaterial) || 0,
      transport: parseFloat(transport) || 0,
      books: parseFloat(books) || 0,
      uniform: parseFloat(uniform) || 0,
      free: parseFloat(free) || 0,
      others: parseFloat(others) || 0,
      previousBalance: parseFloat(previousBalance) || 0,
      becomingFee: parseFloat(becomingFee) || 0
    };

    // Check for negative values
    const negativeFields = Object.entries(feeFields).filter(([key, value]) => value < 0);
    if (negativeFields.length > 0) {
      const fieldNames = negativeFields.map(([key]) => key.replace(/([A-Z])/g, ' $1').trim());
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `Fee values cannot be negative: ${fieldNames.join(', ')}`
      });
    }

    let feesParticulars = await FeesParticulars.findOne();

    if (feesParticulars) {
      feesParticulars = await FeesParticulars.findByIdAndUpdate(
        feesParticulars._id,
        feeFields,
        { new: true, runValidators: true }
      );
    } else {
      feesParticulars = await FeesParticulars.create(feeFields);
    }

    console.log('✅ Fees particulars updated successfully');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Fees particulars updated successfully',
      data: feesParticulars
    });
  } catch (error) {
    console.error('❌ Update fees particulars error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to update fees particulars'
    });
  }
};