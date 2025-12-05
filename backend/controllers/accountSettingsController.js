import Admin from '../models/Admin.js';
import InstituteProfile from '../models/InstituteProfile.js';
import Billing from '../models/Billing.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Get complete account settings (combines Admin + Institute Profile + Billing)
 * @route GET /api/account-settings
 */
export const getAccountSettings = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    console.log(`📥 GET /api/account-settings for user: ${userId}`);
    
    // Fetch admin data
    const admin = await Admin.findById(userId).select('-password');
    if (!admin) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found'
      });
    }

    // Fetch institute profile for this admin
    const instituteProfile = await InstituteProfile.getProfile(userId);
    
    // Fetch billing info
    const billing = await Billing.getOrCreate(userId);
    
    console.log('✅ Account settings retrieved');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Account settings retrieved successfully',
      data: {
        user: {
          _id: admin._id,
          fullName: admin.fullName,
          email: admin.email,
          createdAt: admin.createdAt,
          updatedAt: admin.updatedAt
        },
        institute: instituteProfile,
        billing: billing
      }
    });
  } catch (error) {
    console.error('❌ Get account settings error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch account settings'
    });
  }
};

/**
 * Update account settings
 * @route PUT /api/account-settings
 */
export const updateAccountSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`📥 PUT /api/account-settings for user: ${userId}`);
    
    const {
      fullName,
      email,
      currentPassword,
      newPassword,
      currency
    } = req.body;

    // Find admin
    const admin = await Admin.findById(userId);
    if (!admin) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update basic info
    if (fullName?.trim()) {
      admin.fullName = fullName.trim();
    }

    if (email?.trim() && email !== admin.email) {
      // Check if email already exists
      const emailExists = await Admin.findOne({ email: email.toLowerCase().trim(), _id: { $ne: userId } });
      if (emailExists) {
        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: 'Email already in use'
        });
      }
      admin.email = email.toLowerCase().trim();
    }

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Current password is required to set new password'
        });
      }

      // Verify current password
      const isMatch = await admin.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Validate new password
      if (newPassword.length < 6) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'New password must be at least 6 characters long'
        });
      }

      // Set plain password - model's pre-save hook will hash it
      admin.password = newPassword;
    }

    await admin.save();

    // Update currency in billing if provided
    if (currency) {
      await Billing.findOneAndUpdate(
        { userId },
        { currency },
        { upsert: true, new: true }
      );
    }

    // Fetch updated data
    const updatedAdmin = await Admin.findById(userId).select('-password');
    const instituteProfile = await InstituteProfile.getProfile(userId);
    const billing = await Billing.getOrCreate(userId);

    console.log('✅ Account settings updated');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Account settings updated successfully',
      data: {
        user: updatedAdmin,
        institute: instituteProfile,
        billing: billing
      }
    });
  } catch (error) {
    console.error('❌ Update account settings error:', error);
    
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
      message: error.message || 'Failed to update account settings'
    });
  }
};

/**
 * Delete account
 * @route DELETE /api/account-settings
 */
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;
    
    console.log(`📥 DELETE /api/account-settings for user: ${userId}`);

    if (!password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Password is required to delete account'
      });
    }

    // Find admin
    const admin = await Admin.findById(userId);
    if (!admin) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Incorrect password'
      });
    }

    // Delete related data
    await Billing.deleteOne({ userId });
    // Note: Keep institute profile as it might be shared

    // Delete admin account
    await Admin.findByIdAndDelete(userId);

    console.log('✅ Account deleted successfully');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete account error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete account'
    });
  }
};

/**
 * Change password
 * @route PUT /api/account-settings/change-password
 */
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    console.log(`📥 PUT /api/account-settings/change-password for user: ${userId}`);

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'All password fields are required'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'New passwords do not match'
      });
    }

    if (newPassword.length < 6) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Find admin
    const admin = await Admin.findById(userId);
    if (!admin) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Set plain password - model's pre-save hook will hash it
    admin.password = newPassword;
    await admin.save();

    console.log('✅ Password changed successfully');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('❌ Change password error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to change password'
    });
  }
};