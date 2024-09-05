const express = require('express');
const router = express.Router();
const contractController = require('../controllers/contracts');
const { upload } = require('../utils/fileUtils');

// router.get('/:id/file/:filename', contractController.showFileContentInSignature);
router.get('/:id/file/:filename', contractController.showFileContent);
router.get('/', contractController.getContractList);
router.get('/:id', contractController.getContractById);
router.post(
  '/',
  upload.fields([
    { name: 'attachFile', maxCount: 1 },
    { name: 'subFiles', maxCount: Infinity }
  ]),
  contractController.createContract
);
router.put(
  '/:id',
  upload.fields([
    { name: 'attachFile', maxCount: 1 },
    { name: 'subFiles', maxCount: Infinity }
  ]),
  contractController.updateContractById
);
router.delete('/:id', contractController.deleteContractById);
router.post('/cancel', contractController.cancelContract);
router.post('/search', contractController.searchEntity);
router.get('/:id/download/:mark', contractController.downloadFile);
router.post('/:id/startSign', contractController.startSign);
router.post('/:id/approve', contractController.approveContract);
router.post('/:id/sign', contractController.signContract);

module.exports = router;
