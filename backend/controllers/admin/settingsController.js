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
      for (const oldBank of existing.banks) {
        const stillExists = banks.some(b => b.logoPublicId === oldBank.logoPublicId);
        if (oldBank.logoPublicId && !stillExists) {
          try { await deleteCloudinaryImage(oldBank.logoPublicId); } catch {}
        }
      }
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

// ========== Fees Particulars ==========
exports.getFeesParticulars = async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const doc = await FeesParticulars.findOne({ admin: adminId }).lean();
    res.json(doc ? doc.data : {});
  } catch (err) {
    console.error('Get fees particulars error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateFeesParticulars = async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const data = req.body?.data || req.body;
    const doc = await FeesParticulars.findOneAndUpdate(
      { admin: adminId },
      { admin: adminId, data },
      { upsert: true, new: true }
    ).lean();
    res.json(doc.data);
  } catch (err) {
    console.error('Update fees particulars error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ========== Fee Structure ==========
exports.getFeeStructure = async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const doc = await FeeStructure.findOne({ admin: adminId }).lean();
    res.json(doc ? doc.items : []);
  } catch (err) {
    console.error('Get fee structure error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateFeeStructure = async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const items = Array.isArray(req.body?.items) ? req.body.items : [];
    const doc = await FeeStructure.findOneAndUpdate(
      { admin: adminId },
      { admin: adminId, items },
      { upsert: true, new: true }
    ).lean();
    res.json(doc.items);
  } catch (err) {
    console.error('Update fee structure error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ========== Rules & Regulations ==========
exports.getRules = async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const doc = await RulesRegulations.findOne({ admin: adminId }).lean();
    res.json(doc ? doc.rules : []);
  } catch (err) {
    console.error('Get rules error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateRules = async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const rules = Array.isArray(req.body?.rules) ? req.body.rules : [];
    const doc = await RulesRegulations.findOneAndUpdate(
      { admin: adminId },
      { admin: adminId, rules },
      { upsert: true, new: true }
    ).lean();
    res.json(doc.rules);
  } catch (err) {
    console.error('Update rules error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ========== Marks Grading ==========
exports.getMarksGrading = async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const doc = await MarksGrading.findOne({ admin: adminId }).lean();
    res.json(doc ? doc.grades : []);
  } catch (err) {
    console.error('Get marks grading error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateMarksGrading = async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const grades = Array.isArray(req.body?.grades) ? req.body.grades : [];
    const doc = await MarksGrading.findOneAndUpdate(
      { admin: adminId },
      { admin: adminId, grades },
      { upsert: true, new: true }
    ).lean();
    res.json(doc.grades);
  } catch (err) {
    console.error('Update marks grading error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ========== Account Settings ==========
exports.getAccountSettings = async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const doc = await AccountSettings.findOne({ admin: adminId }).lean();
    res.json(doc || {});
  } catch (err) {
    console.error('Get account settings error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateAccountSettings = async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const { username, name, currency, subscription, expiry, preferences } = req.body;
    const doc = await AccountSettings.findOneAndUpdate(
      { admin: adminId },
      { admin: adminId, username, name, currency, subscription, expiry, preferences },
      { upsert: true, new: true }
    ).lean();
    res.json(doc);
  } catch (err) {
    console.error('Update account settings error', err);
    res.status(500).json({ message: 'Server error' });
  }
};