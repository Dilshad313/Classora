import RulesRegulations from '../models/RulesRegulations.js';
import { StatusCodes } from 'http-status-codes';

/**
 * Get all rules and regulations
 * @route GET /api/rules-regulations
 */
export const getAllRules = async (req, res) => {
  try {
    console.log('📥 GET /api/rules-regulations');
    
    const { status, isRequired } = req.query;
    const userId = req.user.id;
    
    // Build query
    const query = { createdBy: userId };
    if (status) query.status = status;
    if (isRequired !== undefined) query.isRequired = isRequired === 'true';
    
    const rules = await RulesRegulations.find(query)
      .sort({ priority: 1, createdAt: -1 });
    
    console.log(`✅ Found ${rules.length} rules`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Rules retrieved successfully',
      count: rules.length,
      data: rules
    });
  } catch (error) {
    console.error('❌ Get rules error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch rules'
    });
  }
};

/**
 * Get single rule by ID
 * @route GET /api/rules-regulations/:id
 */
export const getRuleById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    console.log(`📥 GET /api/rules-regulations/${id}`);
    
    const rule = await RulesRegulations.findOne({ _id: id, createdBy: userId });
    
    if (!rule) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Rule not found'
      });
    }
    
    console.log('✅ Rule found');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Rule retrieved successfully',
      data: rule
    });
  } catch (error) {
    console.error('❌ Get rule error:', error);
    
    if (error.name === 'CastError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid rule ID'
      });
    }
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch rule'
    });
  }
};

/**
 * Create new rule
 * @route POST /api/rules-regulations
 */
export const createRule = async (req, res) => {
  try {
    console.log('📥 POST /api/rules-regulations');
    console.log('Request body:', req.body);
    
    const userId = req.user.id;
    const {
      title,
      content,
      isRequired,
      priority,
      fontSize,
      textAlign,
      formatting,
      status
    } = req.body;

    // Validate required fields
    if (!title?.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Rule title is required'
      });
    }

    if (!content?.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Rule content is required'
      });
    }

    // Create rule data
    const ruleData = {
      title: title.trim(),
      content: content.trim(),
      isRequired: isRequired !== undefined ? isRequired : true,
      priority: priority || 1,
      fontSize: fontSize || 14,
      textAlign: textAlign || 'left',
      formatting: {
        bold: formatting?.bold || false,
        italic: formatting?.italic || false,
        underline: formatting?.underline || false
      },
      status: status || 'active',
      createdBy: userId
    };

    // Create new rule
    const rule = await RulesRegulations.create(ruleData);
    
    console.log('✅ Rule created:', rule._id);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Rule created successfully',
      data: rule
    });
  } catch (error) {
    console.error('❌ Create rule error:', error);

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
      message: error.message || 'Failed to create rule'
    });
  }
};

/**
 * Update rule
 * @route PUT /api/rules-regulations/:id
 */
export const updateRule = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    console.log(`📥 PUT /api/rules-regulations/${id}`);
    console.log('Request body:', req.body);
    
    const {
      title,
      content,
      isRequired,
      priority,
      fontSize,
      textAlign,
      formatting,
      status
    } = req.body;

    // Find existing rule
    const existingRule = await RulesRegulations.findOne({ _id: id, createdBy: userId });
    
    if (!existingRule) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Rule not found'
      });
    }

    // Validate required fields
    if (!title?.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Rule title is required'
      });
    }

    if (!content?.trim()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Rule content is required'
      });
    }

    // Prepare update data
    const updateData = {
      title: title.trim(),
      content: content.trim(),
      isRequired: isRequired !== undefined ? isRequired : existingRule.isRequired,
      priority: priority || existingRule.priority,
      fontSize: fontSize || existingRule.fontSize,
      textAlign: textAlign || existingRule.textAlign,
      formatting: {
        bold: formatting?.bold !== undefined ? formatting.bold : existingRule.formatting.bold,
        italic: formatting?.italic !== undefined ? formatting.italic : existingRule.formatting.italic,
        underline: formatting?.underline !== undefined ? formatting.underline : existingRule.formatting.underline
      },
      status: status || existingRule.status
    };

    // Update rule
    const rule = await RulesRegulations.findOneAndUpdate(
      { _id: id, createdBy: userId },
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    console.log('✅ Rule updated');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Rule updated successfully',
      data: rule
    });
  } catch (error) {
    console.error('❌ Update rule error:', error);

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
        message: 'Invalid rule ID'
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'Failed to update rule'
    });
  }
};

/**
 * Delete rule
 * @route DELETE /api/rules-regulations/:id
 */
export const deleteRule = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    console.log(`📥 DELETE /api/rules-regulations/${id}`);
    
    const rule = await RulesRegulations.findOneAndDelete({ _id: id, createdBy: userId });
    
    if (!rule) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Rule not found'
      });
    }

    console.log('✅ Rule deleted');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Rule deleted successfully',
      data: rule
    });
  } catch (error) {
    console.error('❌ Delete rule error:', error);
    
    if (error.name === 'CastError') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid rule ID'
      });
    }
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete rule'
    });
  }
};

/**
 * Reorder rules priorities
 * @route PUT /api/rules-regulations/reorder
 */
export const reorderRules = async (req, res) => {
  try {
    console.log('📥 PUT /api/rules-regulations/reorder');
    const userId = req.user.id;
    const { rules } = req.body;

    if (!Array.isArray(rules) || rules.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Rules array is required'
      });
    }

    // Verify all rules belong to user
    const ruleIds = rules.map(r => r.id);
    const count = await RulesRegulations.countDocuments({
      _id: { $in: ruleIds },
      createdBy: userId
    });

    if (count !== rules.length) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'You can only reorder your own rules'
      });
    }

    await RulesRegulations.reorderPriorities(rules);

    const updatedRules = await RulesRegulations.find({ 
      _id: { $in: ruleIds },
      createdBy: userId
    }).sort({ priority: 1 });

    console.log('✅ Rules reordered successfully');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Rules reordered successfully',
      data: updatedRules
    });
  } catch (error) {
    console.error('❌ Reorder rules error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to reorder rules'
    });
  }
};

/**
 * Get rules statistics
 * @route GET /api/rules-regulations/stats/summary
 */
export const getRulesStats = async (req, res) => {
  try {
    console.log('📥 GET /api/rules-regulations/stats/summary');
    const userId = req.user.id;
    
    const totalRules = await RulesRegulations.countDocuments({ createdBy: userId });
    const activeRules = await RulesRegulations.countDocuments({ status: 'active', createdBy: userId });
    const requiredRules = await RulesRegulations.countDocuments({ isRequired: true, status: 'active', createdBy: userId });
    const optionalRules = await RulesRegulations.countDocuments({ isRequired: false, status: 'active', createdBy: userId });
    
    console.log('✅ Statistics calculated');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Statistics retrieved successfully',
      data: {
        totalRules,
        activeRules,
        requiredRules,
        optionalRules
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

/**
 * Bulk delete rules
 * @route POST /api/rules-regulations/bulk-delete
 */
export const bulkDeleteRules = async (req, res) => {
  try {
    console.log('📥 POST /api/rules-regulations/bulk-delete');
    const userId = req.user.id;
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'IDs array is required'
      });
    }

    const result = await RulesRegulations.deleteMany({ 
      _id: { $in: ids },
      createdBy: userId
    });

    console.log(`✅ Deleted ${result.deletedCount} rules`);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} rule(s)`,
      data: { deletedCount: result.deletedCount }
    });
  } catch (error) {
    console.error('❌ Bulk delete error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete rules'
    });
  }
};