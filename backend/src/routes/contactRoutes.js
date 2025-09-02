const express = require('express');
const { submitContact } = require('../controllers/contactController');
const { recaptchaMiddleware } = require('../middlewares/recaptchaMiddleware');

const router = express.Router();

router.post('/contact', recaptchaMiddleware.contact, submitContact);

module.exports = router;
