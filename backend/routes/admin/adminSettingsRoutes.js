const express = require('express');

const authAdmin = require('../../middleware/authAdmin');
const settingsController = require('../../controllers/admin/settingsController');

const router = express.Router();

router.use(authAdmin);

// Institute Profile
router.get('/institute-profile', settingsController.getInstituteProfile);
router.put('/institute-profile', settingsController.updateInstituteProfile);

// Fees Particulars
router.get('/fees-particulars', settingsController.getFeesParticulars);
router.put('/fees-particulars', settingsController.updateFeesParticulars);

// Fee Structure
router.get('/fee-structure', settingsController.getFeeStructure);
router.put('/fee-structure', settingsController.updateFeeStructure);

// Account Invoices (Bank settings)
router.get('/account-invoices', settingsController.getAccountInvoices);
router.put('/account-invoices', settingsController.updateAccountInvoices);

// Rules & Regulations
router.get('/rules', settingsController.getRules);
router.put('/rules', settingsController.updateRules);

// Marks Grading
router.get('/marks-grading', settingsController.getMarksGrading);
router.put('/marks-grading', settingsController.updateMarksGrading);

// Account Settings
router.get('/account-settings', settingsController.getAccountSettings);
router.put('/account-settings', settingsController.updateAccountSettings);

module.exports = router;
