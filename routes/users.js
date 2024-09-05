const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

router.get('/', usersController.getUserList);
router.get('/identity', usersController.searchUserByIdNumber);
router.get('/:id', usersController.getUserById);
router.post('/', usersController.createUser);
router.put('/:id', usersController.updateUserById);

module.exports = router;
