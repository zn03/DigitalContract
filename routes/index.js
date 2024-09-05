const express = require('express');
const router = express.Router();
const {
  validateAccessToken
} = require('../middleware/authentication.middleware');
const { logger } = require('../config/logger');

require('dotenv').config();

const homeRouter = require('./home');
const authRouter = require('./auth');
const userRouter = require('./users');
const contractRouter = require('./contracts');
const organizationRouter = require('./organizations');
const contractTypeRouter = require('./contractTypes');
const contractProcessRouter = require('./contractProcess');
const contractTypeProcessTemplateRouter = require('./contractTypeProcessTemplate');
const signatureRouter = require('./signatures');


router.use('/', homeRouter);
router.use('/auth', authRouter);
router.use('/users', validateAccessToken, userRouter);
router.use('/contracts', validateAccessToken, contractRouter);
router.use('/organizations', validateAccessToken, organizationRouter);
router.use('/contractTypes', validateAccessToken, contractTypeRouter);
router.use('/contractProcess', validateAccessToken, contractProcessRouter);
router.use('/signatures', validateAccessToken, signatureRouter);

router.use(
  '/contractTypeProcessTemplate',
  validateAccessToken,
  contractTypeProcessTemplateRouter
);

logger.info('Loading routes...Done!');
module.exports = router;