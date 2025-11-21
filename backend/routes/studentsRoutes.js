const express = require('express');
const upload = require('../middleware/upload');
const studentsController = require('../controllers/studentsController');

const router = express.Router();

router.get('/', studentsController.listStudentsByClass);
router.post('/', upload.single('photo'), studentsController.createStudent);
router.put('/:id/photo', upload.single('photo'), studentsController.updatePhoto);

module.exports = router;