const express = require('express');
const feesController = require('../controllers/feesController');

const router = express.Router();

router.get('/receipts', feesController.listReceiptsByStudent);
router.post('/receipts', feesController.createReceipt);

module.exports = router;