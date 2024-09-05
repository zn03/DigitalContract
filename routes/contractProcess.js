const express = require('express');
const router = express.Router();
const contractProcess = require('../controllers/contractProcess');

router.get('/', contractProcess.getContractProcessList);
router.post('/', contractProcess.createContractProcess);

module.exports = router;