const bcrypt = require('bcryptjs');

const InstituteProfile = require('../../models/admin/settings/InstituteProfile');
const FeesParticulars = require('../../models/admin/settings/FeesParticulars');
const FeeStructure = require('../../models/admin/settings/FeeStructure');
const AccountInvoice = require('../../models/admin/settings/AccountInvoice');
const RulesRegulations = require('../../models/admin/settings/RulesRegulations');
const MarksGrading = require('../../models/admin/settings/MarksGrading');
const AccountSettings = require('../../models/admin/settings/AccountSettings');
const Admin = require('../../models/admin/settings/Admin');

// Helper to get admin id from request
function getAdminId(req) {
  return req.user && req.user.id;
}

// Institute Profile
exports.getInstituteProfile = async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const profile = await InstituteProfile.findOne({ admin: adminId }).lean();
    return res.json(profile || null);
  } catch (err) {
    console.error('getInstituteProfile error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateInstituteProfile = async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const { instituteName, tagline, phone, address, country, website } = req.body;

    if (!instituteName || !phone || !address || !country) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const profile = await InstituteProfile.findOneAndUpdate(
      { admin: adminId },
      { admin: adminId, instituteName, tagline, phone, address, country, website },
      { upsert: true, new: true }
    ).lean();

    return res.json(profile);
  } catch (err) {
    console.error('updateInstituteProfile error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Fees Particulars
exports.getFeesParticulars = async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const doc = await FeesParticulars.findOne({ admin: adminId }).lean();
    return res.json(doc ? doc.data : null);
  } catch (err) {
    console.error('getFeesParticulars error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateFeesParticulars = async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const data = req.body && typeof req.body === 'object' ? req.body : {};

    const doc = await FeesParticulars.findOneAndUpdate(
      { admin: adminId },
      { admin: adminId, data },
      { upsert: true, new: true }
    ).lean();

    return res.json(doc.data);
  } catch (err) {
    console.error('updateFeesParticulars error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Fee Structure (array of items)
exports.getFeeStructure = async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const doc = await FeeStructure.findOne({ admin: adminId }).lean();
    return res.json(doc ? doc.items : []);
  } catch (err) {
    console.error('getFeeStructure error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateFeeStructure = async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const items = Array.isArray(req.body.items) ? req.body.items : [];

    const doc = await FeeStructure.findOneAndUpdate(
      { admin: adminId },
      { admin: adminId, items },
      { upsert: true, new: true }
    ).lean();

    return res.json(doc.items);
  } catch (err) {
    console.error('updateFeeStructure error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Account Invoice (bank settings)
exports.getAccountInvoices = async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const doc = await AccountInvoice.findOne({ admin: adminId }).lean();
    return res.json(doc ? doc.banks : []);
  } catch (err) {
    console.error('getAccountInvoices error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateAccountInvoices = async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const banks = Array.isArray(req.body.banks) ? req.body.banks : [];

    const doc = await AccountInvoice.findOneAndUpdate(
      { admin: adminId },
      { admin: adminId, banks },
      { upsert: true, new: true }
    ).lean();

    return res.json(doc.banks);
  } catch (err) {
    console.error('updateAccountInvoices error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Rules & Regulations (array of rules)
exports.getRules = async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const doc = await RulesRegulations.findOne({ admin: adminId }).lean();
    return res.json(doc ? doc.rules : []);
  } catch (err) {
    console.error('getRules error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateRules = async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const rules = Array.isArray(req.body.rules) ? req.body.rules : [];

    const doc = await RulesRegulations.findOneAndUpdate(
      { admin: adminId },
      { admin: adminId, rules },
      { upsert: true, new: true }
    ).lean();

    return res.json(doc.rules);
  } catch (err) {
    console.error('updateRules error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Marks Grading (array of grades)
exports.getMarksGrading = async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const doc = await MarksGrading.findOne({ admin: adminId }).lean();
    return res.json(doc ? doc.grades : []);
  } catch (err) {
    console.error('getMarksGrading error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateMarksGrading = async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const grades = Array.isArray(req.body.grades) ? req.body.grades : [];

    const doc = await MarksGrading.findOneAndUpdate(
      { admin: adminId },
      { admin: adminId, grades },
      { upsert: true, new: true }
    ).lean();

    return res.json(doc.grades);
  } catch (err) {
    console.error('updateMarksGrading error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Account Settings (admin profile, password, preferences)
exports.getAccountSettings = async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const [admin, settings] = await Promise.all([
      Admin.findById(adminId).lean(),
      AccountSettings.findOne({ admin: adminId }).lean()
    ]);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const response = {
      username: settings?.username || admin.email,
      name: settings?.name || admin.fullName,
      currency: settings?.currency || 'Dollars (USD)',
      subscription: settings?.subscription || 'FREE',
      expiry: settings?.expiry || 'None',
      preferences: settings?.preferences || {}
    };

    return res.json(response);
  } catch (err) {
    console.error('getAccountSettings error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateAccountSettings = async (req, res) => {
  try {
    const adminId = getAdminId(req);
    const { username, name, currency, subscription, expiry, preferences, newPassword } = req.body;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (username) admin.email = username.toLowerCase();
    if (name) admin.fullName = name;

    if (newPassword && newPassword.length >= 6) {
      admin.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    await admin.save();

    const settings = await AccountSettings.findOneAndUpdate(
      { admin: adminId },
      {
        admin: adminId,
        username: username || admin.email,
        name: name || admin.fullName,
        currency,
        subscription,
        expiry,
        preferences
      },
      { upsert: true, new: true }
    ).lean();

    const response = {
      username: settings.username,
      name: settings.name,
      currency: settings.currency,
      subscription: settings.subscription,
      expiry: settings.expiry,
      preferences: settings.preferences || {}
    };

    return res.json(response);
  } catch (err) {
    console.error('updateAccountSettings error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
