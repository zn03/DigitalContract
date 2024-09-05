const express = require('express');
const router = express.Router();
const contractTypeProcessTemplate = require('../controllers/contractTypeProcessTemplate');

router.get('/', contractTypeProcessTemplate.getContractTypeProcessTemplateList);
router.post('/', contractTypeProcessTemplate.createContractTypeProcessTemplate);

module.exports = router;