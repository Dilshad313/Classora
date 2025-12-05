import BankAccount from '../models/BankAccount.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Get all bank accounts
 * @route GET /api/bank-accounts
 */
export const getAllBankAccounts = async (req, res) => {
  try {
    console.log('📥 GET /api/bank-accounts');
    
    const { status } = req.query;
    const userId = req.user.id;
    
    // Build query
    const query = { createdBy: userId };
    if (status) query.status = status;
    
    const bankAccounts = await BankAccount.find(query)
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${bankAccounts.length} bank accounts`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Bank accounts retrieved successfully',
      count: bankAccounts.length,
      data: bankAccounts
    });
  } catch (error) {
    console.error('❌ Get bank accounts error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch bank accounts'
    });
  }
};

/**
 * Get single bank account by ID
 * @route GET /api/bank-accounts/:id
 */
export const getBankAccountById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    console.log(`📥 GET /api/bank-accounts/${id}`);
    
    const bankAccount = await BankAccount.findOne({ _id: id, createdBy: userId });
    
    if (!bankAccount) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Bank account not found'
      });
    }
    
    console.log('✅ Bank account found');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Bank account retrieved successfully',
      data: bankAccount
    });
  } catch (error) {
    console.error('❌ Get bank account error:', error);
    
    if (error.name === 'CastError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid bank account ID'
      });
    }
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch bank account'
    });
  }
};

/**
 * Create new bank account
 * @route POST /api/bank-accounts
 */
export const createBankAccount = async (req, res) => {
  try {
    console.log('📥 POST /api/bank-accounts');
    console.log('Body fields:', Object.keys(req.body));
    console.log('File uploaded:', req.file ? 'Yes' : 'No');
    
    const userId = req.user.id;
    const {
      bankName,
      emailManager,
      bankAddress,
      accountNumber,
      instructions,
      loginRequired,
      status
    } = req.body;

    // Validate required fields
    if (!bankName?.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Bank name is required'
      });
    }

    if (!accountNumber?.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Account number is required'
      });
    }

    let logoUrl = null;
    let logoPublicId = null;

    // Handle logo upload if provided
    if (req.file) {
      try {
        console.log('🖼️ Processing logo upload...');
        
        const uploadResult = await uploadToCloudinary(req.file.buffer, 'bank-logos');
        
        logoUrl = uploadResult.url;
        logoPublicId = uploadResult.publicId;
        
        console.log('✅ Logo uploaded successfully:', logoUrl);
        
      } catch (uploadError) {
        console.error('❌ Logo upload error:', uploadError);
        
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: `Failed to upload logo: ${uploadError.message}`
        });
      }
    }

    // Create bank account data
    const bankAccountData = {
      bankName: bankName.trim(),
      emailManager: emailManager?.trim() || null,
      bankAddress: bankAddress?.trim() || null,
      accountNumber: accountNumber.trim(),
      instructions: instructions?.trim() || null,
      logoUrl,
      logoPublicId,
      loginRequired: loginRequired === 'true' || loginRequired === true,
      status: status || 'active',
      createdBy: userId
    };

    // Create new bank account
    const bankAccount = await BankAccount.create(bankAccountData);
    
    console.log('✅ Bank account created:', bankAccount._id);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Bank account created successfully',
      data: bankAccount
    });
  } catch (error) {
    console.error('❌ Create bank account error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: errors[0] || 'Validation failed',
        errors: errors
      });
    }

    if (error.code === 11000) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: 'Bank account with this account number already exists'
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to create bank account'
    });
  }
};

/**
 * Update bank account
 * @route PUT /api/bank-accounts/:id
 */
export const updateBankAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    console.log(`📥 PUT /api/bank-accounts/${id}`);
    console.log('Body fields:', Object.keys(req.body));
    console.log('File uploaded:', req.file ? 'Yes' : 'No');
    
    const {
      bankName,
      emailManager,
      bankAddress,
      accountNumber,
      instructions,
      loginRequired,
      status
    } = req.body;

    // Find existing bank account
    const existingBankAccount = await BankAccount.findOne({ _id: id, createdBy: userId });
    
    if (!existingBankAccount) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Bank account not found'
      });
    }

    // Validate required fields
    if (!bankName?.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Bank name is required'
      });
    }

    if (!accountNumber?.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Account number is required'
      });
    }

    let logoUrl = existingBankAccount.logoUrl;
    let logoPublicId = existingBankAccount.logoPublicId;

    // Handle logo upload if new logo provided
    if (req.file) {
      try {
        console.log('🖼️ Processing logo upload...');
        
        // Delete old logo from Cloudinary if exists
        if (logoPublicId) {
          console.log('🗑️ Deleting old logo:', logoPublicId);
          await deleteFromCloudinary(logoPublicId);
        }

        // Upload new logo
        const uploadResult = await uploadToCloudinary(req.file.buffer, 'bank-logos');
        
        logoUrl = uploadResult.url;
        logoPublicId = uploadResult.publicId;
        
        console.log('✅ Logo uploaded successfully:', logoUrl);
        
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
      bankName: bankName.trim(),
      emailManager: emailManager?.trim() || null,
      bankAddress: bankAddress?.trim() || null,
      accountNumber: accountNumber.trim(),
      instructions: instructions?.trim() || null,
      logoUrl,
      logoPublicId,
      loginRequired: loginRequired === 'true' || loginRequired === true,
      status: status || 'active'
    };

    // Update bank account
    const bankAccount = await BankAccount.findOneAndUpdate(
      { _id: id, createdBy: userId },
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    console.log('✅ Bank account updated');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Bank account updated successfully',
      data: bankAccount
    });
  } catch (error) {
    console.error('❌ Update bank account error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: errors[0] || 'Validation failed',
        errors: errors
      });
    }

    if (error.name === 'CastError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid bank account ID'
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to update bank account'
    });
  }
};

/**
 * Delete bank account
 * @route DELETE /api/bank-accounts/:id
 */
export const deleteBankAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    console.log(`📥 DELETE /api/bank-accounts/${id}`);
    
    const bankAccount = await BankAccount.findOne({ _id: id, createdBy: userId });
    
    if (!bankAccount) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Bank account not found'
      });
    }

    // Delete logo from Cloudinary if exists
    if (bankAccount.logoPublicId) {
      console.log('🗑️ Deleting logo from Cloudinary:', bankAccount.logoPublicId);
      await deleteFromCloudinary(bankAccount.logoPublicId);
    }

    await BankAccount.findByIdAndDelete(id);
    
    console.log('✅ Bank account deleted');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Bank account deleted successfully',
      data: bankAccount
    });
  } catch (error) {
    console.error('❌ Delete bank account error:', error);
    
    if (error.name === 'CastError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid bank account ID'
      });
    }
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete bank account'
    });
  }
};

/**
 * Delete bank account logo
 * @route DELETE /api/bank-accounts/:id/logo
 */
export const deleteBankAccountLogo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    console.log(`🗑️ DELETE /api/bank-accounts/${id}/logo`);
    
    const bankAccount = await BankAccount.findOne({ _id: id, createdBy: userId });

    if (!bankAccount) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Bank account not found'
      });
    }

    if (!bankAccount.logoPublicId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'No logo exists to delete'
      });
    }

    console.log('Deleting logo with public ID:', bankAccount.logoPublicId);

    // Delete from Cloudinary
    await deleteFromCloudinary(bankAccount.logoPublicId);

    // Update bank account to remove logo
    bankAccount.logoUrl = null;
    bankAccount.logoPublicId = null;
    await bankAccount.save();

    console.log('✅ Logo deleted successfully');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Logo deleted successfully',
      data: bankAccount
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
 * Get bank accounts statistics
 * @route GET /api/bank-accounts/stats/summary
 */
export const getBankAccountStats = async (req, res) => {
  try {
    console.log('📥 GET /api/bank-accounts/stats/summary');
    const userId = req.user.id;
    
    const totalAccounts = await BankAccount.countDocuments({ createdBy: userId });
    const activeAccounts = await BankAccount.countDocuments({ status: 'active', createdBy: userId });
    const accountsWithLogos = await BankAccount.countDocuments({ logoUrl: { $ne: null }, createdBy: userId });
    
    console.log('✅ Statistics calculated');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Statistics retrieved successfully',
      data: {
        totalAccounts,
        activeAccounts,
        accountsWithLogos
      }
    });
  } catch (error) {
    console.error('❌ Get statistics error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
};