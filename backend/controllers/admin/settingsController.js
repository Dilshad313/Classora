const bcrypt = require('bcryptjs');
const { cloudinary } = require('../../config/cloudinary');

const InstituteProfile = require('../../models/admin/settings/InstituteProfile');
const FeesParticulars = require('../../models/admin/settings/FeesParticulars');
const FeeStructure = require('../../models/admin/settings/FeeStructure');
const AccountInvoice = require('../../models/admin/settings/AccountInvoice');
const RulesRegulations = require('../../models/admin/settings/RulesRegulations');
const MarksGrading = require('../../models/admin/settings/MarksGrading');
const AccountSettings = require('../../models/admin/settings/AccountSettings');
const Admin = require('../../models/admin/settings/Admin');

function getAdminId(req) {
  return req.user && req.user.id;
}

// Helper: Delete old Cloudinary image
const deleteCloudinaryImage = async (publicId) => {
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.warn('Failed to delete old image:', publicId);
    }
  }
};

// ========== Institute Profile ==========
exports.getInstituteProfile = async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const profile = await InstituteProfile.findOne({ admin: adminId }).lean();
    return res.json(profile || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateInstituteProfile = async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const { instituteName, tagline, phone, address, country, website } = req.body;

    if (!instituteName || !phone || !address || !country) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const existing = await InstituteProfile.findOne({ admin: adminId });
    let logoUrl = existing?.logoUrl;
    let logoPublicId = existing?.logoPublicId;

    if (req.file) {
      if (existing?.logoPublicId) await deleteCloudinaryImage(existing.logoPublicId);
      logoUrl = req.file.path;
      logoPublicId = req.file.filename;
    }

    const profile = await InstituteProfile.findOneAndUpdate(
      { admin: adminId },
      {
        admin: adminId,
        instituteName,
        tagline,
        phone,
        address,
        country,
        website,
        logoUrl,
        logoPublicId,
      },
      { upsert: true, new: true }
    ).lean();

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ========== Account Invoice (Bank Settings) ==========
exports.getAccountInvoices = async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const doc = await AccountInvoice.findOne({ admin: adminId }).lean();
    res.json(doc ? doc.banks : []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateAccountInvoices = async (req, res) => {
  try {
    const adminId = getAdminId(req);
    let banks = req.body.banks ? JSON.parse(req.body.banks) : [];

    // Handle file upload for each bank (if any)
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file, index) => {
        if (banks[index]) {
          banks[index].logoUrl = file.path;
          banks[index].logoPublicId = file.filename;
        }
      });
    }

    // Clean up old images if bank is removed or replaced
    const existing = await AccountInvoice.findOne({ admin: adminId });
    if (existing) {
      // Simple cleanup: delete any logo not present in new list
      existing.banks.forEach(async (oldBank) => {
        const stillExists = banks.some(b => b.logoPublicId === oldBank.logoPublicId);
        if (oldBank.logoPublicId && !stillExists) {
          await deleteCloudinaryImage(oldBank.logoPublicId);
        }
      });
    }

    const doc = await AccountInvoice.findOneAndUpdate(
      { admin: adminId },
      { admin: adminId, banks },
      { upsert: true, new: true }
    ).lean();

    res.json(doc.banks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Other controllers remain unchanged (FeesParticulars, FeeStructure, Rules, MarksGrading, AccountSettings)