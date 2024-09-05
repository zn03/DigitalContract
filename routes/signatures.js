const express = require('express');
const router = express.Router();
const signatureController = require('../controllers/signatures');

router.get('/', signatureController.getSignatureList);
router.get('/:id', signatureController.getSignatureById);
router.post('/', signatureController.createSignature);
router.put('/:id', signatureController.updateSignature);
router.get('/user/:userId', signatureController.getSignatureByUserId);

module.exports = router;