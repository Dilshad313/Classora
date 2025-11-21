const express = require('express');
const accountsController = require('../controllers/accountsController');

const router = express.Router();

router.get('/statements', accountsController.listStatements);
router.post('/statements', accountsController.createStatement);
router.delete('/statements/:id', accountsController.deleteStatement);

module.exports = router;