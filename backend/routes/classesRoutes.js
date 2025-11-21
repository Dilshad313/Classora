const express = require('express');
const router = express.Router();
const classesController = require('../controllers/classesController');

router.get('/', classesController.listClasses);
router.post('/', classesController.createClass);

module.exports = router;