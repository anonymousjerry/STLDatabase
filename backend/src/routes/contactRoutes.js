const express = require('express');
const { submitContact, sendWelcomeEmail } = require('../controllers/contactController');
const { recaptchaMiddleware } = require('../middlewares/recaptchaMiddleware');

const router = express.Router();

router.post('/contact', recaptchaMiddleware.contact, submitContact);
router.post('/welcome', sendWelcomeEmail); // Welcome endpoint (no reCAPTCHA middleware)

module.exports = router;
