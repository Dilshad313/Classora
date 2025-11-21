const express = require('express');
const upload = require('../middleware/upload');
const employeesController = require('../controllers/employeesController');

const router = express.Router();

router.get('/', employeesController.listEmployees);
router.post('/', upload.single('photo'), employeesController.createEmployee);
router.put('/:id/photo', upload.single('photo'), employeesController.updatePhoto);

module.exports = router;