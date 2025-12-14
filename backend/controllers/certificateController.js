import mongoose from 'mongoose';
import CertificateTemplate from '../models/CertificateTemplate.js';
import GeneratedCertificate from '../models/GeneratedCertificate.js';
import Student from '../models/Student.js';
import Employee from '../models/Employee.js';
import { StatusCodes } from 'http-status-codes';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';

/**
 * Get all certificate templates with filtering
 * @route GET /api/certificates/templates
 */
export const getCertificateTemplates = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, search, page = 1, limit = 10 } = req.query;
    
    console.log(`📥 GET /api/certificates/templates for user: ${userId}`);
    
    // Build query
    const query = { createdBy: userId, isActive: true };
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'content.headerTitle': { $regex: search, $options: 'i' } }
      ];
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [templates, total] = await Promise.all([
      CertificateTemplate.find(query)
        .sort({ isDefault: -1, category: 1, name: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      CertificateTemplate.countDocuments(query)
    ]);
    
    console.log(`✅ Found ${templates.length} certificate templates`);
    
    // Transform templates for frontend
    const transformedTemplates = templates.map(template => ({
      id: template._id,
      name: template.name,
      description: template.description,
      category: template.category,
      isDefault: template.isDefault,
      design: template.design,
      previewText: template.content.previewText,
      usageCount: template.usageCount
    }));
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Certificate templates retrieved successfully',
      count: templates.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: transformedTemplates
    });
  } catch (error) {
    console.error('❌ Get certificate templates error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch certificate templates'
    });
  }
};

/**
 * Get single certificate template by ID
 * @route GET /api/certificates/templates/:id
 */
export const getCertificateTemplateById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    console.log(`📥 GET /api/certificates/templates/${id}`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid template ID'
      });
    }
    
    const template = await CertificateTemplate.findOne({ 
      _id: id, 
      createdBy: userId,
      isActive: true 
    });
    
    if (!template) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Certificate template not found'
      });
    }
    
    console.log('✅ Certificate template found:', template.name);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Certificate template retrieved successfully',
      data: template
    });
  } catch (error) {
    console.error('❌ Get certificate template error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch certificate template'
    });
  }
};

/**
 * Create new certificate template
 * @route POST /api/certificates/templates
 */
export const createCertificateTemplate = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('📥 POST /api/certificates/templates');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const {
      name,
      description,
      category,
      design,
      content,
      isDefault
    } = req.body;
    
    // Validation
    if (!name || !description || !category) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Name, description, and category are required'
      });
    }
    
    // Check for duplicate template name
    const existingTemplate = await CertificateTemplate.findOne({
      name: name.trim(),
      createdBy: userId,
      isActive: true
    });
    
    if (existingTemplate) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: `Template "${name}" already exists`
      });
    }
    
    // Create template
    const templateData = {
      name: name.trim(),
      description: description.trim(),
      category: category,
      design: {
        borderStyle: design?.borderStyle || 'double',
        borderColor: design?.borderColor || 'blue',
        headerBg: design?.headerBg || 'gradient-blue',
        accentColor: design?.accentColor || 'blue'
      },
      content: {
        previewText: content?.previewText || `This certificate is awarded to [Student Name] for ${name}...`,
        headerTitle: content?.headerTitle || name.toUpperCase(),
        instituteName: content?.instituteName || 'Classora Institute',
        instituteTagline: content?.instituteTagline || 'Excellence in Education',
        footerText: content?.footerText || 'This is a computer-generated certificate.'
      },
      isDefault: isDefault || false,
      createdBy: userId
    };
    
    const template = await CertificateTemplate.create(templateData);
    
    console.log('✅ Certificate template created:', template._id);
    
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Certificate template created successfully',
      data: template
    });
  } catch (error) {
    console.error('❌ Create certificate template error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: errors[0] || 'Validation failed',
        errors
      });
    }
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to create certificate template'
    });
  }
};

/**
 * Update certificate template
 * @route PUT /api/certificates/templates/:id
 */
export const updateCertificateTemplate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    console.log(`📥 PUT /api/certificates/templates/${id}`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid template ID'
      });
    }
    
    const template = await CertificateTemplate.findOne({ 
      _id: id, 
      createdBy: userId,
      isActive: true 
    });
    
    if (!template) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Certificate template not found'
      });
    }
    
    const {
      name,
      description,
      category,
      design,
      content,
      isDefault
    } = req.body;
    
    // Check for duplicate if name changed
    if (name && name !== template.name) {
      const duplicate = await CertificateTemplate.findOne({
        name: name.trim(),
        createdBy: userId,
        _id: { $ne: id },
        isActive: true
      });
      
      if (duplicate) {
        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: `Template "${name}" already exists`
        });
      }
    }
    
    // Update fields
    if (name) template.name = name.trim();
    if (description) template.description = description.trim();
    if (category) template.category = category;
    if (isDefault !== undefined) template.isDefault = isDefault;
    
    // Update design if provided
    if (design) {
      if (design.borderStyle) template.design.borderStyle = design.borderStyle;
      if (design.borderColor) template.design.borderColor = design.borderColor;
      if (design.headerBg) template.design.headerBg = design.headerBg;
      if (design.accentColor) template.design.accentColor = design.accentColor;
    }
    
    // Update content if provided
    if (content) {
      if (content.previewText) template.content.previewText = content.previewText;
      if (content.headerTitle) template.content.headerTitle = content.headerTitle;
      if (content.instituteName) template.content.instituteName = content.instituteName;
      if (content.instituteTagline) template.content.instituteTagline = content.instituteTagline;
      if (content.footerText) template.content.footerText = content.footerText;
    }
    
    await template.save();
    
    console.log('✅ Certificate template updated:', template._id);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Certificate template updated successfully',
      data: template
    });
  } catch (error) {
    console.error('❌ Update certificate template error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: errors[0] || 'Validation failed',
        errors
      });
    }
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update certificate template'
    });
  }
};

/**
 * Delete certificate template
 * @route DELETE /api/certificates/templates/:id
 */
export const deleteCertificateTemplate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    console.log(`📥 DELETE /api/certificates/templates/${id}`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid template ID'
      });
    }
    
    const template = await CertificateTemplate.findOne({ 
      _id: id, 
      createdBy: userId 
    });
    
    if (!template) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Certificate template not found'
      });
    }
    
    // Don't allow deletion of default templates
    if (template.isDefault) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Cannot delete default template. Set another template as default first.'
      });
    }
    
    // Soft delete by marking as inactive
    template.isActive = false;
    await template.save();
    
    console.log('✅ Certificate template deleted (soft):', id);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Certificate template deleted successfully',
      data: { id }
    });
  } catch (error) {
    console.error('❌ Delete certificate template error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete certificate template'
    });
  }
};

/**
 * Bulk delete certificate templates
 * @route POST /api/certificates/templates/bulk-delete
 */
export const bulkDeleteCertificateTemplates = async (req, res) => {
  try {
    const userId = req.user.id;
    const { ids } = req.body;
    
    console.log('📥 POST /api/certificates/templates/bulk-delete');
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Please provide template IDs to delete'
      });
    }
    
    const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
    
    if (validIds.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'No valid template IDs provided'
      });
    }
    
    // Check if any of the templates are default
    const defaultTemplates = await CertificateTemplate.find({
      _id: { $in: validIds },
      createdBy: userId,
      isDefault: true
    });
    
    if (defaultTemplates.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Cannot delete default templates. Set another template as default first.'
      });
    }
    
    // Soft delete by marking as inactive
    const result = await CertificateTemplate.updateMany(
      {
        _id: { $in: validIds },
        createdBy: userId
      },
      { isActive: false }
    );
    
    console.log(`✅ Deleted ${result.modifiedCount} certificate templates`);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: `Successfully deleted ${result.modifiedCount} certificate templates`,
      data: { deletedCount: result.modifiedCount }
    });
  } catch (error) {
    console.error('❌ Bulk delete certificate templates error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to delete certificate templates'
    });
  }
};

/**
 * Get dropdown data for certificate generation
 * @route GET /api/certificates/dropdown-data
 */
export const getCertificateDropdownData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { recipientType } = req.query;
    
    console.log(`📥 GET /api/certificates/dropdown-data for user: ${userId}`);
    
    // Get templates
    const templates = await CertificateTemplate.find({
      createdBy: userId,
      isActive: true
    })
    .select('name category design content.previewText isDefault')
    .sort({ category: 1, name: 1 });
    
    // Get students
    const students = await Student.find({ status: 'active' })
      .select('studentName registrationNo admissionNumber selectClass section rollNumber')
      .sort({ studentName: 1 });
    
    // Get employees (teachers/staff)
    const employees = await Employee.find({ status: 'active' })
      .select('employeeName employeeRole employeeId department')
      .sort({ employeeName: 1 });
    
    // Filter recipient data if type specified
    let recipientData = [];
    if (recipientType === 'Student') {
      recipientData = students;
    } else if (recipientType === 'Staff') {
      recipientData = employees;
    }
    
    console.log(`✅ Dropdown data retrieved: ${templates.length} templates, ${students.length} students, ${employees.length} employees`);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Dropdown data retrieved successfully',
      data: {
        templates,
        students,
        employees,
        recipientData
      }
    });
  } catch (error) {
    console.error('❌ Get dropdown data error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch dropdown data'
    });
  }
};

/**
 * Generate new certificate
 * @route POST /api/certificates/generate
 */
export const generateCertificate = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('📥 POST /api/certificates/generate');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const {
      templateId,
      recipientType,
      recipientId,
      customText,
      issueDate,
      validUntil,
      issuedBy
    } = req.body;
    
    // Validation
    if (!templateId || !recipientType || !recipientId || !issueDate) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Template ID, recipient type, recipient ID, and issue date are required'
      });
    }
    
    // Validate template
    const template = await CertificateTemplate.findOne({
      _id: templateId,
      createdBy: userId,
      isActive: true
    });
    
    if (!template) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Certificate template not found'
      });
    }
    
    let recipient = null;
    let recipientName = '';
    const contentData = new Map();
    
    // Get recipient details based on type
    if (recipientType === 'Student') {
      recipient = await Student.findById(recipientId);
      if (!recipient) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Student not found'
        });
      }
      
      recipientName = recipient.studentName;
      
      // Populate content data for student
      contentData.set('studentName', recipient.studentName);
      contentData.set('registrationNo', recipient.registrationNo);
      contentData.set('admissionNumber', recipient.admissionNumber);
      contentData.set('class', recipient.selectClass);
      contentData.set('section', recipient.section);
      contentData.set('rollNumber', recipient.rollNumber);
      contentData.set('fatherName', recipient.fatherName || '[Father Name]');
      contentData.set('motherName', recipient.motherName || '[Mother Name]');
      contentData.set('dateOfBirth', recipient.dateOfBirth ? 
        new Date(recipient.dateOfBirth).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }) : '[Date of Birth]');
      contentData.set('admissionDate', recipient.dateOfAdmission ? 
        new Date(recipient.dateOfAdmission).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }) : '[Admission Date]');
      
    } else if (recipientType === 'Staff') {
      recipient = await Employee.findById(recipientId);
      if (!recipient) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: 'Employee not found'
        });
      }
      
      recipientName = recipient.employeeName;
      
      // Populate content data for staff
      contentData.set('employeeName', recipient.employeeName);
      contentData.set('employeeId', recipient.employeeId || '[Employee ID]');
      contentData.set('employeeRole', recipient.employeeRole);
      contentData.set('department', recipient.department || '[Department]');
      contentData.set('dateOfJoining', recipient.dateOfJoining ? 
        new Date(recipient.dateOfJoining).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }) : '[Joining Date]');
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid recipient type'
      });
    }
    
    // Create certificate
    const certificateData = {
      templateId,
      title: template.content.headerTitle,
      recipientType,
      recipientId,
      recipientName,
      content: Object.fromEntries(contentData),
      customText: customText || '',
      issueDate: new Date(issueDate),
      validUntil: validUntil ? new Date(validUntil) : null,
      issuedBy: issuedBy || 'Principal',
      createdBy: userId
    };
    
    const certificate = await GeneratedCertificate.create(certificateData);
    
    // Increment template usage count
    await template.incrementUsage();
    
    console.log('✅ Certificate generated:', certificate.certificateNumber);
    
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Certificate generated successfully',
      data: certificate
    });
  } catch (error) {
    console.error('❌ Generate certificate error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: errors[0] || 'Validation failed',
        errors
      });
    }
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to generate certificate'
    });
  }
};

/**
 * Get generated certificate by ID
 * @route GET /api/certificates/:id
 */
export const getGeneratedCertificate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    console.log(`📥 GET /api/certificates/${id}`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid certificate ID'
      });
    }
    
    const certificate = await GeneratedCertificate.findOne({
      _id: id,
      createdBy: userId
    })
    .populate('template')
    .populate('recipient');
    
    if (!certificate) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Certificate not found'
      });
    }
    
    // Log access
    certificate.accessLog.push({
      accessedAt: new Date(),
      accessedBy: userId,
      action: 'viewed'
    });
    await certificate.save();
    
    console.log('✅ Certificate found:', certificate.certificateNumber);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Certificate retrieved successfully',
      data: certificate
    });
  } catch (error) {
    console.error('❌ Get certificate error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch certificate'
    });
  }
};

/**
 * Get all generated certificates
 * @route GET /api/certificates
 */
export const getGeneratedCertificates = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      recipientType, 
      status, 
      search, 
      startDate, 
      endDate,
      page = 1, 
      limit = 10 
    } = req.query;
    
    console.log(`📥 GET /api/certificates for user: ${userId}`);
    
    // Build query
    const query = { createdBy: userId };
    
    if (recipientType && recipientType !== 'all') {
      query.recipientType = recipientType;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { certificateNumber: { $regex: search, $options: 'i' } },
        { recipientName: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (startDate && endDate) {
      query.issueDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [certificates, total] = await Promise.all([
      GeneratedCertificate.find(query)
        .populate('template', 'name category')
        .sort({ issueDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      GeneratedCertificate.countDocuments(query)
    ]);
    
    console.log(`✅ Found ${certificates.length} generated certificates`);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Certificates retrieved successfully',
      count: certificates.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: certificates
    });
  } catch (error) {
    console.error('❌ Get certificates error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch certificates'
    });
  }
};

/**
 * Update certificate status (print/download tracking)
 * @route PATCH /api/certificates/:id/status
 */
export const updateCertificateStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { action } = req.body;
    
    console.log(`📥 PATCH /api/certificates/${id}/status`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid certificate ID'
      });
    }
    
    const validActions = ['printed', 'downloaded', 'revoked'];
    if (!action || !validActions.includes(action)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `Invalid action. Must be one of: ${validActions.join(', ')}`
      });
    }
    
    const certificate = await GeneratedCertificate.findOne({
      _id: id,
      createdBy: userId
    });
    
    if (!certificate) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Certificate not found'
      });
    }
    
    // Update based on action
    if (action === 'printed') {
      certificate.isPrinted = true;
    } else if (action === 'downloaded') {
      certificate.isDownloaded = true;
    } else if (action === 'revoked') {
      certificate.status = 'revoked';
    }
    
    // Log access
    certificate.accessLog.push({
      accessedAt: new Date(),
      accessedBy: userId,
      action: action
    });
    
    await certificate.save();
    
    console.log(`✅ Certificate ${action}:`, certificate.certificateNumber);
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: `Certificate ${action} successfully`,
      data: certificate
    });
  } catch (error) {
    console.error('❌ Update certificate status error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update certificate status'
    });
  }
};

/**
 * Get certificate statistics
 * @route GET /api/certificates/stats/summary
 */
export const getCertificateStats = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`📥 GET /api/certificates/stats/summary for user: ${userId}`);
    
    // Get template stats
    const templateStats = await CertificateTemplate.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(userId), isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalUsage: { $sum: '$usageCount' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    // Get generated certificate stats
    const certificateStats = await GeneratedCertificate.getStats(userId);
    
    // Get recent certificates (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentCertificates = await GeneratedCertificate.countDocuments({
      createdBy: userId,
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Get most used template
    const mostUsedTemplate = await CertificateTemplate.findOne({
      createdBy: userId,
      isActive: true
    })
    .sort({ usageCount: -1 })
    .select('name usageCount');
    
    console.log('✅ Certificate stats retrieved');
    
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Certificate statistics retrieved successfully',
      data: {
        templates: templateStats,
        certificates: certificateStats,
        recentCertificates,
        mostUsedTemplate: mostUsedTemplate || { name: 'No templates', usageCount: 0 }
      }
    });
  } catch (error) {
    console.error('❌ Get certificate stats error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch certificate statistics'
    });
  }
};

/**
 * Export certificates to PDF (placeholder for PDF generation)
 * @route POST /api/certificates/:id/export
 */
export const exportCertificateToPDF = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    console.log(`📥 POST /api/certificates/${id}/export`);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid certificate ID'
      });
    }
    
    const certificate = await GeneratedCertificate.findOne({
      _id: id,
      createdBy: userId
    })
    .populate('template')
    .populate('recipient');
    
    if (!certificate) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Certificate not found'
      });
    }
    
    // In a real implementation, this would generate a PDF
    // For now, we'll return a success response with the data needed for PDF generation
    
    // Update certificate status
    certificate.isDownloaded = true;
    certificate.accessLog.push({
      accessedAt: new Date(),
      accessedBy: userId,
      action: 'downloaded'
    });
    await certificate.save();
    
    console.log('✅ Certificate prepared for export:', certificate.certificateNumber);
    
    // Return data that can be used by frontend to generate PDF
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Certificate prepared for export',
      data: {
        certificate: certificate,
        pdfData: {
          // This would contain PDF generation data
          title: certificate.title,
          recipientName: certificate.recipientName,
          certificateNumber: certificate.certificateNumber,
          issueDate: certificate.issueDate,
          // Add more data as needed for PDF generation
        }
      }
    });
  } catch (error) {
    console.error('❌ Export certificate error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to export certificate'
    });
  }
};

/**
 * Initialize default templates for new admin
 * @route POST /api/certificates/templates/initialize
 */
export const initializeDefaultTemplates = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('📥 POST /api/certificates/templates/initialize');
    
    // Check if templates already exist
    const existingTemplates = await CertificateTemplate.countDocuments({
      createdBy: userId,
      isActive: true
    });
    
    if (existingTemplates > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Templates already exist for this account'
      });
    }
    
    // Initialize default templates
    const templates = await CertificateTemplate.initializeDefaultTemplates(userId);
    
    console.log(`✅ Initialized ${templates.length} default templates`);
    
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Default templates initialized successfully',
      data: templates
    });
  } catch (error) {
    console.error('❌ Initialize templates error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to initialize default templates'
    });
  }
};