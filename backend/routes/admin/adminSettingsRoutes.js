const express = require('express');
const upload = require('../../middleware/upload');
const authAdmin = require('../../middleware/authAdmin');
const settingsController = require('../../controllers/admin/settingsController');

const router = express.Router();
router.use(authAdmin);

// Institute Profile (with logo upload)
router.get('/institute-profile', settingsController.getInstituteProfile);
router.put('/institute-profile', upload.single('logo'), settingsController.updateInstituteProfile);

// Account Invoices (multiple bank logos)
router.get('/account-invoices', settingsController.getAccountInvoices);
router.put('/account-invoices', upload.array('logos', 10), settingsController.updateAccountInvoices);

// Rest unchanged
router.get('/fees-particulars', settingsController.getFeesParticulars);
router.put('/fees-particulars', settingsController.updateFeesParticulars);

router.get('/fee-structure', settingsController.getFeeStructure);
router.put('/fee-structure', settingsController.updateFeeStructure);

router.get('/rules', settingsController.getRules);
router.put('/rules', settingsController.updateRules);

router.get('/marks-grading', settingsController.getMarksGrading);
router.put('/marks-grading', settingsController.updateMarksGrading);

router.get('/account-settings', settingsController.getAccountSettings);
router.put('/account-settings', settingsController.updateAccountSettings);

module.exports = router;