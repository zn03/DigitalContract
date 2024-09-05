const express = require('express');
const router = express.Router();
const contractTypeController = require('../controllers/contractTypes');

router.get('/', contractTypeController.getContractTypeList);
router.get('/contracts', contractTypeController.getContractTypeInContractList);
router.get('/:id', contractTypeController.getContractTypeById);
router.post('/', contractTypeController.createContractType);
router.put('/:id', contractTypeController.updateContractType);
router.delete('/:id', contractTypeController.deleteContractType);

module.exports = router;
