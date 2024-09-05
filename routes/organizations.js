const express = require('express');
const router = express.Router();
const organizationsController = require('../controllers/organizations');

router.get('/', organizationsController.getOrganizationList);
router.get('/admin', organizationsController.getOrganizationByTaxCode)
router.get('/:id', organizationsController.findOrganizationById);
router.post('/', organizationsController.createOrganization);
router.put('/:id', organizationsController.updateOrganization);
router.delete('/:id', organizationsController.deleteOrganization);

module.exports = router;