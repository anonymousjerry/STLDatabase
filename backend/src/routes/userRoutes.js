const express = require('express')
const { register, login, googleAuth, getUserFavourites } = require('../controllers/userController');
const { recaptchaMiddleware } = require('../middlewares/recaptchaMiddleware');

const router = express.Router();

router.post('/register', recaptchaMiddleware.register, register);
router.post('/login', recaptchaMiddleware.login, login);
router.post('/google', googleAuth); // Google auth endpoint (no reCAPTCHA needed)

router.post('/getFavourites', getUserFavourites);

module.exports = router;